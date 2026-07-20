import { headers } from '../store/DataHandler.js';
import { chartGlobalSettings } from '../js/charts.js';
import { commonChartOptions } from './uility.js';

// Theme function
const getTextColor = () => document.body.classList.contains('dark-theme') ? '#f8f9fa' : '#333';
const getGridLineColor = () => document.body.classList.contains('dark-theme') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

/**
 * 1. Waterfall Chart Option Generator
 * Cumulative bridge of values, essential for financial variance.
 */
export function getWaterfallChartOption(config, data) {
    if (!config || !config.columns || config.columns.length < 2) {
        return commonChartOptions({}, config, chartGlobalSettings);
    }

    const xAxisColumn = config.columns[0];
    const yAxisColumn = config.columns[1];
    const labelCol = headers[yAxisColumn] || yAxisColumn;

    const sampleSize = 15; // Waterfall is best with limited categories
    const sampledData = data.length > sampleSize ? data.slice(0, sampleSize) : data;

    let cumulative = 0;
    const placeholders = [];
    const values = [];
    const xData = [];

    // First, let's establish a "Start" or "Base" point if needed, or just flow
    sampledData.forEach((row, idx) => {
        const val = parseFloat(row[yAxisColumn]) || 0;
        const name = String(row[xAxisColumn]) || `Row ${idx + 1}`;
        xData.push(name);

        if (val >= 0) {
            placeholders.push(cumulative);
            cumulative += val;
            values.push({
                value: val,
                itemStyle: { color: '#198754' } // Green for positive
            });
        } else {
            cumulative += val; // negative, cumulative decreases
            placeholders.push(cumulative);
            values.push({
                value: -val,
                itemStyle: { color: '#dc3545' } // Red for negative
            });
        }
    });

    // Optionally add a Cumulative Total bar at the end
    xData.push('Total');
    placeholders.push(0);
    values.push({
        value: cumulative,
        itemStyle: { color: '#0d6efd' } // Primary color for total
    });

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                const tar = params[1] || params[0];
                const realVal = tar.name === 'Total' ? tar.value : (tar.color === '#dc3545' ? -tar.value : tar.value);
                return `${tar.name}<br/>${tar.seriesName} : <b>${realVal.toFixed(2)}</b>`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true,
            show: chartGlobalSettings.gridShowHide
        },
        xAxis: {
            type: 'category',
            splitLine: { show: false },
            data: xData,
            axisLabel: { color: getTextColor() }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: getTextColor() },
            splitLine: { lineStyle: { color: getGridLineColor() } }
        },
        series: [
            {
                name: 'Placeholder',
                type: 'bar',
                stack: 'Total',
                itemStyle: {
                    borderColor: 'transparent',
                    color: 'transparent'
                },
                emphasis: {
                    itemStyle: {
                        borderColor: 'transparent',
                        color: 'transparent'
                    }
                },
                data: placeholders
            },
            {
                name: labelCol,
                type: 'bar',
                stack: 'Total',
                label: {
                    show: true,
                    position: 'inside',
                    formatter: function(params) {
                        if (params.name === 'Total') return params.value.toFixed(1);
                        const isRed = params.color === '#dc3545' || params.color?.colorStops;
                        return (isRed ? '-' : '+') + params.value.toFixed(1);
                    }
                },
                data: values
            }
        ]
    };

    return commonChartOptions(option, config, chartGlobalSettings);
}

/**
 * 2. Heatmap Chart Option Generator
 * Intensity/correlation-like matrix grid.
 */
export function getHeatmapChartOption(config, data) {
    if (!config || !config.columns || config.columns.length < 2) {
        return commonChartOptions({}, config, chartGlobalSettings);
    }

    const xAxisColumn = config.columns[0];
    const yAxisColumns = config.columns.slice(1);

    const sampleSize = 30; // Limit for readable grid
    const sampledData = data.length > sampleSize ? data.slice(0, sampleSize) : data;

    const xData = sampledData.map(row => String(row[xAxisColumn]) || '');
    const yData = yAxisColumns.map(col => headers[col] || col);

    const heatmapData = [];
    let minVal = Infinity;
    let maxVal = -Infinity;

    sampledData.forEach((row, xIdx) => {
        yAxisColumns.forEach((col, yIdx) => {
            const val = parseFloat(row[col]) || 0;
            heatmapData.push([xIdx, yIdx, val]);
            if (val < minVal) minVal = val;
            if (val > maxVal) maxVal = val;
        });
    });

    if (minVal === Infinity) { minVal = 0; maxVal = 100; }
    if (minVal === maxVal) maxVal = minVal + 10;

    const option = {
        tooltip: {
            position: 'top',
            formatter: function (params) {
                return `Category: <b>${xData[params.data[0]]}</b><br/>Metric: <b>${yData[params.data[1]]}</b><br/>Value: <b>${params.data[2].toFixed(2)}</b>`;
            }
        },
        grid: {
            top: '10%',
            bottom: '15%',
            left: '10%',
            right: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: xData,
            splitArea: { show: true },
            axisLabel: { rotate: 45, color: getTextColor() }
        },
        yAxis: {
            type: 'category',
            data: yData,
            splitArea: { show: true },
            axisLabel: { color: getTextColor() }
        },
        visualMap: {
            min: minVal,
            max: maxVal,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            inRange: {
                color: ['#e0f3f8', '#fee090', '#d73027'] // Cold to warm gradient
            },
            textStyle: { color: getTextColor() }
        },
        series: [{
            name: 'Value Matrix',
            type: 'heatmap',
            data: heatmapData,
            label: {
                show: true,
                formatter: function(params) {
                    return params.data[2].toFixed(1);
                }
            },
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };

    return commonChartOptions(option, config, chartGlobalSettings);
}

/**
 * 3. Sankey Diagram Generator
 * Flow analysis across categories/metrics.
 */
export function getSankeyChartOption(config, data) {
    if (!config || !config.columns || config.columns.length < 2) {
        return commonChartOptions({}, config, chartGlobalSettings);
    }

    const xAxisColumn = config.columns[0];
    const yAxisColumns = config.columns.slice(1);

    const sampleSize = 10; // Sankey is highly visual, keep nodes readable
    const sampledData = data.length > sampleSize ? data.slice(0, sampleSize) : data;

    const nodesMap = new Set();
    const links = [];

    sampledData.forEach(row => {
        const source = String(row[xAxisColumn]) || 'Unknown Source';
        if (source.trim() === '') return;
        nodesMap.add(source);

        yAxisColumns.forEach(col => {
            const target = headers[col] || col;
            const val = parseFloat(row[col]) || 0;
            if (val > 0) {
                nodesMap.add(target);
                links.push({
                    source: source,
                    target: target,
                    value: val
                });
            }
        });
    });

    const nodes = Array.from(nodesMap).map(name => ({ name }));

    const option = {
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            formatter: function(params) {
                if (params.dataType === 'node') {
                    return `Node: <b>${params.name}</b>`;
                } else {
                    return `${params.data.source} ➔ ${params.data.target}: <b>${params.data.value.toFixed(2)}</b>`;
                }
            }
        },
        series: [
            {
                type: 'sankey',
                layout: 'none',
                emphasis: { focus: 'adjacency' },
                data: nodes,
                links: links,
                lineStyle: {
                    color: 'source',
                    curveness: 0.5
                },
                label: {
                    color: getTextColor(),
                    fontSize: 10
                }
            }
        ]
    };

    return commonChartOptions(option, config, chartGlobalSettings);
}

/**
 * 4. Bullet Chart Generator
 * Standard corporate KPI target comparisons.
 */
export function getBulletChartOption(config, data) {
    if (!config || !config.columns || config.columns.length < 2) {
        return commonChartOptions({}, config, chartGlobalSettings);
    }

    const xAxisColumn = config.columns[0];
    const actualCol = config.columns[1];
    const targetCol = config.columns[2] || null; // optional target column

    const sampleSize = 15;
    const sampledData = data.length > sampleSize ? data.slice(0, sampleSize) : data;

    const xData = sampledData.map(row => String(row[xAxisColumn]) || '');
    const actuals = sampledData.map(row => parseFloat(row[actualCol]) || 0);
    const targets = sampledData.map(row => targetCol ? (parseFloat(row[targetCol]) || 0) : (parseFloat(row[actualCol]) || 0) * 1.2); // Fallback: 120% target

    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Actual', 'Target'],
            textStyle: { color: getTextColor() }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: { color: getTextColor() },
            splitLine: { lineStyle: { color: getGridLineColor() } }
        },
        yAxis: {
            type: 'category',
            data: xData,
            axisLabel: { color: getTextColor() }
        },
        series: [
            {
                name: 'Actual',
                type: 'bar',
                barWidth: 16,
                data: actuals,
                itemStyle: {
                    color: config.color || '#0d6efd',
                    borderRadius: [0, 4, 4, 0]
                },
                z: 3
            },
            {
                name: 'Target',
                type: 'scatter',
                symbol: 'rect',
                symbolSize: [4, 24], // Thick vertical tick line
                data: targets,
                itemStyle: {
                    color: '#ffc107' // Target color
                },
                z: 4
            }
        ]
    };

    return commonChartOptions(option, config, chartGlobalSettings);
}

/**
 * 5. Boxplot Chart Generator
 * Statistical distributions grouped by categories.
 */
export function getBoxplotChartOption(config, data) {
    if (!config || !config.columns || config.columns.length < 2) {
        return commonChartOptions({}, config, chartGlobalSettings);
    }

    const xAxisColumn = config.columns[0];
    const yAxisColumn = config.columns[1];
    const metricLabel = headers[yAxisColumn] || yAxisColumn;

    // Helper to calculate five-number summaries (Min, Q1, Median, Q3, Max)
    function calculateBoxplotStats(arr) {
        const sorted = [...arr].filter(v => !isNaN(v) && v !== null).sort((a, b) => a - b);
        if (sorted.length === 0) return [0, 0, 0, 0, 0];
        
        const min = sorted[0];
        const max = sorted[sorted.length - 1];
        
        const getPercentile = (p) => {
            const pos = (sorted.length - 1) * p;
            const base = Math.floor(pos);
            const rest = pos - base;
            if (sorted[base + 1] !== undefined) {
                return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
            } else {
                return sorted[base];
            }
        };
        
        const q1 = getPercentile(0.25);
        const median = getPercentile(0.5);
        const q3 = getPercentile(0.75);
        
        return [min, q1, median, q3, max];
    }

    // Grouping values by category to form distribution boxplots
    const groups = {};
    data.forEach(row => {
        const key = String(row[xAxisColumn]) || 'Other';
        if (key.trim() === '') return;
        if (!groups[key]) groups[key] = [];
        const val = parseFloat(row[yAxisColumn]);
        if (!isNaN(val)) {
            groups[key].push(val);
        }
    });

    const categories = Object.keys(groups).slice(0, 15); // Limit to top 15 categories for visual space
    const boxplotData = categories.map(key => calculateBoxplotStats(groups[key]));

    const option = {
        title: {
            text: `${metricLabel} Distribution by ${headers[xAxisColumn] || xAxisColumn}`,
            left: 'center',
            textStyle: { fontSize: 12, color: getTextColor() }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: { type: 'shadow' },
            formatter: function (params) {
                return [
                    `Category: <b>${params.name}</b>`,
                    `Max: <b>${params.data[5].toFixed(2)}</b>`,
                    `Q3: <b>${params.data[4].toFixed(2)}</b>`,
                    `Median: <b>${params.data[3].toFixed(2)}</b>`,
                    `Q1: <b>${params.data[2].toFixed(2)}</b>`,
                    `Min: <b>${params.data[1].toFixed(2)}</b>`
                ].join('<br/>');
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            boundaryGap: true,
            nameGap: 30,
            splitArea: { show: false },
            axisLabel: { rotate: 45, color: getTextColor() },
            splitLine: { show: false }
        },
        yAxis: {
            type: 'value',
            name: metricLabel,
            axisLabel: { color: getTextColor() },
            splitLine: { lineStyle: { color: getGridLineColor() } }
        },
        series: [
            {
                name: 'Boxplot',
                type: 'boxplot',
                data: boxplotData,
                itemStyle: {
                    borderColor: config.color || '#0d6efd',
                    borderWidth: 1.5,
                    color: 'rgba(13, 110, 253, 0.1)'
                },
                tooltip: {
                    formatter: function(param) {
                        return [
                            `Category: <b>${param.name}</b>`,
                            `Max: <b>${param.value[5].toFixed(2)}</b>`,
                            `Q3: <b>${param.value[4].toFixed(2)}</b>`,
                            `Median: <b>${param.value[3].toFixed(2)}</b>`,
                            `Q1: <b>${param.value[2].toFixed(2)}</b>`,
                            `Min: <b>${param.value[1].toFixed(2)}</b>`
                        ].join('<br/>');
                    }
                }
            }
        ]
    };

    return commonChartOptions(option, config, chartGlobalSettings);
}
