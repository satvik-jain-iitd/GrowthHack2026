/* istanbul ignore file */
import {
    DownloadDBFootprintChartParams,
    DownloadDBFootprintTableParams,
    LegendItem,
    ChartHeaderLine
} from './types'

const getSafeDomainName = (companyDomainName: string) =>
    companyDomainName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

const chartHeaderTextPaddingLeft = 16

const downloadPngFromSvgMarkup = async (
    fileName: string,
    svgMarkup: string,
    width: number,
    height: number,
    headerLines: ChartHeaderLine[] = []
) => {
    const svgBlob = new Blob([svgMarkup], {
        type: 'image/svg+xml;charset=utf-8'
    })
    const svgUrl = URL.createObjectURL(svgBlob)

    try {
        await new Promise<void>((resolve, reject) => {
            const image = new Image()
            image.onload = () => {
                const canvas = document.createElement('canvas')
                const scale = 2
                const headerPaddingTop = headerLines.length > 0 ? 16 : 0
                const headerPaddingBottom = headerLines.length > 0 ? 10 : 0
                const headerLineHeight = 22
                const headerHeight =
                    headerLines.length > 0
                        ? headerPaddingTop +
                          headerLines.length * headerLineHeight +
                          headerPaddingBottom
                        : 0
                canvas.width = Math.max(1, Math.floor(width * scale))
                canvas.height = Math.max(
                    1,
                    Math.floor((height + headerHeight) * scale)
                )

                const context = canvas.getContext('2d')
                if (!context) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                context.scale(scale, scale)
                context.fillStyle = '#ffffff'
                context.fillRect(0, 0, width, height + headerHeight)

                if (headerLines.length > 0) {
                    context.textBaseline = 'top'
                    context.textAlign = 'left'

                    let y = headerPaddingTop
                    headerLines.forEach(line => {
                        context.font = line.font
                        context.fillStyle = line.color
                        context.fillText(
                            line.text,
                            chartHeaderTextPaddingLeft,
                            y
                        )
                        y += headerLineHeight
                    })
                }

                context.drawImage(image, 0, headerHeight, width, height)

                canvas.toBlob(blob => {
                    if (!blob) {
                        reject(new Error('Failed to create image'))
                        return
                    }
                    const pngUrl = URL.createObjectURL(blob)
                    const link = document.createElement('a')
                    link.href = pngUrl
                    link.download = fileName
                    link.click()
                    URL.revokeObjectURL(pngUrl)
                    resolve()
                }, 'image/png')
            }
            image.onerror = () => {
                reject(new Error('Failed to render image'))
            }
            image.src = svgUrl
        })
    } finally {
        URL.revokeObjectURL(svgUrl)
    }
}

const getChartLegendItems = (
    chartContainerElement: HTMLDivElement
): LegendItem[] => {
    const legendItems = Array.from(
        chartContainerElement.querySelectorAll<HTMLElement>(
            '.recharts-legend-item'
        )
    )

    return legendItems
        .map(item => {
            const label =
                item
                    .querySelector<HTMLElement>('.recharts-legend-item-text')
                    ?.textContent?.trim() ||
                item.textContent?.trim() ||
                ''

            if (!label) {
                return null
            }

            const markerPath = item.querySelector<SVGElement>('path')
            const markerCircle = item.querySelector<SVGElement>('circle')
            const markerRect = item.querySelector<SVGElement>('rect')
            const markerColor =
                markerPath?.getAttribute('fill') ||
                markerPath?.getAttribute('stroke') ||
                markerCircle?.getAttribute('fill') ||
                markerCircle?.getAttribute('stroke') ||
                markerRect?.getAttribute('fill') ||
                markerRect?.getAttribute('stroke')

            const textColor = window.getComputedStyle(
                item.querySelector('.recharts-legend-item-text') || item
            ).color

            return {
                label,
                color: markerColor || textColor || '#64748b'
            }
        })
        .filter((item): item is LegendItem => Boolean(item))
}

const downloadChartWithLegend = async (
    fileName: string,
    svgMarkup: string,
    width: number,
    height: number,
    legendItems: LegendItem[],
    headerLines: ChartHeaderLine[] = []
) => {
    const svgBlob = new Blob([svgMarkup], {
        type: 'image/svg+xml;charset=utf-8'
    })
    const svgUrl = URL.createObjectURL(svgBlob)

    try {
        await new Promise<void>((resolve, reject) => {
            const image = new Image()
            image.onload = async () => {
                const scale = 2
                const headerPaddingTop = headerLines.length > 0 ? 16 : 0
                const headerPaddingBottom = headerLines.length > 0 ? 10 : 0
                const headerLineHeight = 22
                const headerHeight =
                    headerLines.length > 0
                        ? headerPaddingTop +
                          headerLines.length * headerLineHeight +
                          headerPaddingBottom
                        : 0
                const legendPaddingX = 16
                const legendPaddingY = 12
                const markerSize = 10
                const itemGap = 18
                const rowGap = 10
                const textGap = 6
                const legendFont = '13px Arial, sans-serif'

                const measureCanvas = document.createElement('canvas')
                const measureContext = measureCanvas.getContext('2d')
                if (!measureContext) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                measureContext.font = legendFont
                const maxLegendWidth = Math.max(0, width - legendPaddingX * 2)
                const rows: LegendItem[][] = []
                let currentRow: LegendItem[] = []
                let currentRowWidth = 0

                const getLegendItemWidth = (item: LegendItem) =>
                    markerSize +
                    textGap +
                    Math.ceil(measureContext.measureText(item.label).width)

                legendItems.forEach(item => {
                    const itemWidth = getLegendItemWidth(item)
                    const widthWithGap =
                        currentRow.length === 0
                            ? itemWidth
                            : itemWidth + itemGap

                    if (
                        currentRow.length > 0 &&
                        currentRowWidth + widthWithGap > maxLegendWidth
                    ) {
                        rows.push(currentRow)
                        currentRow = [item]
                        currentRowWidth = itemWidth
                        return
                    }

                    currentRow.push(item)
                    currentRowWidth += widthWithGap
                })

                if (currentRow.length > 0) {
                    rows.push(currentRow)
                }

                const legendHeight =
                    legendItems.length > 0
                        ? legendPaddingY * 2 +
                          rows.length * markerSize +
                          Math.max(0, rows.length - 1) * rowGap
                        : 0

                const canvas = document.createElement('canvas')
                canvas.width = Math.max(1, Math.floor(width * scale))
                canvas.height = Math.max(
                    1,
                    Math.floor((height + headerHeight + legendHeight) * scale)
                )

                const context = canvas.getContext('2d')
                if (!context) {
                    reject(new Error('Canvas context not available'))
                    return
                }

                context.scale(scale, scale)
                context.fillStyle = '#ffffff'
                context.fillRect(
                    0,
                    0,
                    width,
                    height + headerHeight + legendHeight
                )

                if (headerLines.length > 0) {
                    context.textBaseline = 'top'
                    context.textAlign = 'left'

                    let y = headerPaddingTop
                    headerLines.forEach(line => {
                        context.font = line.font
                        context.fillStyle = line.color
                        context.fillText(
                            line.text,
                            chartHeaderTextPaddingLeft,
                            y
                        )
                        y += headerLineHeight
                    })
                }

                context.drawImage(image, 0, headerHeight, width, height)

                if (legendItems.length > 0) {
                    context.font = legendFont
                    context.textBaseline = 'middle'
                    context.textAlign = 'left'
                    context.fillStyle = '#111827'

                    let y =
                        headerHeight + height + legendPaddingY + markerSize / 2
                    rows.forEach(row => {
                        let x = legendPaddingX

                        row.forEach((item, index) => {
                            const itemWidth = getLegendItemWidth(item)
                            if (index > 0) {
                                x += itemGap
                            }

                            context.fillStyle = item.color
                            context.fillRect(
                                x,
                                y - markerSize / 2,
                                markerSize,
                                markerSize
                            )

                            context.fillStyle = '#111827'
                            context.fillText(
                                item.label,
                                x + markerSize + textGap,
                                y
                            )

                            x += itemWidth
                        })

                        y += markerSize + rowGap
                    })
                }

                try {
                    await downloadCanvasAsPng(canvas, fileName)
                    resolve()
                } catch (error) {
                    reject(error)
                }
            }
            image.onerror = () => {
                reject(new Error('Failed to render image'))
            }
            image.src = svgUrl
        })
    } finally {
        URL.revokeObjectURL(svgUrl)
    }
}

const downloadCanvasAsPng = async (
    canvas: HTMLCanvasElement,
    fileName: string
) => {
    await new Promise<void>((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                reject(new Error('Failed to create image'))
                return
            }

            const pngUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = pngUrl
            link.download = fileName
            link.click()
            URL.revokeObjectURL(pngUrl)
            resolve()
        }, 'image/png')
    })
}

const downloadChartImage = async (
    filePrefix: string,
    chartContainerElement: HTMLDivElement | null
) => {
    const svg = chartContainerElement?.querySelector('svg')
    if (!svg) {
        return
    }

    const { width, height } = svg.getBoundingClientRect()
    const serializer = new XMLSerializer()
    const svgMarkup = serializer.serializeToString(svg)
    const legendItems = chartContainerElement
        ? getChartLegendItems(chartContainerElement)
        : []
    const headerLines: ChartHeaderLine[] = chartContainerElement
        ? [
              chartContainerElement
                  .querySelector('[data-db-footprint-chart-domain]')
                  ?.textContent?.trim(),
              chartContainerElement
                  .querySelector('[data-db-footprint-chart-title]')
                  ?.textContent?.trim()
          ]
              .filter((line): line is string => Boolean(line))
              .map((text, index) => ({
                  text,
                  font:
                      index === 0
                          ? '600 16px Arial, sans-serif'
                          : '600 14px Arial, sans-serif',
                  color: '#111827'
              }))
        : []

    const fileName = `${filePrefix || 'db-footprint'}-chart.png`

    if (legendItems.length > 0) {
        await downloadChartWithLegend(
            fileName,
            svgMarkup,
            width,
            height,
            legendItems,
            headerLines
        )
        return
    }

    await downloadPngFromSvgMarkup(
        fileName,
        svgMarkup,
        width,
        height,
        headerLines
    )
}

const downloadTableImage = async (
    filePrefix: string,
    tableElement: HTMLElement | null
) => {
    if (!tableElement) {
        return
    }

    const captureElement =
        tableElement.querySelector('table') ||
        tableElement.querySelector('[role="table"]') ||
        tableElement

    const tableRows = Array.from(captureElement.querySelectorAll('tr'))
    if (tableRows.length === 0) {
        return
    }

    const rowCells = tableRows.map(row =>
        Array.from(row.querySelectorAll<HTMLTableCellElement>('th,td'))
    )

    let maxColumns = 0
    rowCells.forEach(cells => {
        const totalColumns = cells.reduce(
            (count, cell) => count + Math.max(1, Number(cell.colSpan) || 1),
            0
        )
        maxColumns = Math.max(maxColumns, totalColumns)
    })

    if (maxColumns === 0) {
        return
    }

    const minColumnWidth = 120
    const columnWidths = Array.from(
        { length: maxColumns },
        () => minColumnWidth
    )

    rowCells.forEach(cells => {
        let columnIndex = 0
        cells.forEach(cell => {
            const colSpan = Math.max(1, Number(cell.colSpan) || 1)
            const widthPerColumn = Math.ceil(
                (cell.getBoundingClientRect().width || minColumnWidth) / colSpan
            )

            for (let i = 0; i < colSpan; i += 1) {
                const targetIndex = columnIndex + i
                columnWidths[targetIndex] = Math.max(
                    columnWidths[targetIndex],
                    widthPerColumn
                )
            }
            columnIndex += colSpan
        })
    })

    const rowHeights = tableRows.map(row =>
        Math.max(34, Math.ceil(row.getBoundingClientRect().height || 34))
    )

    const width = columnWidths.reduce((sum, value) => sum + value, 0)
    const height = rowHeights.reduce((sum, value) => sum + value, 0)
    const scale = 2
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.floor(width * scale))
    canvas.height = Math.max(1, Math.floor(height * scale))

    const context = canvas.getContext('2d')
    if (!context) {
        return
    }

    context.scale(scale, scale)
    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, width, height)

    const drawText = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        align: CanvasTextAlign,
        isHeader: boolean
    ) => {
        const safeText = text || ''
        context.font = isHeader
            ? '600 13px Arial, sans-serif'
            : '13px Arial, sans-serif'
        context.fillStyle = '#111827'
        context.textBaseline = 'middle'
        context.textAlign = align

        const trimmed = safeText.replace(/\s+/g, ' ').trim()
        let renderedText = trimmed

        if (context.measureText(renderedText).width > maxWidth) {
            while (
                renderedText.length > 0 &&
                context.measureText(`${renderedText}...`).width > maxWidth
            ) {
                renderedText = renderedText.slice(0, -1)
            }
            renderedText = renderedText ? `${renderedText}...` : ''
        }

        context.fillText(renderedText, x, y)
    }

    let y = 0
    rowCells.forEach((cells, rowIndex) => {
        const rowHeight = rowHeights[rowIndex]
        const isHeaderRow = rowIndex === 0
        let x = 0
        let columnIndex = 0

        cells.forEach(cell => {
            const colSpan = Math.max(1, Number(cell.colSpan) || 1)
            const cellWidth = columnWidths
                .slice(columnIndex, columnIndex + colSpan)
                .reduce((sum, value) => sum + value, 0)

            context.fillStyle = isHeaderRow ? '#dde9f4' : '#ffffff'
            context.fillRect(x, y, cellWidth, rowHeight)

            context.strokeStyle = '#cbd5e1'
            context.lineWidth = 1
            context.strokeRect(x, y, cellWidth, rowHeight)

            const computedAlign = window.getComputedStyle(cell).textAlign
            const align: CanvasTextAlign =
                computedAlign === 'right' || computedAlign === 'center'
                    ? computedAlign
                    : 'left'

            const paddingX = 10
            const textX =
                align === 'right'
                    ? x + cellWidth - paddingX
                    : align === 'center'
                      ? x + cellWidth / 2
                      : x + paddingX
            drawText(
                cell.textContent || '',
                textX,
                y + rowHeight / 2,
                Math.max(0, cellWidth - paddingX * 2),
                align,
                isHeaderRow
            )

            x += cellWidth
            columnIndex += colSpan
        })

        y += rowHeight
    })

    await downloadCanvasAsPng(
        canvas,
        `${filePrefix || 'db-footprint'}-table.png`
    )
}

export const downloadDBFootprintChart = async ({
    companyDomainName,
    chartContainerElement
}: DownloadDBFootprintChartParams) => {
    const filePrefix = getSafeDomainName(companyDomainName)

    await downloadChartImage(filePrefix, chartContainerElement)
}

export const downloadDBFootprintTable = async ({
    companyDomainName,
    tableElement
}: DownloadDBFootprintTableParams) => {
    const filePrefix = getSafeDomainName(companyDomainName)

    await downloadTableImage(filePrefix, tableElement)
}
