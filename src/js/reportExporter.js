// js/reportExporter.js
import { getHeaders, filteredData, exportToCSV } from '../store/DataHandler.js';
import { showMessage } from './utils.js';

/**
 * Robustly prepare a chart item for html2canvas capture by replacing its interactive
 * canvas/SVG element with a high-resolution static PNG. This ensures that html2canvas
 * always captures the charts beautifully without blank/black canvases or missing SVGs.
 */
async function prepareChartItemForCapture(chartItem) {
    const chartDom = chartItem.querySelector('.chart-canvas');
    if (!chartDom) return null;

    let dataURL = null;

    try {
        // Check if it is an ECharts instance
        const globalEcharts = window.echarts || (typeof echarts !== 'undefined' ? echarts : null);
        const chartInstance = globalEcharts ? globalEcharts.getInstanceByDom(chartDom) : null;
        
        if (chartInstance) {
            dataURL = chartInstance.getDataURL({
                type: 'png',
                pixelRatio: 2,
                backgroundColor: '#ffffff'
            });
        } else {
            // Check if it is a Plotly instance
            const globalPlotly = window.Plotly || (typeof Plotly !== 'undefined' ? Plotly : null);
            if (globalPlotly && chartDom.classList.contains('js-plotly-plot')) {
                dataURL = await globalPlotly.toImage(chartDom, { format: 'png', width: 800, height: 600 });
            }
        }
    } catch (e) {
        console.error("Failed to extract chart static image data:", e);
    }

    if (dataURL) {
        // Create an image overlay to cover the chartDom
        const img = document.createElement('img');
        img.src = dataURL;
        img.className = 'temp-static-chart-img';
        img.style.position = 'absolute';
        img.style.top = '0';
        img.style.left = '0';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.zIndex = '99999';
        img.style.backgroundColor = '#ffffff';
        
        // Hide original interactive children of chartDom temporarily
        const originalChildren = Array.from(chartDom.children);
        originalChildren.forEach(child => {
            child.style.display = 'none';
        });

        chartDom.appendChild(img);

        return {
            restore: () => {
                img.remove();
                originalChildren.forEach(child => {
                    child.style.display = '';
                });
            }
        };
    }
    return null;
}

/**
 * Capture and download a clean PDF report of prepared charts.
 */
export async function exportDashboardToPDF() {
    let jsPDFConstructor = null;
    if (window.jspdf && window.jspdf.jsPDF) {
        jsPDFConstructor = window.jspdf.jsPDF;
    } else if (window.jsPDF) {
        jsPDFConstructor = window.jsPDF;
    }

    if (!jsPDFConstructor) {
        showMessage("PDF निर्यातक लोड करने में विफल रहा।", "danger");
        return;
    }

    const chartItems = Array.from(document.querySelectorAll('.visualization-container'));
    if (chartItems.length === 0) {
        showMessage("रिपोर्ट में शामिल करने के लिए कोई चार्ट नहीं मिला।", "warning");
        return;
    }

    showMessage("PDF रिपोर्ट तैयार की जा रही है, कृपया प्रतीक्षा करें...", "info");

    try {
        const doc = new jsPDFConstructor('p', 'mm', 'a4');
        
        // Header Style
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(33, 37, 41); // Slate gray / dark
        doc.text("VEDRA BI - व्यावसायिक डेटा रिपोर्ट", 14, 20);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(108, 117, 125); // Muted gray
        doc.text(`रिपोर्ट की तारीख: ${new Date().toLocaleDateString('hi-IN')} | तैयार किया गया: Vedra BI`, 14, 27);
        
        doc.setDrawColor(222, 226, 230);
        doc.line(14, 32, 196, 32);
        
        let yOffset = 40;
        const pageHeight = 297; // A4 height in mm

        for (let index = 0; index < chartItems.length; index++) {
            const chartItem = chartItems[index];
            const titleEl = chartItem.querySelector('.chart-title') || chartItem.querySelector('h5') || chartItem.querySelector('.card-title');
            const title = titleEl ? titleEl.textContent.trim() : `चार्ट ${index + 1}`;

            // Robustly swap interactive canvas with static img for perfect html2canvas capture
            const prep = await prepareChartItemForCapture(chartItem);

            try {
                const canvas = await window.html2canvas(chartItem, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    useCORS: true,
                    logging: false
                });

                const imgData = canvas.toDataURL('image/png');
                
                // A4 width is 210mm. Margins are 14mm on each side. Available width = 182mm.
                const imgWidth = 182;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // If height overflows, add a new page
                if (yOffset + imgHeight + 15 > pageHeight) {
                    doc.addPage();
                    yOffset = 20; // reset yOffset
                }
                
                // Chart Title
                doc.setFont("helvetica", "bold");
                doc.setFontSize(14);
                doc.setTextColor(40, 44, 52);
                doc.text(title, 14, yOffset);
                
                // Insert Image
                doc.addImage(imgData, 'PNG', 14, yOffset + 5, imgWidth, imgHeight);
                
                yOffset += imgHeight + 20; // set gap for the next chart
            } catch (err) {
                console.error("Individual chart capture failed in PDF generation:", err);
            } finally {
                // Restore original interactive chart
                if (prep && prep.restore) {
                    prep.restore();
                }
            }
        }

        doc.save(`vedra-bi-report-${Date.now()}.pdf`);
        showMessage("PDF रिपोर्ट सफलतापूर्वक डाउनलोड हो गई है!", "success");

    } catch (error) {
        console.error("PDF generation failed:", error);
        showMessage("PDF उत्पन्न करने में त्रुटि आई: " + error.message, "danger");
    }
}

/**
 * Capture and download the whole dashboard as a high-quality PNG.
 * Bounded precisely around the charts area to provide a clean and professional layout.
 */
export async function exportDashboardToPNG() {
    const chartItems = Array.from(document.querySelectorAll('.visualization-container'));
    if (chartItems.length === 0) {
        showMessage("निर्यात् करने के लिए कोई चार्ट नहीं मिला।", "warning");
        return;
    }

    showMessage("पूरे डैशबोर्ड की PNG इमेज तैयार की जा रही है, कृपया प्रतीक्षा करें...", "info");

    try {
        // Calculate the bounding box that covers all active charts
        let minX = Infinity;
        let minY = Infinity;
        let maxX = -Infinity;
        let maxY = -Infinity;

        chartItems.forEach(item => {
            const left = item.offsetLeft;
            const top = item.offsetTop;
            const width = item.offsetWidth;
            const height = item.offsetHeight;

            if (left < minX) minX = left;
            if (top < minY) minY = top;
            if (left + width > maxX) maxX = left + width;
            if (top + height > maxY) maxY = top + height;
        });

        // Add padding around the extreme chart boundaries
        const padding = 24;
        const totalWidth = (maxX - minX) + (padding * 2);
        const totalHeight = (maxY - minY) + (padding * 2);

        // Create offscreen master canvas
        const masterCanvas = document.createElement('canvas');
        masterCanvas.width = totalWidth;
        masterCanvas.height = totalHeight;
        const ctx = masterCanvas.getContext('2d');

        // Apply backdrop background theme to match active workspace backdrop style
        const dashboardContent = document.getElementById('dashboardContent');
        const isDark = document.body.classList.contains('dark-theme');
        let bgColor = isDark ? '#141517' : '#ffffff';

        const canvasBackdrop = document.getElementById('canvasBackdropThemeSidebar');
        const selectedTheme = canvasBackdrop ? canvasBackdrop.value : 'default';
        
        if (selectedTheme === 'dark') {
            ctx.fillStyle = '#141517';
        } else if (selectedTheme === 'sepia') {
            ctx.fillStyle = '#f4eedb';
        } else if (selectedTheme === 'blue-glow') {
            const gradient = ctx.createRadialGradient(totalWidth / 2, totalHeight / 2, 10, totalWidth / 2, totalHeight / 2, Math.max(totalWidth, totalHeight));
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(1, '#030712');
            ctx.fillStyle = gradient;
        } else if (selectedTheme === 'glassy') {
            ctx.fillStyle = '#f1f5f9'; // frosted slate gray base
        } else {
            ctx.fillStyle = bgColor;
        }
        ctx.fillRect(0, 0, totalWidth, totalHeight);

        // Capture each chart item individually and draw onto the master canvas
        for (let i = 0; i < chartItems.length; i++) {
            const chartItem = chartItems[i];
            
            // Safe swap to static PNG
            const prep = await prepareChartItemForCapture(chartItem);
            
            try {
                const canvas = await window.html2canvas(chartItem, {
                    scale: 2,
                    backgroundColor: 'rgba(0,0,0,0)', // keep card transparent to blend into dashboard backdrop
                    useCORS: true,
                    logging: false
                });

                const destX = (chartItem.offsetLeft - minX) + padding;
                const destY = (chartItem.offsetTop - minY) + padding;
                
                ctx.drawImage(canvas, destX, destY, chartItem.offsetWidth, chartItem.offsetHeight);
            } catch (err) {
                console.error("Failed to capture chart item during PNG export:", err);
            } finally {
                // Restore interactive elements
                if (prep && prep.restore) {
                    prep.restore();
                }
            }
        }

        // Output and trigger download
        const link = document.createElement('a');
        link.href = masterCanvas.toDataURL('image/png');
        link.download = `vedra-bi-dashboard-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage("पूरे डैशबोर्ड की PNG इमेज सफलतापूर्वक डाउनलोड हो गई है!", "success");

    } catch (error) {
        console.error("Dashboard PNG export failed:", error);
        showMessage("PNG एक्सपोर्ट त्रुटि: " + error.message, "danger");
    }
}

/**
 * Export filtered dataset as CSV
 */
export function exportFilteredDataToCSV() {
    exportToCSV();
}
