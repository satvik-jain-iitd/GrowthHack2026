/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs')
const file = 'coverage/coverage-summary.json'

const getUnitTestResults = () => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            return console.error(err)
        }
        const parsedData = JSON.parse(data).total
        const results = {
            lines: parseFloat(parsedData.lines.pct.toFixed(2)),
            statements: parseFloat(parsedData.statements.pct.toFixed(2)),
            functions: parseFloat(parsedData.functions.pct.toFixed(2)),
            branches: parseFloat(parsedData.branches.pct.toFixed(2))
        }
        const coverageMet = Object.values(results).every(num => num > 80)

        results.title = coverageMet
            ? '✅ Test Coverage Report Generated:'
            : '🚨 Test Coverage Did Not Meet Threshold (80%):'
        const content = `unit_test_results=${JSON.stringify(results)}`

        fs.writeFile(process.env.GITHUB_OUTPUT, content, err => {
            if (err) {
                console.error(err)
            } else {
                console.info('Wrote to environment')
            }
        })
    })
}

getUnitTestResults()

module.exports = { getUnitTestResults }
