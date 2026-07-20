export function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export function commonChartOptions(option, config, chartGlobalSettings) {
    if (!option) option = {};
    if (!config) config = {};
    
    option.title = { 
        show: false, 
        text: config.title || 'Chart', 
        left: 'center' 
    };
    option.animationDuration = chartGlobalSettings?.animationDuration || 1000;
    option.tooltip = {
        show: chartGlobalSettings?.tooltipOnOff !== false,
        trigger: 'axis',
        ...option.tooltip
    };
    
    option.legend = {
        show: chartGlobalSettings?.legendPosition !== 'none',
        bottom: chartGlobalSettings?.legendPosition === 'bottom' ? 0 : 'auto',
        top: chartGlobalSettings?.legendPosition === 'top' ? 20 : 'auto',
        left: chartGlobalSettings?.legendPosition === 'left' ? '5%' : 'auto',
        right: chartGlobalSettings?.legendPosition === 'right' ? '5%' : 'auto',
        orient: (chartGlobalSettings?.legendPosition === 'left' || chartGlobalSettings?.legendPosition === 'right') ? 'vertical' : 'horizontal'
    };

    // 1. Color Palette Selection
    if (Array.isArray(chartGlobalSettings?.colorPalette)) {
        option.color = chartGlobalSettings.colorPalette;
    } else if (config.columns && config.columns.length > 2) {
        option.color = ['#5470C6', '#91CC75', '#EE6666', '#FC8452', '#73C0DE', '#3BA272', '#FACC14', '#9A60B4', '#EA7CCC'];
    } else {
        option.color = config.color || '#5470C6';
    }

    // 2. Font Size Level Styling
    const fontSizeMap = {
        small: { title: 11, label: 9, legend: 9, axis: 9 },
        medium: { title: 14, label: 11, legend: 11, axis: 11 },
        large: { title: 18, label: 14, legend: 14, axis: 13 }
    };
    const size = fontSizeMap[chartGlobalSettings?.fontSize || 'medium'] || fontSizeMap.medium;

    if (option.title) {
        option.title.textStyle = {
            fontSize: size.title,
            ...option.title.textStyle
        };
    }
    if (option.legend) {
        option.legend.textStyle = {
            fontSize: size.legend,
            ...option.legend.textStyle
        };
    }

    const applyAxisLabelFontSizeAndGrid = (axis) => {
        if (!axis) return;
        const axes = Array.isArray(axis) ? axis : [axis];
        axes.forEach(a => {
            if (!a.axisLabel) a.axisLabel = {};
            a.axisLabel.fontSize = size.axis;

            // Apply grid line style
            if (a.type === 'value') {
                a.splitLine = {
                    show: chartGlobalSettings?.gridShowHide !== false && chartGlobalSettings?.gridStyle !== 'none',
                    lineStyle: {
                        type: chartGlobalSettings?.gridStyle || 'solid'
                    }
                };
            }
        });
    };
    applyAxisLabelFontSizeAndGrid(option.xAxis);
    applyAxisLabelFontSizeAndGrid(option.yAxis);

    // 3. Axis Formatter (compact, currency, percent)
    const getFormatter = (formatType) => {
        if (formatType === 'compact') {
            return (value) => {
                if (Math.abs(value) >= 10000000) {
                    return (value / 10000000).toFixed(1) + 'Cr';
                }
                if (Math.abs(value) >= 100000) {
                    return (value / 100000).toFixed(1) + 'L';
                }
                if (Math.abs(value) >= 1000) {
                    return (value / 1000).toFixed(1) + 'K';
                }
                return value;
            };
        } else if (formatType === 'currency') {
            return (value) => {
                return '₹' + Number(value).toLocaleString('en-IN');
            };
        } else if (formatType === 'percent') {
            return (value) => {
                return Number(value).toFixed(1) + '%';
            };
        }
        return null;
    };

    const applyFormatter = (axis) => {
        if (!axis) return;
        const axes = Array.isArray(axis) ? axis : [axis];
        axes.forEach(a => {
            if (a.type === 'value') {
                const formatter = getFormatter(chartGlobalSettings?.axisFormat);
                if (formatter) {
                    if (!a.axisLabel) a.axisLabel = {};
                    a.axisLabel.formatter = formatter;
                } else {
                    if (a.axisLabel) {
                        delete a.axisLabel.formatter;
                    }
                }
            }
        });
    };
    applyFormatter(option.xAxis);
    applyFormatter(option.yAxis);

    // 4. Series specifics (Labels, Line style, Area fill, Bar corners)
    if (option.series) {
        const seriesArray = Array.isArray(option.series) ? option.series : [option.series];
        seriesArray.forEach(s => {
            // General Labels show/hide and font size
            if (!s.label) s.label = {};
            s.label.show = chartGlobalSettings?.showLabels !== false;
            s.label.fontSize = size.label;

            // Line style and area fill
            if (s.type === 'line') {
                if (chartGlobalSettings?.lineStyle === 'smooth') {
                    s.smooth = true;
                    s.step = false;
                } else if (chartGlobalSettings?.lineStyle === 'step') {
                    s.step = 'middle';
                    s.smooth = false;
                } else {
                    s.smooth = false;
                    s.step = false;
                }

                if (chartGlobalSettings?.areaFill) {
                    s.areaStyle = { opacity: 0.3 };
                } else {
                    delete s.areaStyle;
                }
            }

            // Rounded bar corners
            if (s.type === 'bar') {
                if (chartGlobalSettings?.barRounded) {
                    s.itemStyle = {
                        borderRadius: [5, 5, 0, 0],
                        ...s.itemStyle
                    };
                } else {
                    if (s.itemStyle) {
                        delete s.itemStyle.borderRadius;
                    }
                }
            }
        });
    }

    // 5. Smart ECharts Toolbox
    if (chartGlobalSettings?.showToolbox) {
        option.toolbox = {
            show: true,
            feature: {
                dataView: { readOnly: false, title: 'डेटा देखें', lang: ['डेटा देखें', 'बंद करें', 'अपडेट करें'] },
                magicType: { type: ['line', 'bar', 'stack'], title: { line: 'लाइन', bar: 'बार', stack: 'स्टैक' } },
                restore: { title: 'रीसेट करें' },
                saveAsImage: { title: 'इमेज सेव करें' }
            },
            right: '5%',
            top: '0%'
        };
    } else {
        delete option.toolbox;
    }

    // 6. DataZoom support
    if (chartGlobalSettings?.zoomEnable) {
        option.dataZoom = [
            {
                type: 'inside',
                start: 0,
                end: 100
            },
            {
                show: true,
                type: 'slider',
                bottom: 10,
                start: 0,
                end: 100
            }
        ];
        if (!option.grid) option.grid = {};
        option.grid.bottom = chartGlobalSettings?.legendPosition === 'bottom' ? 70 : 50;
    } else {
        delete option.dataZoom;
    }

    return option;
}


// uility.js mein ye functions add karo
export const getThemeColor = () => {
    return document.body.classList.contains('dark-theme') ? '#f8f9fa' : '#333';
};

export const getSampledData = (data, maxPoints = 100) => {
    if (data.length <= maxPoints) return data;
    const step = Math.ceil(data.length / maxPoints);
    return data.filter((_, i) => i % step === 0);
};

export const getAxisConfig = (isCategory, show, label, data, themeColor) => {
    return {
        show,
        type: isCategory ? 'category' : 'value',
        name: label,
        data: isCategory ? data : null,
        axisLabel: { color: themeColor }
    };
};