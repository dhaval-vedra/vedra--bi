import { allActiveChartInstances } from './chartState.js';
import { showMessage } from './utils.js';

// Alert helpers
function showSuccessAlert(message) {
    showMessage(message, 'success');
}

function showErrorAlert(message) {
    showMessage(message, 'danger');
}


// रेडीमेड इफ़ेक्ट्स टेम्पलेट्स
export const chartEffectsTemplates = [
    {
        id: 'effect-shadow-light',
        name: 'हल्की परछाई',
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowBlur: 10,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        backgroundColor: '#f8f9fa',
        borderColor: '#e9ecef',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
        cardStyleType: 'solid',
        cardHoverAnimation: 'float'
    },
    {
        id: 'effect-shadow-dark',
        name: 'गहरी परछाई',
        shadowColor: 'rgba(0, 0, 0, 0.4)',
        shadowBlur: 15,
        shadowOffsetX: 5,
        shadowOffsetY: 5,
        backgroundColor: '#1e1e1e',
        borderColor: '#333333',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
        cardStyleType: 'solid',
        cardHoverAnimation: 'zoom'
    },
    {
        id: 'effect-cyberpunk',
        name: 'साइबरपंक नियॉन (Cyberpunk Neon)',
        shadowColor: 'rgba(0, 240, 255, 0.5)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        backgroundColor: '#0a0e17',
        borderColor: '#ff007f',
        borderWidth: 2,
        borderStyle: 'solid',
        borderRadius: 14,
        cardStyleType: 'solid',
        cardHoverAnimation: 'glow'
    },
    {
        id: 'effect-sunset-fire',
        name: 'सूर्यास्त अग्नि (Sunset Fire)',
        shadowColor: 'rgba(246, 79, 89, 0.4)',
        shadowBlur: 18,
        shadowOffsetX: 0,
        shadowOffsetY: 6,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        borderStyle: 'none',
        borderRadius: 16,
        cardStyleType: 'gradient',
        gradientPreset: 'sunset',
        cardHoverAnimation: 'float'
    },
    {
        id: 'effect-emerald',
        name: 'पन्ना वन (Emerald Glow)',
        shadowColor: 'rgba(11, 163, 96, 0.35)',
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        borderStyle: 'none',
        borderRadius: 16,
        cardStyleType: 'gradient',
        gradientPreset: 'emerald',
        cardHoverAnimation: 'zoom'
    },
    {
        id: 'effect-retro-gold',
        name: 'विंटेज गोल्ड (Retro Gold)',
        shadowColor: 'rgba(212, 175, 55, 0.25)',
        shadowBlur: 12,
        shadowOffsetX: 4,
        shadowOffsetY: 4,
        backgroundColor: '#fffdf0',
        borderColor: '#d4af37',
        borderWidth: 3,
        borderStyle: 'double',
        borderRadius: 8,
        cardStyleType: 'solid',
        cardHoverAnimation: 'float'
    },
    {
        id: 'effect-minimalist',
        name: 'आधुनिक न्यूनतम (Minimalist)',
        shadowColor: 'rgba(0, 0, 0, 0.03)',
        shadowBlur: 8,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        backgroundColor: '#ffffff',
        borderColor: '#f1f5f9',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 12,
        cardStyleType: 'solid',
        cardHoverAnimation: 'none'
    },
    {
        id: 'effect-glass-frosted',
        name: 'फ्रॉस्टेड ग्लास (Frosted Glass)',
        shadowColor: 'rgba(0, 0, 0, 0.08)',
        shadowBlur: 15,
        shadowOffsetX: 0,
        shadowOffsetY: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderColor: 'rgba(255, 255, 255, 0.25)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderRadius: 16,
        cardStyleType: 'glass',
        cardHoverAnimation: 'float'
    }
];

// ===============================
// Utility Functions
// ===============================

/**
 * चार्ट DOM एलिमेंट प्राप्त करें
 */
function getChartDom(chartInstanceOrId) {
    if (chartInstanceOrId && typeof chartInstanceOrId.getDom === 'function') {
        return chartInstanceOrId.getDom(); // ECharts instance
    }
    if (typeof chartInstanceOrId === 'string') {
        return document.getElementById(chartInstanceOrId); // by id
    }
    if (chartInstanceOrId instanceof HTMLElement) {
        return chartInstanceOrId; // already DOM
    }
    return null;
}

/**
 * इफ़ेक्ट ऑब्जेक्ट वैलिडेशन
 */
function validateEffectObject(effectObj) {
    if (!effectObj || typeof effectObj !== 'object') {
        throw new Error('इफ़ेक्ट ऑब्जेक्ट वैध नहीं है');
    }

    const requiredProps = ['shadowColor', 'shadowBlur', 'backgroundColor', 'borderColor', 'borderWidth'];
    const missingProps = requiredProps.filter(prop => !effectObj.hasOwnProperty(prop));
    
    if (missingProps.length > 0) {
        throw new Error(`आवश्यक प्रॉपर्टीज गुम हैं: ${missingProps.join(', ')}`);
    }

    // टाइप चेक
    if (typeof effectObj.shadowBlur !== 'number' || effectObj.shadowBlur < 0) {
        throw new Error('shadowBlur एक सकारात्मक संख्या होनी चाहिए');
    }

    if (typeof effectObj.borderWidth !== 'number' || effectObj.borderWidth < 0) {
        throw new Error('borderWidth एक सकारात्मक संख्या होनी चाहिए');
    }

    return true;
}

/**
 * डिबाउंस फंक्शन
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===============================
// Unified Effect Function
// ===============================

/**
 * चार्ट पर इफ़ेक्ट लागू करें
 */
export function applyEffect(chartInstanceOrId, effectObj) {
    try {
        const chartDom = getChartDom(chartInstanceOrId);
        if (!chartDom) {
            console.warn('चार्ट DOM नहीं मिला:', chartInstanceOrId);
            return false;
        }

        if (!effectObj) {
            throw new Error('इफ़ेक्ट ऑब्जेक्ट आवश्यक है');
        }

        // वैलिडेशन
        validateEffectObject(effectObj);

        const {
            shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
            backgroundColor, borderColor, borderWidth, borderStyle, borderRadius,
            cardStyleType, gradientPreset, customGradientText, cardHoverAnimation, extraOverlayEffects
        } = effectObj;

        // Resolve the outer container and the inner chart elements
        const container = chartDom.closest('.visualization-container') || chartDom;
        const innerChart = chartDom.classList.contains('chart-canvas') || chartDom.classList.contains('js-plotly-plot')
            ? chartDom
            : (container.querySelector('.chart-canvas, .js-plotly-plot') || chartDom);

        // CLEAR everything first to prevent old styling leakage!
        // Reset styles and classes of BOTH the container and the inner chart
        [container, innerChart].forEach(el => {
            if (!el) return;
            el.style.backgroundColor = '';
            el.style.background = '';
            el.style.color = '';
            el.style.border = '';
            el.style.borderColor = '';
            el.style.borderWidth = '';
            el.style.borderStyle = '';
            el.style.boxShadow = '';
            el.style.backdropFilter = '';
            el.style.webkitBackdropFilter = '';
            el.style.borderRadius = '';
            el.style.animation = '';
            el.style.transition = '';
            el.classList.remove('hover-effect-float', 'hover-effect-zoom', 'hover-effect-glow', 'chart-effect-applied');
        });

        // Set ECharts background option to transparent so the container background shows through beautifully!
        let activeECharts = null;
        if (chartInstanceOrId && typeof chartInstanceOrId.setOption === 'function') {
            activeECharts = chartInstanceOrId;
        } else if (innerChart && innerChart.__echarts__) {
            activeECharts = innerChart.__echarts__;
        } else if (innerChart && typeof echarts !== 'undefined' && echarts.getInstanceByDom) {
            activeECharts = echarts.getInstanceByDom(innerChart);
        }

        if (activeECharts && typeof activeECharts.setOption === 'function') {
            try {
                activeECharts.setOption({ backgroundColor: 'transparent' }, false);
            } catch (e) {
                console.warn('Error setting ECharts background to transparent:', e);
            }
        }

        const resolvedBorderStyle = borderStyle || 'solid';
        const resolvedBorderRadius = borderRadius !== undefined ? `${borderRadius}px` : '12px';

        // Calculate Box Shadow with optional overlay shadows
        let baseShadow = `${shadowOffsetX || 0}px ${shadowOffsetY || 0}px ${shadowBlur || 0}px ${shadowColor || 'rgba(0,0,0,0.1)'}`;
        if (extraOverlayEffects === 'inset-shadow') {
            baseShadow += `, inset 0 0 15px rgba(0, 0, 0, 0.2)`;
        } else if (extraOverlayEffects === 'vignette') {
            baseShadow += `, inset 0 0 40px rgba(0, 0, 0, 0.35)`;
        }
        container.style.boxShadow = baseShadow;

        // Apply pulse animation if requested to the container
        if (extraOverlayEffects === 'pulse') {
            container.style.animation = 'pulse-glow-animation 3s infinite alternate ease-in-out';
            if (!document.getElementById('pulse-glow-style')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'pulse-glow-style';
                styleEl.textContent = `
                    @keyframes pulse-glow-animation {
                        0% { transform: scale(1); box-shadow: 0 0 5px rgba(0,0,0,0.1); }
                        50% { transform: scale(1.01); box-shadow: 0 0 15px rgba(0,200,255,0.25); }
                        100% { transform: scale(1); box-shadow: 0 0 5px rgba(0,0,0,0.1); }
                    }
                `;
                document.head.appendChild(styleEl);
            }
        }

        if (cardStyleType === 'gradient') {
            let gradValue = 'linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)';
            if (gradientPreset === 'sunset') gradValue = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
            else if (gradientPreset === 'ocean') gradValue = 'linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)';
            else if (gradientPreset === 'royal') gradValue = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            else if (gradientPreset === 'emerald') gradValue = 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)';
            else if (gradientPreset === 'darkknight') gradValue = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
            else if (gradientPreset === 'custom' && customGradientText) gradValue = customGradientText;

            container.style.background = gradValue;
            if (borderWidth > 0 && borderColor && resolvedBorderStyle !== 'none') {
                container.style.border = `${borderWidth}px ${resolvedBorderStyle} ${borderColor}`;
            } else {
                container.style.border = 'none';
            }
            container.style.borderRadius = resolvedBorderRadius;
        } else if (cardStyleType === 'glass') {
            container.style.backdropFilter = 'blur(12px)';
            container.style.webkitBackdropFilter = 'blur(12px)';
            container.style.background = 'rgba(255, 255, 255, 0.12)';
            container.style.border = `${borderWidth || 1}px ${resolvedBorderStyle} ${borderColor || 'rgba(255, 255, 255, 0.25)'}`;
            container.style.borderRadius = resolvedBorderRadius;
        } else if (cardStyleType === 'neumorphic') {
            container.style.background = backgroundColor || '#f8f9fa';
            container.style.boxShadow = '9px 9px 16px rgba(0, 0, 0, 0.08), -9px -9px 16px rgba(255, 255, 255, 0.5)';
            container.style.border = 'none';
            container.style.borderRadius = resolvedBorderRadius;
        } else {
            // Standard Solid Background with Shadow
            if (backgroundColor) {
                container.style.backgroundColor = backgroundColor;
            } else {
                container.style.backgroundColor = '';
            }

            if (borderColor && borderWidth !== undefined && resolvedBorderStyle !== 'none') {
                container.style.border = `${borderWidth}px ${resolvedBorderStyle} ${borderColor}`;
            } else {
                container.style.border = '';
            }
            container.style.borderRadius = resolvedBorderRadius;
        }

        // Apply Hover Animation to container
        if (cardHoverAnimation && cardHoverAnimation !== 'none') {
            container.classList.add(`hover-effect-${cardHoverAnimation}`);
        }

        // फीडबैक एनिमेशन
        container.style.transition = "all 0.4s ease";
        container.classList.add("chart-effect-applied");
        
        setTimeout(() => {
            container.classList.remove("chart-effect-applied");
        }, 800);

        return true;
    } catch (error) {
        console.error('इफ़ेक्ट लागू करने में त्रुटि:', error);
        showErrorAlert(`इफ़ेक्ट लागू करने में त्रुटि: ${error.message}`);
        return false;
    }
}

/**
 * चार्ट के इफ़ेक्ट रीसेट करें
 */
export function resetEffects(chartInstanceOrId) {
    const chartDom = getChartDom(chartInstanceOrId);
    if (!chartDom) return false;

    try {
        const container = chartDom.closest('.visualization-container') || chartDom;
        const innerChart = chartDom.classList.contains('chart-canvas') || chartDom.classList.contains('js-plotly-plot')
            ? chartDom
            : (container.querySelector('.chart-canvas, .js-plotly-plot') || chartDom);

        [container, innerChart].forEach(el => {
            if (!el) return;
            el.style.boxShadow = '';
            el.style.backgroundColor = '';
            el.style.background = '';
            el.style.color = '';
            el.style.border = '';
            el.style.borderRadius = '';
            el.style.backdropFilter = '';
            el.style.webkitBackdropFilter = '';
            el.style.animation = '';
            el.style.transition = '';
            el.classList.remove(
                'hover-effect-float', 'hover-effect-zoom', 'hover-effect-glow',
                'chart-effect-applied'
            );
        });
        
        let activeECharts = null;
        if (chartInstanceOrId && typeof chartInstanceOrId.setOption === 'function') {
            activeECharts = chartInstanceOrId;
        } else if (innerChart && innerChart.__echarts__) {
            activeECharts = innerChart.__echarts__;
        } else if (innerChart && typeof echarts !== 'undefined' && echarts.getInstanceByDom) {
            activeECharts = echarts.getInstanceByDom(innerChart);
        }

        if (activeECharts && typeof activeECharts.setOption === 'function') {
            activeECharts.setOption({ backgroundColor: 'transparent' }, false);
        }

        return true;
    } catch (error) {
        console.error('इफ़ेक्ट रीसेट करने में त्रुटि:', error);
        return false;
    }
}

/**
 * कस्टम इफ़ेक्ट सेव करें
 */
export function saveCustomEffect(effectObj, name) {
    try {
        const customEffects = JSON.parse(localStorage.getItem('customChartEffects') || '[]');
        const newEffect = {
            ...effectObj,
            id: `custom-effect-${Date.now()}`,
            name: name || `कस्टम इफ़ेक्ट ${customEffects.length + 1}`,
            createdAt: new Date().toISOString()
        };
        
        customEffects.push(newEffect);
        localStorage.setItem('customChartEffects', JSON.stringify(customEffects));
        
        showSuccessAlert('कस्टम इफ़ेक्ट सफलतापूर्वक सेव हुआ!');
        return newEffect.id;
    } catch (error) {
        console.error('कस्टम इफ़ेक्ट सेव करने में त्रुटि:', error);
        showErrorAlert('कस्टम इफ़ेक्ट सेव करने में त्रुटि');
        return null;
    }
}

/**
 * सेव्ड कस्टम इफ़ेक्ट्स लोड करें
 */
export function loadCustomEffects() {
    try {
        return JSON.parse(localStorage.getItem('customChartEffects') || '[]');
    } catch (error) {
        console.error('कस्टम इफ़ेक्ट्स लोड करने में त्रुटि:', error);
        return [];
    }
}

// ===============================
// Chart Effects Gallery Rendering
// ===============================

/**
 * इफ़ेक्ट टेम्पलेट्स गैलरी रेंडर करें
 */
export function renderChartEffectsTemplates(galleryElement, onSelectCallback) {
    if (!galleryElement) return;

    try {
        galleryElement.innerHTML = '';
        
        // प्री-डिफाइंड टेम्पलेट्स
        chartEffectsTemplates.forEach(template => {
            const templateDiv = createEffectTemplateCard(template);
            galleryElement.appendChild(templateDiv);

            templateDiv.addEventListener('click', () => {
                // सभी सेलेक्शन हटाएं
                galleryElement.querySelectorAll('.chart-effect-template-item').forEach(card => {
                    card.classList.remove('selected', 'border-primary');
                });
                
                // नया सेलेक्ट करें
                templateDiv.classList.add('selected', 'border-primary');
                if (onSelectCallback) onSelectCallback(template.id);
            });
        });

        // कस्टम इफ़ेक्ट्स
        const customEffects = loadCustomEffects();
        if (customEffects.length > 0) {
            const separator = document.createElement('div');
            separator.className = 'w-100 border-top my-3';
            galleryElement.appendChild(separator);

            const customHeader = document.createElement('h6');
            customHeader.className = 'text-muted mb-2';
            customHeader.textContent = 'कस्टम इफ़ेक्ट्स';
            galleryElement.appendChild(customHeader);

            customEffects.forEach(template => {
                const templateDiv = createEffectTemplateCard(template);
                galleryElement.appendChild(templateDiv);

                templateDiv.addEventListener('click', () => {
                    galleryElement.querySelectorAll('.chart-effect-template-item').forEach(card => {
                        card.classList.remove('selected', 'border-primary');
                    });
                    templateDiv.classList.add('selected', 'border-primary');
                    if (onSelectCallback) onSelectCallback(template.id);
                });
            });
        }

    } catch (error) {
        console.error('इफ़ेक्ट गैलरी रेंडर करने में त्रुटि:', error);
        galleryElement.innerHTML = '<p class="text-danger">गैलरी लोड करने में त्रुटि</p>';
    }
}

/**
 * इफ़ेक्ट टेम्पलेट कार्ड बनाएं
 */
function createEffectTemplateCard(template) {
    const templateDiv = document.createElement('div');
    templateDiv.classList.add('chart-effect-template-item', 'border', 'bg-light', 'p-3', 'mb-2');
    templateDiv.dataset.id = template.id;

    const previewBox = document.createElement('div');
    previewBox.className = 'effect-preview-box';
    previewBox.style.cssText = `
        width: 80px;
        height: 50px;
        margin: 0 auto 8px;
        background-color: ${template.backgroundColor};
        border: ${template.borderWidth}px solid ${template.borderColor};
        box-shadow: ${template.shadowOffsetX}px ${template.shadowOffsetY}px ${template.shadowBlur}px ${template.shadowColor};
        border-radius: 6px;
        transition: transform 0.2s ease;
    `;
    templateDiv.appendChild(previewBox);

    const templateName = document.createElement('div');
    templateName.className = 'template-name text-center';
    templateName.textContent = template.name;
    templateDiv.appendChild(templateName);

    // हॉवर इफ़ेक्ट
    templateDiv.addEventListener('mouseenter', () => {
        previewBox.style.transform = 'scale(1.05)';
    });
    
    templateDiv.addEventListener('mouseleave', () => {
        previewBox.style.transform = 'scale(1)';
    });

    return templateDiv;
}

// ===============================
// Dashboard Chart List Rendering
// ===============================

/**
 * डैशबोर्ड चार्ट लिस्ट रेंडर करें
 */
export function renderDashboardChartList(listElement) {
    if (!listElement) return;

    try {
        listElement.innerHTML = '';
        let chartCount = 0;
        const addedIds = new Set();

        // ECharts इंस्टेंसेस
        allActiveChartInstances.forEach((chart, index) => {
            const chartDom = getChartDom(chart);
            if (!chartDom) return;

            const chartId = chartDom.id || `chart-${Date.now()}-${index}`;
            if (addedIds.has(chartId)) return;
            addedIds.add(chartId);

            const option = chart.getOption ? chart.getOption() : {};
            const chartTitle = option.title?.[0]?.text || `चार्ट ${index + 1}`;
            const chartImage = chart.getDataURL ? chart.getDataURL({ pixelRatio: 1, backgroundColor: 'transparent' }) : '';

            const listItem = createChartListItem(chartId, chartTitle, chartImage, 'ECharts');
            listElement.appendChild(listItem);
            chartCount++;
        });

        // Plotly / HTML5 / Other चार्ट्स
        document.querySelectorAll('.chart-canvas, .js-plotly-plot').forEach((dom, idx) => {
            if (dom.id) {
                const chartId = dom.id;
                if (addedIds.has(chartId)) return;

                // Check if it is an active ECharts instance
                let isEChartsInstance = false;
                if (typeof echarts !== 'undefined' && echarts.getInstanceByDom) {
                    if (echarts.getInstanceByDom(dom)) {
                        isEChartsInstance = true;
                    }
                }
                if (isEChartsInstance) return;

                addedIds.add(chartId);

                const chartTitle = dom.closest('.visualization-container')?.querySelector('.chart-title')?.textContent ||
                    `Plotly Chart ${idx + 1}`;

                let previewImage = '';
                try {
                    const canvas = dom.querySelector('canvas');
                    const svg = dom.querySelector('svg');
                    if (canvas) {
                        previewImage = canvas.toDataURL('image/png');
                    } else if (svg) {
                        previewImage = 'svg';
                    }
                } catch (e) {
                    console.warn('Plotly प्रिव्यू इमेज बनाने में त्रुटि:', e);
                }

                const listItem = createChartListItem(chartId, chartTitle, previewImage, 'Plotly');
                listElement.appendChild(listItem);
                chartCount++;
            }
        });

        if (chartCount === 0) {
            listElement.innerHTML = '<p class="text-muted small text-center">कोई चार्ट उपलब्ध नहीं है।</p>';
        } else {
            const counter = document.createElement('div');
            counter.className = 'text-muted small mt-2';
            counter.textContent = `कुल ${chartCount} चार्ट मिले`;
            listElement.appendChild(counter);
        }

    } catch (error) {
        console.error('चार्ट लिस्ट रेंडर करने में त्रुटि:', error);
        listElement.innerHTML = '<p class="text-danger">चार्ट लिस्ट लोड करने में त्रुटि</p>';
    }
}

// Debounced version of renderDashboardChartList
export const debouncedRenderChartList = debounce(renderDashboardChartList, 250);


/**
 * चार्ट लिस्ट आइटम बनाएं
 */
function createChartListItem(chartId, chartTitle, previewImage, chartType) {
    const div = document.createElement('div');
    div.classList.add('form-check', 'd-flex', 'align-items-center', 'mb-2', 'p-2', 'border', 'rounded');
    
    let previewHtml = '';
    if (previewImage === 'svg') {
        previewHtml = `<div class="bg-light border rounded me-2 d-flex align-items-center justify-content-center" style="width:40px; height:30px;">
            <small class="text-muted">SVG</small>
        </div>`;
    } else if (previewImage) {
        previewHtml = `<img src="${previewImage}" alt="${chartTitle}" width="40" height="30" class="chart-preview-image border rounded me-2">`;
    } else {
        previewHtml = `<div class="bg-light border rounded me-2 d-flex align-items-center justify-content-center" style="width:40px; height:30px;">
            <i class="bi bi-bar-chart text-muted"></i>
        </div>`;
    }

    div.innerHTML = `
        <input class="form-check-input me-2" type="checkbox" value="${chartId}" id="effects-checkbox-${chartId}">
        <label class="form-check-label d-flex align-items-center w-100" for="effects-checkbox-${chartId}">
            ${previewHtml}
            <div class="flex-grow-1">
                <div class="small fw-bold">${chartTitle}</div>
                <div class="text-muted" style="font-size: 0.7rem;">${chartType}</div>
            </div>
        </label>
    `;

    return div;
}

// ===============================
// JSON Parser for custom effect
// ===============================

/**
 * कस्टम इफ़ेक्ट कोड पार्स करें
 */
function parseCustomEffectCode(jsonString) {
    const errorAlert = document.getElementById('codeErrorAlert');
    if (errorAlert) {
        errorAlert.style.display = 'none';
    }

    try {
        if (!jsonString.trim()) {
            throw new Error('JSON कोड खाली है');
        }

        const parsed = JSON.parse(jsonString);
        validateEffectObject(parsed);
        return parsed;
    } catch (error) {
        const errorMessage = `JSON पार्स करने में त्रुटि: ${error.message}`;
        console.error(errorMessage);
        
        if (errorAlert) {
            errorAlert.textContent = errorMessage;
            errorAlert.style.display = 'block';
        } else {
            showErrorAlert(errorMessage);
        }
        return null;
    }
}

// ===============================
// CodeMirror Setup
// ===============================

let codeMirrorEditor = null;
let currentTextareaId = null;

// ===============================
// Professional JSON Presets
// ===============================
const CONTAINER_PRESETS = {
    "glassmorphism": {
        "style": {
            "backdropFilter": "blur(12px)",
            "webkitBackdropFilter": "blur(12px)",
            "background": "rgba(255, 255, 255, 0.12)",
            "border": "1px solid rgba(255, 255, 255, 0.25)",
            "borderRadius": "16px",
            "boxShadow": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
            "padding": "20px",
            "transition": "all 0.3s ease"
        },
        "chartBackgroundColor": "transparent"
    },
    "neon_cyberpunk": {
        "style": {
            "backgroundColor": "#0d0e15",
            "border": "2px solid #00ffcc",
            "borderRadius": "12px",
            "boxShadow": "0 0 15px rgba(0, 255, 204, 0.4), inset 0 0 10px rgba(0, 255, 204, 0.2)",
            "padding": "20px",
            "transition": "all 0.3s ease"
        },
        "chartBackgroundColor": "transparent"
    },
    "warm_minimalist": {
        "style": {
            "backgroundColor": "#fdfbf7",
            "border": "1px solid #e6dfd3",
            "borderRadius": "20px",
            "boxShadow": "0 4px 20px rgba(139, 120, 90, 0.08)",
            "padding": "24px",
            "transition": "all 0.3s ease"
        },
        "chartBackgroundColor": "transparent"
    },
    "dark_slate": {
        "style": {
            "backgroundColor": "#1e293b",
            "border": "1px solid #334155",
            "borderRadius": "14px",
            "boxShadow": "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
            "padding": "20px",
            "transition": "all 0.3s ease"
        },
        "chartBackgroundColor": "transparent"
    }
};

const EFFECT_PRESETS = {
    "glowing_aura": {
        "shadowColor": "rgba(99, 102, 241, 0.5)",
        "shadowBlur": 20,
        "shadowOffsetX": 0,
        "shadowOffsetY": 4,
        "backgroundColor": "#0f172a",
        "borderColor": "#6366f1",
        "borderWidth": 2,
        "borderStyle": "solid",
        "borderRadius": 16,
        "cardStyleType": "solid",
        "extraOverlayEffects": "pulse",
        "cardHoverAnimation": "glow"
    },
    "sunset_gradient": {
        "shadowColor": "rgba(253, 160, 133, 0.3)",
        "shadowBlur": 15,
        "shadowOffsetX": 0,
        "shadowOffsetY": 6,
        "backgroundColor": "#ffffff",
        "borderColor": "#fda085",
        "borderWidth": 1,
        "borderStyle": "solid",
        "borderRadius": 12,
        "cardStyleType": "gradient",
        "gradientPreset": "sunset",
        "extraOverlayEffects": "none",
        "cardHoverAnimation": "float"
    },
    "deep_ocean_glass": {
        "shadowColor": "rgba(0, 0, 0, 0.4)",
        "shadowBlur": 25,
        "shadowOffsetX": 0,
        "shadowOffsetY": 10,
        "backgroundColor": "rgba(18, 194, 233, 0.15)",
        "borderColor": "rgba(255, 255, 255, 0.2)",
        "borderWidth": 1,
        "borderStyle": "solid",
        "borderRadius": 18,
        "cardStyleType": "glass",
        "extraOverlayEffects": "inset-shadow",
        "cardHoverAnimation": "zoom"
    },
    "futuristic_neumorphic": {
        "shadowColor": "rgba(0,0,0,0.05)",
        "shadowBlur": 12,
        "shadowOffsetX": 4,
        "shadowOffsetY": 4,
        "backgroundColor": "#e0e8f0",
        "borderColor": "#ffffff",
        "borderWidth": 1,
        "borderStyle": "none",
        "borderRadius": 24,
        "cardStyleType": "neumorphic",
        "extraOverlayEffects": "none",
        "cardHoverAnimation": "float"
    }
};

/**
 * Live updates the mock preview card's styles
 */
/**
 * Live updates the mock preview card's styles with dual-mode support
 */
function applyLivePreviewStyles(code, textareaId) {
    try {
        const mockCard = document.getElementById('mockPreviewCard');
        if (!mockCard) return;

        // Reset inline styles
        mockCard.style.cssText = '';
        mockCard.style.width = '100%';
        mockCard.style.maxWidth = '400px';
        mockCard.style.transition = 'all 0.3s ease';
        mockCard.className = "card p-4 transition-all";

        // Restore active hover classes
        mockCard.classList.remove('hover-effect-float', 'hover-effect-zoom', 'hover-effect-glow');

        // Determine current preview mode (default: combined)
        const previewMode = window.previewMode || 'combined';

        // Retrieve current values of both textareas
        const containerTextarea = document.getElementById('customChartContainerCode');
        const effectsTextarea = document.getElementById('customEffectCode');

        let containerCode = containerTextarea ? containerTextarea.value : '{}';
        let effectsCode = effectsTextarea ? effectsTextarea.value : '{}';

        // Code overrides based on the active editor context (to ensure what they type is instantly reflected)
        if (typeof codeMirrorEditor !== 'undefined' && codeMirrorEditor) {
            const currentCode = codeMirrorEditor.getValue();
            if (textareaId === 'customChartContainerCode') {
                containerCode = currentCode;
            } else if (textareaId === 'customEffectCode') {
                effectsCode = currentCode;
            }
        }

        let containerParsed = {};
        try {
            containerParsed = JSON.parse(containerCode || '{}');
        } catch (e) {}

        let effectsParsed = {};
        try {
            effectsParsed = JSON.parse(effectsCode || '{}');
        } catch (e) {}

        // Set workspace context badges
        const workspaceBadge = document.getElementById('workspaceBadge');
        const mockTitle = document.getElementById('mockPreviewTitle');
        if (workspaceBadge) {
            if (textareaId === 'customChartContainerCode') {
                workspaceBadge.textContent = "CONTAINER DESIGN WORKSPACE";
                workspaceBadge.className = "badge bg-info bg-opacity-20 text-info border border-info border-opacity-25 py-1 px-2";
                if (mockTitle) mockTitle.textContent = "Container Layout Output";
            } else {
                workspaceBadge.textContent = "VISUAL EFFECTS WORKSPACE";
                workspaceBadge.className = "badge bg-warning bg-opacity-20 text-warning border border-warning border-opacity-25 py-1 px-2";
                if (mockTitle) mockTitle.textContent = "Effects & Animations Output";
            }
        }

        // 1. APPLY CONTAINER STYLING (if mode is combined or container)
        if (previewMode === 'combined' || previewMode === 'container') {
            if (containerParsed.style) {
                Object.assign(mockCard.style, containerParsed.style);
            }
            // Set mock chart background area style
            const mockChartArea = document.getElementById('mockPreviewChartArea') || mockCard.querySelector('.py-2');
            if (mockChartArea) {
                if (containerParsed.chartBackgroundColor) {
                    mockChartArea.style.backgroundColor = containerParsed.chartBackgroundColor;
                    mockChartArea.style.borderRadius = '8px';
                    mockChartArea.style.padding = '8px';
                } else {
                    mockChartArea.style.backgroundColor = 'transparent';
                    mockChartArea.style.padding = '';
                }
            }
        }

        // 2. APPLY EFFECT STYLING (if mode is combined or effects)
        if (previewMode === 'combined' || previewMode === 'effects') {
            const {
                shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY,
                backgroundColor, borderColor, borderWidth, borderStyle, borderRadius,
                cardStyleType, gradientPreset, customGradientText, cardHoverAnimation, extraOverlayEffects
            } = effectsParsed;

            const resolvedBorderStyle = borderStyle || 'solid';
            const resolvedBorderRadius = borderRadius !== undefined ? `${borderRadius}px` : (containerParsed.style?.borderRadius || '16px');

            // Apply shadow
            if (shadowColor || shadowBlur !== undefined) {
                let baseShadow = `${shadowOffsetX || 0}px ${shadowOffsetY || 0}px ${shadowBlur || 0}px ${shadowColor || 'rgba(0,0,0,0.1)'}`;
                if (extraOverlayEffects === 'inset-shadow') {
                    baseShadow += `, inset 0 0 15px rgba(0, 0, 0, 0.2)`;
                } else if (extraOverlayEffects === 'vignette') {
                    baseShadow += `, inset 0 0 40px rgba(0, 0, 0, 0.35)`;
                }
                mockCard.style.boxShadow = baseShadow;
            }

            // Pulse animation
            if (extraOverlayEffects === 'pulse') {
                mockCard.style.animation = 'pulse-glow-animation 3s infinite alternate ease-in-out';
            } else {
                mockCard.style.animation = '';
            }

            // Background Type styling (overriding base background if defined)
            if (cardStyleType === 'gradient') {
                let gradValue = 'linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)';
                if (gradientPreset === 'sunset') gradValue = 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)';
                else if (gradientPreset === 'ocean') gradValue = 'linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)';
                else if (gradientPreset === 'royal') gradValue = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                else if (gradientPreset === 'emerald') gradValue = 'linear-gradient(135deg, #0ba360 0%, #3cba92 100%)';
                else if (gradientPreset === 'darkknight') gradValue = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
                else if (gradientPreset === 'custom' && customGradientText) gradValue = customGradientText;

                mockCard.style.background = gradValue;
                if (borderWidth > 0 && borderColor && resolvedBorderStyle !== 'none') {
                    mockCard.style.border = `${borderWidth}px ${resolvedBorderStyle} ${borderColor}`;
                } else {
                    mockCard.style.border = 'none';
                }
                mockCard.style.borderRadius = resolvedBorderRadius;
            } else if (cardStyleType === 'glass') {
                mockCard.style.backdropFilter = 'blur(12px)';
                mockCard.style.webkitBackdropFilter = 'blur(12px)';
                mockCard.style.background = 'rgba(255, 255, 255, 0.12)';
                mockCard.style.border = `${borderWidth || 1}px ${resolvedBorderStyle} ${borderColor || 'rgba(255, 255, 255, 0.25)'}`;
                mockCard.style.borderRadius = resolvedBorderRadius;
            } else if (cardStyleType === 'neumorphic') {
                mockCard.style.background = backgroundColor || '#f8f9fa';
                mockCard.style.boxShadow = '9px 9px 16px rgba(0, 0, 0, 0.08), -9px -9px 16px rgba(255, 255, 255, 0.5)';
                mockCard.style.border = 'none';
                mockCard.style.borderRadius = resolvedBorderRadius;
            } else if (cardStyleType === 'solid') {
                if (backgroundColor) {
                    mockCard.style.backgroundColor = backgroundColor;
                }
                if (borderColor && borderWidth !== undefined && resolvedBorderStyle !== 'none') {
                    mockCard.style.border = `${borderWidth}px ${resolvedBorderStyle} ${borderColor}`;
                } else {
                    mockCard.style.border = '';
                }
                mockCard.style.borderRadius = resolvedBorderRadius;
            }

            // Hover animation class
            if (cardHoverAnimation && cardHoverAnimation !== 'none') {
                mockCard.classList.add(`hover-effect-${cardHoverAnimation}`);
            }
        }

        // Adjust text color based on lightness
        const titleEl = document.getElementById('mockPreviewTitle');
        if (titleEl) {
            const isLightBg = mockCard.style.backgroundColor === '#ffffff' || 
                              mockCard.style.backgroundColor === '#fdfbf7' || 
                              mockCard.style.backgroundColor === '#f8f9fa' ||
                              containerParsed.style?.backgroundColor === '#ffffff' || 
                              containerParsed.style?.backgroundColor === '#fdfbf7' ||
                              effectsParsed.backgroundColor === '#ffffff' ||
                              effectsParsed.backgroundColor === '#f8f9fa';

            if (isLightBg && effectsParsed.cardStyleType !== 'glass' && effectsParsed.cardStyleType !== 'gradient') {
                titleEl.className = "mb-1 text-dark fw-bold";
            } else {
                titleEl.className = "mb-1 text-white fw-bold";
            }
        }

    } catch (e) {
        console.error('Error applying live preview styles:', e);
    }
}

/**
 * CodeMirror एडिटर इनिशियलाइज़ करें
 */
function initializeCodeMirror(textareaId) {
    const editorContainer = document.getElementById('editorContainer');
    if (!editorContainer) {
        console.error('CodeMirror कंटेनर नहीं मिला');
        return;
    }

    // Clear old instances to avoid bugs
    if (codeMirrorEditor) {
        editorContainer.innerHTML = '';
        codeMirrorEditor = null;
    }

    try {
        codeMirrorEditor = CodeMirror(editorContainer, {
            mode: "application/json",
            lineNumbers: true,
            theme: "dracula",
            matchBrackets: true,
            autofocus: true,
            lint: true,
            gutters: ["CodeMirror-linenumbers", "CodeMirror-lint-markers"],
            lineWrapping: true
        });

        console.log(`CodeMirror initialized successfully for ${textareaId}`);

        // Helper updates status message
        const updateStatus = (text, type) => {
            const logEl = document.getElementById('editorStatusLog');
            const badgeEl = document.getElementById('jsonStatusBadge');
            
            if (logEl) {
                logEl.textContent = text;
                if (type === 'danger') {
                    logEl.className = "text-danger animate__animated animate__headShake";
                } else if (type === 'success') {
                    logEl.className = "text-success-emphasis fw-semibold";
                } else {
                    logEl.className = "text-muted";
                }
            }
            if (badgeEl) {
                badgeEl.textContent = type === 'success' ? 'VALID' : (type === 'danger' ? 'ERR' : 'EDIT');
                badgeEl.className = `badge bg-${type === 'success' ? 'success' : (type === 'danger' ? 'danger' : 'secondary')}`;
            }
        };

        // Inject guide text
        const guideTextEl = document.getElementById('jsonFormatGuideText');
        if (guideTextEl) {
            if (textareaId === 'customChartContainerCode') {
                guideTextEl.innerHTML = `
                    <div class="row text-white-50 g-2" style="font-size: 0.72rem;">
                        <div class="col-6">
                            <span class="text-info fw-bold">style:</span> Custom CSS styles for chart container.<br>
                            <span class="text-info fw-bold">style.borderRadius:</span> Radius in px (e.g., "16px").<br>
                            <span class="text-info fw-bold">style.background:</span> Background color or gradient.
                        </div>
                        <div class="col-6">
                            <span class="text-info fw-bold">style.boxShadow:</span> Container drop shadow value.<br>
                            <span class="text-info fw-bold">style.backdropFilter:</span> Blur styling (e.g. "blur(10px)").<br>
                            <span class="text-info fw-bold">chartBackgroundColor:</span> Color of actual chart object.
                        </div>
                    </div>
                `;
            } else {
                guideTextEl.innerHTML = `
                    <div class="row text-white-50 g-2" style="font-size: 0.72rem;">
                        <div class="col-6">
                            <span class="text-info fw-bold">shadowColor:</span> Shadow hex or rgba color.<br>
                            <span class="text-info fw-bold">shadowBlur:</span> Drop shadow blur width.<br>
                            <span class="text-info fw-bold">cardStyleType:</span> "solid" | "gradient" | "glass" | "neumorphic"
                        </div>
                        <div class="col-6">
                            <span class="text-info fw-bold">extraOverlayEffects:</span> "pulse" | "inset-shadow" | "vignette" | "none"<br>
                            <span class="text-info fw-bold">cardHoverAnimation:</span> "float" | "zoom" | "glow" | "none"<br>
                            <span class="text-info fw-bold">borderRadius / borderWidth:</span> Positive number counts.
                        </div>
                    </div>
                `;
            }
        }

        // Setup Presets Dropdown
        const selPresets = document.getElementById('selPresetsJson');
        if (selPresets) {
            selPresets.innerHTML = '<option value="">-- Choose a Preset Design --</option>';
            const presets = textareaId === 'customChartContainerCode' ? CONTAINER_PRESETS : EFFECT_PRESETS;
            
            Object.keys(presets).forEach(key => {
                const opt = document.createElement('option');
                opt.value = key;
                opt.textContent = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + ' Design Preset';
                selPresets.appendChild(opt);
            });

            selPresets.onchange = () => {
                const val = selPresets.value;
                if (val && presets[val]) {
                    codeMirrorEditor.setValue(JSON.stringify(presets[val], null, 4));
                }
            };
        }

        // Action: Format (Beautify)
        const btnBeautify = document.getElementById('btnBeautifyJson');
        if (btnBeautify) {
            btnBeautify.onclick = () => {
                try {
                    const code = codeMirrorEditor.getValue();
                    const parsed = JSON.parse(code);
                    codeMirrorEditor.setValue(JSON.stringify(parsed, null, 4));
                    updateStatus("✓ JSON formatted successfully", "success");
                } catch (e) {
                    updateStatus(`✗ Formatter error: ${e.message}`, "danger");
                }
            };
        }

        // Action: Minify
        const btnMinify = document.getElementById('btnMinifyJson');
        if (btnMinify) {
            btnMinify.onclick = () => {
                try {
                    const code = codeMirrorEditor.getValue();
                    const parsed = JSON.parse(code);
                    codeMirrorEditor.setValue(JSON.stringify(parsed));
                    updateStatus("✓ JSON minified successfully", "success");
                } catch (e) {
                    updateStatus(`✗ Minifier error: ${e.message}`, "danger");
                }
            };
        }

        // Action: Validate
        const btnValidate = document.getElementById('btnValidateJson');
        if (btnValidate) {
            btnValidate.onclick = () => {
                try {
                    const code = codeMirrorEditor.getValue();
                    const parsed = JSON.parse(code);
                    if (textareaId === 'customEffectCode') {
                        validateEffectObject(parsed);
                    }
                    updateStatus("✓ JSON structure is 100% valid!", "success");
                } catch (e) {
                    updateStatus(`✗ Validation failed: ${e.message}`, "danger");
                }
            };
        }

        // Code Change Listener (Real-time tracking, diagnostics & dashboard preview syncing)
        codeMirrorEditor.on("change", () => {
            const code = codeMirrorEditor.getValue();
            
            // Diagnostics
            const totalLines = codeMirrorEditor.lineCount();
            const rawSize = code.length;
            
            const totalLinesEl = document.getElementById('editorTotalLines');
            if (totalLinesEl) totalLinesEl.textContent = totalLines;
            
            const textSizeEl = document.getElementById('editorTextSize');
            if (textSizeEl) {
                textSizeEl.textContent = rawSize < 1024 ? `${rawSize} B` : `${(rawSize / 1024).toFixed(1)} KB`;
            }

            // Real-time Validation and Live Previews
            try {
                if (!code.trim()) {
                    updateStatus("Editor empty. Input JSON.", "secondary");
                    return;
                }

                const parsed = JSON.parse(code);
                if (textareaId === 'customEffectCode') {
                    validateEffectObject(parsed);
                }

                updateStatus("✓ JSON is Valid", "success");
                applyLivePreviewStyles(code, textareaId);

                // Live Sync with Dashboard if toggled
                const chkLiveSync = document.getElementById('chkLiveSyncDashboard');
                if (chkLiveSync && chkLiveSync.checked) {
                    if (textareaId === 'customChartContainerCode') {
                        import('./chartContainerColors.js').then(({ applyCustomChartContainerColor }) => {
                            import('./chartState.js').then(({ allActiveChartInstances }) => {
                                const applyToAll = document.getElementById('scopeAllCharts')?.checked || false;
                                const selectedChartIds = applyToAll ? [] : Array.from(document.querySelectorAll('#chartSelectionList input[type="checkbox"]:checked')).map(cb => cb.value);
                                
                                // Suppress alert temporarily to prevent constant typing popups
                                const oldAlert = window.alert;
                                window.alert = () => {};
                                try {
                                    applyCustomChartContainerColor(parsed, allActiveChartInstances, applyToAll, selectedChartIds);
                                } catch (error) {}
                                window.alert = oldAlert;
                            });
                        });
                    } else {
                        import('./chartState.js').then(({ allActiveChartInstances }) => {
                            const applyToAll = document.getElementById('applyToAllRadio')?.checked;
                            let chartsToUpdate = [];

                            if (applyToAll) {
                                allActiveChartInstances.forEach(chartInst => chartsToUpdate.push(chartInst));
                                document.querySelectorAll('.chart-canvas, .js-plotly-plot').forEach(dom => {
                                    if (!dom.__echarts__) chartsToUpdate.push(dom);
                                });
                            } else {
                                const chartList = document.getElementById('chartSelectionListEffects');
                                if (chartList) {
                                    const checkedBoxes = chartList.querySelectorAll('input[type="checkbox"]:checked');
                                    checkedBoxes.forEach(checkbox => {
                                        const chartId = checkbox.value;
                                        const chartInstance = echarts?.getInstanceByDom?.(document.getElementById(chartId));
                                        if (chartInstance) {
                                            chartsToUpdate.push(chartInstance);
                                        } else {
                                            const chartDom = document.getElementById(chartId);
                                            if (chartDom) chartsToUpdate.push(chartDom);
                                        }
                                    });
                                }
                            }

                            const oldAlert = window.alert;
                            window.alert = () => {};
                            try {
                                chartsToUpdate.forEach(chart => {
                                    applyEffect(chart, parsed);
                                });
                            } catch (error) {}
                            window.alert = oldAlert;
                        });
                    }
                }
            } catch (err) {
                updateStatus(`✗ JSON Error: ${err.message}`, "danger");
            }
        });

        // Bind Mode Switcher Buttons
        const btnCombined = document.getElementById('btnPreviewModeCombined');
        const btnContainer = document.getElementById('btnPreviewModeContainer');
        const btnEffects = document.getElementById('btnPreviewModeEffects');

        if (btnCombined && btnContainer && btnEffects) {
            // Set initial active state based on window.previewMode
            const activeMode = window.previewMode || 'combined';
            btnCombined.classList.toggle('active', activeMode === 'combined');
            btnContainer.classList.toggle('active', activeMode === 'container');
            btnEffects.classList.toggle('active', activeMode === 'effects');

            const setMode = (mode) => {
                window.previewMode = mode;
                btnCombined.classList.toggle('active', mode === 'combined');
                btnContainer.classList.toggle('active', mode === 'container');
                btnEffects.classList.toggle('active', mode === 'effects');
                
                // Re-apply preview styles
                const code = codeMirrorEditor ? codeMirrorEditor.getValue() : '';
                applyLivePreviewStyles(code, textareaId);
            };

            btnCombined.onclick = () => setMode('combined');
            btnContainer.onclick = () => setMode('container');
            btnEffects.onclick = () => setMode('effects');
        }

    } catch (e) {
        console.error("CodeMirror initialization failed:", e);
    }
}

// ===============================
// INJECT INITIALIZATION & LISTENERS
// ===============================

export function initializeChartEffects() {
    try {
        // एलिमेंट्स
        const applyChartEffects = document.getElementById('applyChartEffects');
        const resetAllEffects = document.getElementById('resetAllEffects');
        const saveCustomEffectBtn = document.getElementById('saveCustomEffectBtn');
        const refreshChartsListBtn = document.getElementById('refreshChartsListBtn');

        // रेडियो बटन्स
        const customEffectsRadio = document.getElementById('customEffectsRadio');
        const templateEffectsRadio = document.getElementById('templateEffectsRadio');
        const customCodeRadio = document.getElementById('customCodeRadio');

        // सेक्शन्स
        const customEffectsSection = document.getElementById('customEffectsSection');
        const templateEffectsSection = document.getElementById('templateEffectsSection');
        const customCodeEffectsSection = document.getElementById('customCodeEffectsSection');

        // वैलिडेशन
        if (!applyChartEffects) {
            console.log('applyChartEffects element not found, skipping chart effects initialization.');
            return;
        }

        // टैब स्विचिंग
        function setupTabSwitching() {
            const radios = [customEffectsRadio, templateEffectsRadio, customCodeRadio];
            const sections = [customEffectsSection, templateEffectsSection, customCodeEffectsSection];

            radios.forEach((radio, index) => {
                if (radio) {
                    radio.onchange = () => {
                        sections.forEach((section, sectionIndex) => {
                            if (section) {
                                section.style.display = sectionIndex === index ? 'block' : 'none';
                            }
                        });
                    };
                }
            });
        }

        // कोड एडिटर मोडल सेटअप
        async function setupCodeEditor() {
            const openChartFormatEditorBtn = document.getElementById('openChartFormatEditorBtn');
            const openChartEffectEditorBtn = document.getElementById('openChartEffectEditorBtn');

            const initModalAndShow = async (textareaId) => {
                const { loadDynamicContent } = await import('./dynamicLoader.js');
                await loadDynamicContent('codeEditorModal', 'codeEditorModal');

                const modalEl = document.getElementById('codeEditorModal');
                const codeEditorModal = (typeof bootstrap !== 'undefined' && modalEl) ? bootstrap.Modal.getOrCreateInstance(modalEl) : null;

                currentTextareaId = textareaId;
                initializeCodeMirror(currentTextareaId);

                const textarea = document.getElementById(currentTextareaId);
                if (textarea && codeMirrorEditor) {
                    codeMirrorEditor.setValue(textarea.value);
                    applyLivePreviewStyles(textarea.value, currentTextareaId);
                    if (codeEditorModal) codeEditorModal.show();
                }

                // Bind save button if not already done
                const saveCodeBtn = document.getElementById('saveCodeBtn');
                if (saveCodeBtn) {
                    saveCodeBtn.onclick = () => {
                        if (currentTextareaId && codeMirrorEditor) {
                            const textarea = document.getElementById(currentTextareaId);
                            if (textarea) {
                                textarea.value = codeMirrorEditor.getValue();
                            }
                        }
                        if (codeEditorModal) codeEditorModal.hide();
                    };
                }

                // Bind shown.bs.modal if not already done
                if (modalEl) {
                    modalEl.onshown = () => {
                        if (codeMirrorEditor) {
                            setTimeout(() => {
                                codeMirrorEditor.refresh();
                                codeMirrorEditor.focus();
                            }, 100);
                        }
                    };
                }
            };

            if (openChartFormatEditorBtn) {
                openChartFormatEditorBtn.onclick = async () => {
                    await initModalAndShow('customChartContainerCode');
                };
            }

            if (openChartEffectEditorBtn) {
                openChartEffectEditorBtn.onclick = async () => {
                    await initModalAndShow('customEffectCode');
                };
            }
        }

        // मेन एप्लाई बटन
        function setupApplyButton() {
            applyChartEffects.onclick = () => {
                let selectedEffect = null;

                try {
                    if (customEffectsRadio?.checked) {
                        // कस्टम इफ़ेक्ट्स
                        selectedEffect = {
                            shadowColor: document.getElementById('shadowColor')?.value || 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: parseInt(document.getElementById('shadowBlur')?.value) || 10,
                            shadowOffsetX: parseInt(document.getElementById('shadowOffsetX')?.value) || 0,
                            shadowOffsetY: parseInt(document.getElementById('shadowOffsetY')?.value) || 5,
                            backgroundColor: document.getElementById('backgroundColor')?.value || '#ffffff',
                            borderColor: document.getElementById('borderColor')?.value || '#000000',
                            borderWidth: parseInt(document.getElementById('borderWidth')?.value) || 1,
                            borderStyle: document.getElementById('borderStyle')?.value || 'solid',
                            borderRadius: parseInt(document.getElementById('borderRadius')?.value) || 12,
                            extraOverlayEffects: document.getElementById('extraOverlayEffects')?.value || 'none',
                            cardStyleType: document.getElementById('cardStyleType')?.value || 'solid',
                            gradientPreset: document.getElementById('gradientPreset')?.value || 'ocean',
                            customGradientText: document.getElementById('customGradientText')?.value || '',
                            cardHoverAnimation: document.getElementById('cardHoverAnimation')?.value || 'none'
                        };
                    } else if (templateEffectsRadio?.checked) {
                        // टेम्पलेट इफ़ेक्ट्स
                        const selectedTemplateId = document.querySelector('.chart-effect-template-item.selected')?.dataset.id;
                        if (selectedTemplateId) {
                            selectedEffect = chartEffectsTemplates.find(t => t.id === selectedTemplateId) ||
                                           loadCustomEffects().find(t => t.id === selectedTemplateId);
                        }
                    } else if (customCodeRadio?.checked) {
                        // कस्टम कोड
                        const customCode = document.getElementById('customEffectCode')?.value;
                        if (customCode) {
                            selectedEffect = parseCustomEffectCode(customCode);
                        }
                    }

                    if (!selectedEffect) {
                        throw new Error('कृपया एक इफ़ेक्ट चुनें, टेम्पलेट चुनें या कोड दर्ज करें।');
                    }

                    // चार्ट्स सिलेक्शन
                    const applyToAll = document.getElementById('applyToAllRadio')?.checked;
                    let chartsToUpdate = [];

                    if (applyToAll) {
                        // सभी चार्ट्स
                        allActiveChartInstances.forEach(chartInst => chartsToUpdate.push(chartInst));
                        document.querySelectorAll('.chart-canvas, .js-plotly-plot').forEach(dom => {
                            if (!dom.__echarts__) chartsToUpdate.push(dom);
                        });
                    } else {
                        // सिलेक्टेड चार्ट्स
                        const chartList = document.getElementById('chartSelectionListEffects');
                        if (chartList) {
                            const checkedBoxes = chartList.querySelectorAll('input[type="checkbox"]:checked');
                            if (checkedBoxes.length === 0) {
                                throw new Error('कृपया कम से कम एक चार्ट सिलेक्ट करें');
                            }

                            checkedBoxes.forEach(checkbox => {
                                const chartId = checkbox.value;
                                const chartInstance = echarts?.getInstanceByDom?.(document.getElementById(chartId));
                                if (chartInstance) {
                                    chartsToUpdate.push(chartInstance);
                                } else {
                                    const chartDom = document.getElementById(chartId);
                                    if (chartDom) chartsToUpdate.push(chartDom);
                                }
                            });
                        }
                    }

                    if (chartsToUpdate.length === 0) {
                        throw new Error('कोई चार्ट उपलब्ध नहीं है');
                    }

                    // इफ़ेक्ट अप्लाई करें
                    let successCount = 0;
                    chartsToUpdate.forEach(chart => {
                        if (applyEffect(chart, selectedEffect)) {
                            successCount++;
                        }
                    });

                    showSuccessAlert(`${successCount} चार्ट्स पर इफ़ेक्ट सफलतापूर्वक लागू हुआ`);

                } catch (error) {
                    showErrorAlert(error.message);
                }
            };
        }

        // रीसेट बटन
        function setupResetButton() {
            if (resetAllEffects) {
                resetAllEffects.onclick = () => {
                    try {
                        let chartsToReset = [];
                        
                        // सभी एक्टिव चार्ट्स
                        allActiveChartInstances.forEach(chartInst => chartsToReset.push(chartInst));
                        document.querySelectorAll('.chart-canvas, .js-plotly-plot').forEach(dom => {
                            chartsToReset.push(dom);
                        });

                        let resetCount = 0;
                        chartsToReset.forEach(chart => {
                            if (resetEffects(chart)) {
                                resetCount++;
                            }
                        });

                        showSuccessAlert(`${resetCount} चार्ट्स रीसेट हो गए`);
                    } catch (error) {
                        showErrorAlert(`रीसेट करने में त्रुटि: ${error.message}`);
                    }
                };
            }
        }

        // सेव कस्टम इफ़ेक्ट बटन
        function setupSaveCustomEffectButton() {
            if (saveCustomEffectBtn) {
                saveCustomEffectBtn.onclick = () => {
                    try {
                        const effectName = prompt('इफ़ेक्ट का नाम दर्ज करें:');
                        if (!effectName) return;

                        const effectObj = {
                            shadowColor: document.getElementById('shadowColor')?.value || 'rgba(0, 0, 0, 0.2)',
                            shadowBlur: parseInt(document.getElementById('shadowBlur')?.value) || 10,
                            shadowOffsetX: parseInt(document.getElementById('shadowOffsetX')?.value) || 0,
                            shadowOffsetY: parseInt(document.getElementById('shadowOffsetY')?.value) || 5,
                            backgroundColor: document.getElementById('backgroundColor')?.value || '#ffffff',
                            borderColor: document.getElementById('borderColor')?.value || '#000000',
                            borderWidth: parseInt(document.getElementById('borderWidth')?.value) || 1,
                            borderStyle: document.getElementById('borderStyle')?.value || 'solid',
                            borderRadius: parseInt(document.getElementById('borderRadius')?.value) || 12,
                            extraOverlayEffects: document.getElementById('extraOverlayEffects')?.value || 'none',
                            cardStyleType: document.getElementById('cardStyleType')?.value || 'solid',
                            gradientPreset: document.getElementById('gradientPreset')?.value || 'ocean',
                            customGradientText: document.getElementById('customGradientText')?.value || '',
                            cardHoverAnimation: document.getElementById('cardHoverAnimation')?.value || 'none'
                        };

                        if (saveCustomEffect(effectObj, effectName)) {
                            // गैलरी रिफ्रेश करें
                            const galleryElement = document.getElementById('effectsTemplatesGallery');
                            if (galleryElement) {
                                renderChartEffectsTemplates(galleryElement);
                            }
                        }
                    } catch (error) {
                        showErrorAlert(`कस्टम इफ़ेक्ट सेव करने में त्रुटि: ${error.message}`);
                    }
                };
            }
        }

        // रिफ्रेश चार्ट्स लिस्ट बटन
        function setupRefreshChartsList() {
            if (refreshChartsListBtn) {
                refreshChartsListBtn.onclick = () => {
                    const listElement = document.getElementById('chartSelectionListEffects');
                    if (listElement) {
                        debouncedRenderChartList(listElement);
                        showSuccessAlert('चार्ट लिस्ट रिफ्रेश हो गई');
                    }
                };
            }
        }

        // इनिशियलाइज़ेशन
        setupTabSwitching();
        setupCodeEditor();
        setupApplyButton();
        setupResetButton();
        setupSaveCustomEffectButton();
        setupRefreshChartsList();

        // Dynamic visibility logic
        const cardStyleTypeSelect = document.getElementById('cardStyleType');
        const gradientPresetSection = document.getElementById('gradientPresetSection');
        const gradientPresetSelect = document.getElementById('gradientPreset');
        const customGradientText = document.getElementById('customGradientText');

        if (cardStyleTypeSelect && gradientPresetSection) {
            const checkVisibility = () => {
                if (cardStyleTypeSelect.value === 'gradient') {
                    gradientPresetSection.style.display = 'block';
                } else {
                    gradientPresetSection.style.display = 'none';
                }
            };
            cardStyleTypeSelect.onchange = checkVisibility;
            checkVisibility();
        }

        if (gradientPresetSelect && customGradientText) {
            const checkPresetVisibility = () => {
                if (gradientPresetSelect.value === 'custom') {
                    customGradientText.style.display = 'block';
                } else {
                    customGradientText.style.display = 'none';
                }
            };
            gradientPresetSelect.onchange = checkPresetVisibility;
            checkPresetVisibility();
        }

        // इनिशियल रेंडर
        const galleryElement = document.getElementById('effectsTemplatesGallery');
        if (galleryElement) {
            renderChartEffectsTemplates(galleryElement);
        }

        const listElement = document.getElementById('chartSelectionListEffects');
        if (listElement) {
            debouncedRenderChartList(listElement);
        }

        console.log('चार्ट इफ़ेक्ट्स सिस्टम सफलतापूर्वक लोड हुआ');

    } catch (error) {
        console.error('initializeChartEffects में त्रुटि:', error);
        showErrorAlert(`सिस्टम लोड करने में त्रुटि: ${error.message}`);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    initializeChartEffects();
});

// CSS स्टाइल्स ऑटो एड
const effectStyles = `
.chart-effect-template-item {
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 8px;
    border: 2px solid transparent !important;
}

.chart-effect-template-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.chart-effect-template-item.selected {
    border: 2px solid #007bff !important;
    background-color: #e7f3ff !important;
}

.effect-preview-box {
    transition: transform 0.2s ease;
}

.chart-effect-applied {
    animation: pulse-effect 0.8s ease;
}

@keyframes pulse-effect {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
}

.chart-preview-image {
    object-fit: contain;
}

.template-name {
    font-size: 0.8rem;
    font-weight: 500;
}

/* 100% Working Advanced CSS Hover Effects */
.hover-effect-float {
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease !important;
}
.hover-effect-float:hover {
    transform: translateY(-10px) !important;
    box-shadow: 0 15px 30px rgba(0,0,0,0.15) !important;
}

.hover-effect-zoom {
    transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), box-shadow 0.4s ease !important;
}
.hover-effect-zoom:hover {
    transform: scale(1.03) !important;
    box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
}

.hover-effect-glow {
    transition: border-color 0.4s ease, box-shadow 0.4s ease !important;
}
.hover-effect-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.6) !important;
    border-color: #3b82f6 !important;
}
`;

// स्टाइल्स ऑटो एड
if (document.head) {
    const styleElement = document.createElement('style');
    styleElement.textContent = effectStyles;
    document.head.appendChild(styleElement);
}

// स्टाइल्स ऑटो एड
if (document.head) {
    const styleElement = document.createElement('style');
    styleElement.textContent = effectStyles;
    document.head.appendChild(styleElement);
}