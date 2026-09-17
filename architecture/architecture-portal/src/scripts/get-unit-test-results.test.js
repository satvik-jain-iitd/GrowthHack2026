/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
jest.mock('fs')
const { getUnitTestResults } = require('./get-unit-test-results')

describe('Coverage Report Generator', () => {
    const mockData = {
        total: {
            lines: { pct: 85.45 },
            statements: { pct: 86.78 },
            functions: { pct: 90.1 },
            branches: { pct: 82.9 }
        }
    }

    beforeEach(() => {
        jest.clearAllMocks()
        process.env.GITHUB_OUTPUT = 'output.txt'
    })

    it('should read coverage file, parse it, and write success output', done => {
        fs.readFile.mockImplementation((path, encoding, callback) => {
            callback(null, JSON.stringify(mockData))
        })
        fs.writeFile.mockImplementation((path, content, callback) => {
            expect(path).toBe('output.txt')
            const parsed = JSON.parse(content.replace('unit_test_results=', ''))
            expect(parsed.lines).toBe(85.45)
            expect(parsed.statements).toBe(86.78)
            expect(parsed.functions).toBe(90.1)
            expect(parsed.branches).toBe(82.9)
            expect(parsed.title).toBe('✅ Test Coverage Report Generated:')
            callback(null)
            done()
        })

        getUnitTestResults()
    })

    it('should write failure title when coverage is too low', done => {
        mockData.total.lines.pct = 79.99

        fs.readFile.mockImplementation((_, __, callback) => {
            callback(null, JSON.stringify(mockData))
        })
        fs.writeFile.mockImplementation((path, content, callback) => {
            expect(path).toBe('output.txt')
            const parsed = JSON.parse(content.replace('unit_test_results=', ''))
            expect(parsed.title).toBe(
                '🚨 Test Coverage Did Not Meet Threshold (80%):'
            )
            callback(null)
            done()
        })

        getUnitTestResults()
    })

    it('should log error if readFile fails', done => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        fs.readFile.mockImplementation((_, __, callback) => {
            callback(new Error('Read error'), null)
        })

        getUnitTestResults()

        setTimeout(() => {
            expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
            consoleSpy.mockRestore()
            done()
        }, 0)
    })

    it('should log error if writeFile fails', done => {
        const consoleSpy = jest
            .spyOn(console, 'error')
            .mockImplementation(() => {})

        fs.readFile.mockImplementation((_, __, callback) => {
            callback(null, JSON.stringify(mockData))
        })
        fs.writeFile.mockImplementation((_, __, callback) => {
            callback(new Error('Write error'))
            setTimeout(() => {
                expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
                consoleSpy.mockRestore()
                done()
            }, 0)
        })

        getUnitTestResults()
    })
})
