// Generated automatically by extract_modals.py

export const dynamicTemplates = {
  "chartSettingsContent": `
                    <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                        <h5 class="m-0 font-sans font-semibold text-primary" style="font-size: 15px;"><i class="bi bi-bar-chart"></i> चार्ट डिज़ाइनर</h5>
                        <span class="badge bg-soft-primary text-primary border border-primary-subtle" style="font-size: 10px;"><i class="bi bi-broadcast text-danger me-1"></i> लाइव प्रिव्यू सक्रिय</span>
                    </div>
                    
                    <div id="chartSettingsSection">
                        <div class="row g-2">
                            <!-- Chart Type Selector -->
                            <div class="col-md-12">
                                <label class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-grid-3x3-gap"></i> चार्ट प्रकार चुनें:</label>
                                <div class="d-flex align-items-center gap-2 p-1.5 bg-white rounded border shadow-sm">
                                    <div id="chartTypeGallery" class="d-none"></div>
                                    <button type="button" class="btn btn-sm btn-primary py-1 px-2.5 fw-semibold text-xs" id="openChartGalleryBtn">
                                        <i class="bi bi-grid-3x3-gap"></i> गैलरी देखें
                                    </button>
                                    <div class="d-flex align-items-center gap-1.5 ms-auto">
                                        <img id="selectedChartDisplayImage" src="" alt="चयनित चार्ट" class="img-fluid rounded border" style="max-height: 28px; width: 28px; display: none; object-fit: contain; padding: 2px;">
                                    </div>
                                </div>
                            </div>
                            
                            <select id="chartType" class="form-select d-none">
                                <option value="bar">बार चार्ट</option>
                                <option value="stacked-bar">स्टैक्ड बार</option>
                                <option value="horizontal-bar">हॉरिजॉन्टल बार</option>
                                <option value="grouped-bar">ग्रुप्ड बार</option>
                                <option value="bar3D">3D बार चार्ट</option>
                                <option value="line3D">3D line chart</option>
                                <option value="line">लाइन चार्ट</option>
                                <option value="stacked-line">स्टैक्ड लाइन</option>
                                <option value="smooth-line">स्मूद लाइन</option>
                                <option value="step-line">स्टेप लाइन</option>
                                <option value="pie">पाई चार्ट</option>
                                <option value="doughnut">डोनट चार्ट</option>
                                <option value="rose-radius">रोज़ चार्ट (Radius)</option>
                                <option value="rose-area">रोज़ चार्ट (Area)</option>
                                <option value="scatter">स्कैटर चार्ट</option>
                                <option value="bubble">बबल चार्ट</option>
                                <option value="funnel">फ़नेल चार्ट</option>
                                <option value="gauge">गेज चार्ट</option>
                                <option value="radar">राडार चार्ट</option>
                                <option value="treemap">ट्रीमैप चार्ट</option>
                                <option value="candlestick">कैंडलस्टिक चार्ट (Plotly)</option>
                                <option value="ohlc">OHLC चार्ट (Plotly)</option>
                                <option value="waterfall">वॉटफॉल चार्ट (Waterfall)</option>
                                <option value="heatmap">हीटमैप चार्ट (Heatmap)</option>
                                <option value="sankey">सेंकी चार्ट (Sankey)</option>
                                <option value="bullet">बुलेट चार्ट (Bullet)</option>
                                <option value="boxplot">बॉक्सप्लॉट (Boxplot)</option>
                            </select>
                            
                            <!-- Columns List -->
                            <div class="col-md-12 mt-2">
                                <label class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-grip-horizontal"></i> सभी उपलब्ध कॉलम (डबल-क्लिक करें):</label>
                                <div id="columnList" class="drag-container list-group mb-1.5" style="max-height: 120px; overflow-y: auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 4px; background: #f8fafc;">
                                </div>
                                <div id="columnPreviewPanel" class="p-2 border rounded bg-white shadow-sm text-muted" style="display: none; font-size: 11px; border-color: #cbd5e1 !important;">
                                    <!-- Dynamic info shown here on hover -->
                                </div>
                            </div>
                            
                            <!-- Drop Zones -->
                            <div class="col-md-12 mt-1">
                                <div class="d-flex justify-content-between align-items-center mb-0.5">
                                    <label class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-0"><i class="bi bi-x-axis"></i> X-अक्ष (कैटेगरी):</label>
                                    <button type="button" class="btn btn-link btn-sm p-0 text-danger text-decoration-none clear-dropzone-btn fw-semibold" data-zone="xAxisDropZone" title="साफ़ करें" style="font-size: 10px;"><i class="bi bi-trash"></i> साफ़ करें</button>
                                </div>
                                <div id="xAxisDropZone" class="drop-zone drag-container list-group p-1" style="min-height: 38px; border-radius: 6px; border: 1.5px dashed #cbd5e1; background: #f8fafc; margin-bottom: 4px;"></div>
                            </div>
                            
                            <div class="col-md-12">
                                <div class="d-flex justify-content-between align-items-center mb-0.5">
                                    <label class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-0"><i class="bi bi-y-axis"></i> Y-अक्ष (संख्यात्मक मान):</label>
                                    <button type="button" class="btn btn-link btn-sm p-0 text-danger text-decoration-none clear-dropzone-btn fw-semibold" data-zone="yAxisDropZone" title="साफ़ करें" style="font-size: 10px;"><i class="bi bi-trash"></i> साफ़ करें</button>
                                </div>
                                <div id="yAxisDropZone" class="drop-zone drag-container list-group p-1" style="min-height: 38px; border-radius: 6px; border: 1.5px dashed #cbd5e1; background: #f8fafc; margin-bottom: 4px;"></div>
                            </div>
                            
                            <div class="col-md-12" id="zAxisDropZoneContainer" style="display: none;">
                                <div class="d-flex justify-content-between align-items-center mb-0.5">
                                    <label class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-0"><i class="bi bi-arrow-up-right-dots"></i> Z-अक्ष (3D):</label>
                                    <button type="button" class="btn btn-link btn-sm p-0 text-danger text-decoration-none clear-dropzone-btn fw-semibold" data-zone="zAxisDropZone" title="साफ़ करें" style="font-size: 10px;"><i class="bi bi-trash"></i> साफ़ करें</button>
                                </div>
                                <div id="zAxisDropZone" class="drop-zone drag-container list-group p-1" style="min-height: 38px; border-radius: 6px; border: 1.5px dashed #cbd5e1; background: #f8fafc; margin-bottom: 4px;"></div>
                            </div>

                            <!-- Title and Color Picker Row -->
                            <div class="col-md-12 mt-1">
                                <div class="row g-2">
                                    <div class="col-8">
                                        <label for="chartTitle" class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-type-h1"></i> चार्ट शीर्षक:</label>
                                        <input type="text" id="chartTitle" class="form-control form-control-sm text-xs py-1" placeholder="शीर्षक दर्ज करें">
                                    </div>
                                    <div class="col-4">
                                        <label for="colorPicker" class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-palette"></i> चार्ट रंग:</label>
                                        <input type="color" id="colorPicker" class="form-control form-control-color form-control-sm w-100" style="height: 29px; padding: 2px;" value="#5470C6">
                                    </div>
                                </div>
                            </div>

                            <!-- Axis Labels Row (Side by side) -->
                            <div class="col-md-12 mt-2">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <label for="xAxisLabel" class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-x-axis"></i> X-अक्ष लेबल:</label>
                                        <input type="text" id="xAxisLabel" class="form-control form-control-sm text-xs py-1" placeholder="X-अक्ष लेबल">
                                    </div>
                                    <div class="col-6">
                                        <label for="yAxisLabel" class="form-label text-xs font-semibold uppercase tracking-wider text-muted mb-1"><i class="bi bi-y-axis"></i> Y-अक्ष लेबल:</label>
                                        <input type="text" id="yAxisLabel" class="form-control form-control-sm text-xs py-1" placeholder="Y-अक्ष लेबल">
                                    </div>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="col-md-12 mt-3 pt-2 border-top">
                                <div class="d-flex gap-2">
                                    <button id="addVisualizationBtn" class="btn btn-primary btn-sm w-100 py-1.5 fw-semibold text-xs"><i class="bi bi-plus-circle"></i> विज़ुअलाइज़ेशन जोड़ें</button>
                                    <button id="cancelEditBtn" type="button" class="btn btn-outline-secondary btn-sm w-50 py-1.5 fw-semibold text-xs" style="display: none;"><i class="bi bi-x-circle"></i> रद्द करें</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
  "additionalActionsContent": `
                    <h5 class="mb-3 text-primary"><i class="bi bi-cpu-fill"></i> एडवांस्ड अतिरिक्त कार्य</h5>
                    
                    <div class="accordion accordion-flush" id="advActionsAccordion">
                        
                        <!-- Section 1: कोर ऑपरेशन्स (Core Operations) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingCore">
                                <button class="accordion-button px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseCore" aria-expanded="true" aria-controls="collapseCore">
                                    <i class="bi bi-grid-fill me-2 text-primary"></i> मुख्य कार्य (Main Actions)
                                </button>
                            </h2>
                            <div id="collapseCore" class="accordion-collapse collapse show" aria-labelledby="headingCore" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3">
                                    <div class="d-grid gap-2">
                                        <button id="toggleThemeSidebar" class="btn btn-sm btn-outline-secondary text-start"><i class="bi bi-moon-stars me-2"></i> थीम बदलें (Dark/Light)</button>
                                        <button id="downloadTemplateSidebar" class="btn btn-sm btn-outline-info text-start"><i class="bi bi-download me-2"></i> एक्सेल टेम्पलेट डाउनलोड करें</button>
                                        <button id="editDataBtnSidebar" class="btn btn-sm btn-outline-warning text-start" onclick="window.location.href='edit_data.html';">
                                            <i class="bi bi-pencil-square me-2"></i> डेटा एडिट करें (Excel Grid)
                                        </button>
                                        <button id="addDataBtnSidebar" class="btn btn-sm btn-outline-primary text-start" data-bs-toggle="modal" data-bs-target="#addDataModal"><i class="bi bi-plus-square me-2"></i> नया रिकॉर्ड जोड़ें</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Section 2: कैनवास बैकग्राउंड (Canvas Backgrounds) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingBackground">
                                <button class="accordion-button collapsed px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBackground" aria-expanded="false" aria-controls="collapseBackground">
                                    <i class="bi bi-palette-fill me-2 text-success"></i> कैनवास थीम (Backdrop Theme)
                                </button>
                            </h2>
                            <div id="collapseBackground" class="accordion-collapse collapse" aria-labelledby="headingBackground" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3">
                                    <label class="form-label small text-muted">समग्र कैनवास के लिए रेडीमेड थीम चुनें:</label>
                                    <div class="mb-3">
                                        <select id="canvasBackdropThemeSidebar" class="form-select form-select-sm">
                                            <option value="default">डिफ़ॉल्ट लाइट (Default Light)</option>
                                            <option value="dark">रॉयल डार्क (Royal Dark)</option>
                                            <option value="sepia">क्लासिक सेपिया (Warm Sepia)</option>
                                            <option value="blue-glow">साइबर ब्लू ग्लो (Cyber Blue)</option>
                                            <option value="glassy">फ्रॉस्टेड ग्लास (Frosted Glass)</option>
                                        </select>
                                    </div>
                                    <label class="form-label small text-muted">पेज बैकग्राउंड टेम्पलेट्स:</label>
                                    <div id="backgroundTemplateGallery" class="d-flex flex-wrap justify-content-center gap-2 mt-1"></div>
                                    <button id="applyTemplateBtn" class="btn btn-sm btn-success w-100 mt-2"><i class="bi bi-check-circle me-1"></i> पेज बैकग्राउंड लागू करें</button>
                                </div>
                            </div>
                        </div>

                        <!-- Section 3: स्मार्ट डेटा विश्लेषण (Smart Data Analysis) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingSmart">
                                <button class="accordion-button collapsed px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSmart" aria-expanded="false" aria-controls="collapseSmart">
                                    <i class="bi bi-lightning-charge-fill me-2 text-warning"></i> स्मार्ट डेटा विश्लेषण (Smart Insights)
                                </button>
                            </h2>
                            <div id="collapseSmart" class="accordion-collapse collapse" aria-labelledby="headingSmart" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3">
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">कॉलम A (श्रेणी / स्वतंत्र):</label>
                                        <select id="smartColA" class="form-select form-select-sm">
                                            <option value="">कॉलम चुनें...</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label small fw-bold">कॉलम B (संख्या / निर्भर):</label>
                                        <select id="smartColB" class="form-select form-select-sm">
                                            <option value="">कॉलम चुनें...</option>
                                        </select>
                                    </div>
                                    <button id="btnSmartInsight" class="btn btn-sm btn-warning w-100"><i class="bi bi-graph-up-arrow me-1"></i> सहसंबंध और रुझान विश्लेषण</button>
                                </div>
                            </div>
                        </div>

                        <!-- Section 4: डेटा ऑडिट और सुरक्षा (Data Audit & Diagnostics) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingAudit">
                                <button class="accordion-button collapsed px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseAudit" aria-expanded="false" aria-controls="collapseAudit">
                                    <i class="bi bi-shield-check me-2 text-info"></i> डेटा ऑडिट एवं निदान (Data Auditor)
                                </button>
                            </h2>
                            <div id="collapseAudit" class="accordion-collapse collapse" aria-labelledby="headingAudit" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3 text-center">
                                    <p class="text-muted small text-start">यह टूल आपके पूरे डेटाबेस की गुणवत्ता, विसंगतियों, शून्य मानों (null) और आउटलेर्स की जांच करता है।</p>
                                    <button id="btnDataAudit" class="btn btn-sm btn-info w-100 text-white"><i class="bi bi-shield-shaded me-1"></i> डेटा क्वालिटी ऑडिट रिपोर्ट</button>
                                </div>
                            </div>
                        </div>

                        <!-- Section 5: रिपोर्ट एक्सपोर्ट और प्रिंट (Executive Print) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingPrint">
                                <button class="accordion-button collapsed px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePrint" aria-expanded="false" aria-controls="collapsePrint">
                                    <i class="bi bi-printer-fill me-2 text-danger"></i> प्रिंट एवं रिपोर्ट एक्सपोर्ट (Export)
                                </button>
                            </h2>
                            <div id="collapsePrint" class="accordion-collapse collapse" aria-labelledby="headingPrint" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3">
                                    <p class="text-muted small">डैशबोर्ड को कार्यपालक रिपोर्ट प्रारूप (Executive Print Layout) में प्रिंट या पीडीएफ के रूप में सहेजें।</p>
                                    <button id="btnPrintReport" class="btn btn-sm btn-danger w-100"><i class="bi bi-file-earmark-pdf-fill me-1"></i> एक्जीक्यूटिव प्रिंट / PDF</button>
                                </div>
                            </div>
                        </div>

                        <!-- Section 6: लाइव डेटा सिमुलेशन कंट्रोलर (Simulation Controller) -->
                        <div class="accordion-item bg-transparent">
                            <h2 class="accordion-header" id="headingSim">
                                <button class="accordion-button collapsed px-0 py-2 bg-transparent fw-bold text-dark" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSim" aria-expanded="false" aria-controls="collapseSim">
                                    <i class="bi bi-play-circle-fill me-2 text-secondary"></i> लाइव रिफ्रेश और सिमुलेटर
                                </button>
                            </h2>
                            <div id="collapseSim" class="accordion-collapse collapse" aria-labelledby="headingSim" data-bs-parent="#advActionsAccordion">
                                <div class="accordion-body px-0 pt-1 pb-3">
                                    <div class="mb-3">
                                        <label class="form-label small fw-bold">ऑटो रिफ्रेश अंतराल (Refresh Interval):</label>
                                        <select id="autoRefreshSelector" class="form-select form-select-sm">
                                            <option value="off">बंद (Manual)</option>
                                            <option value="5000">5 सेकंड (5s)</option>
                                            <option value="10000">10 सेकंड (10s)</option>
                                            <option value="30000">30 सेकंड (30s)</option>
                                        </select>
                                    </div>
                                    <div class="mb-2">
                                        <label class="form-label small fw-bold">लाइव डेटा स्ट्रीम सिमुलेशन:</label>
                                        <button id="btnToggleSimStream" class="btn btn-sm btn-outline-success w-100 mb-2"><i class="bi bi-broadcast me-1"></i> स्ट्रीम शुरू करें</button>
                                        <div id="simStreamStatus" class="small text-muted text-center"><i class="bi bi-record-fill text-danger"></i> सिमुलेशन निष्क्रिय</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                `,
  "filterSortContent": `
                    <div class="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                        <h5 class="m-0"><i class="bi bi-sliders text-primary me-2"></i> एडवांस्ड फ़िल्टर एवं सॉर्ट</h5>
                        <span class="badge bg-secondary" id="activeFilterCountBadge">0 सक्रिय</span>
                    </div>
                    
                    <div id="filterSortSection">
                        <!-- 0. Logical Match Mode Toggle -->
                        <div class="card mb-3 shadow-xs border-light-subtle">
                            <div class="card-body p-2.5">
                                <label class="form-label small fw-bold text-secondary mb-1.5 d-flex align-items-center gap-1.5">
                                    <i class="bi bi-shuffle text-primary"></i> <span>फ़िल्टर मैच मोड (Match Mode):</span>
                                </label>
                                <div class="btn-group btn-group-sm w-100" role="group">
                                    <input type="radio" class="btn-check" name="filterMatchMode" id="matchModeAnd" value="AND" checked>
                                    <label class="btn btn-outline-primary py-1.5 fw-semibold" for="matchModeAnd"><i class="bi bi-intersect"></i> सभी मानदंड (AND)</label>
                                    <input type="radio" class="btn-check" name="filterMatchMode" id="matchModeOr" value="OR">
                                    <label class="btn btn-outline-primary py-1.5 fw-semibold" for="matchModeOr"><i class="bi bi-union"></i> कोई भी मानदंड (OR)</label>
                                </div>
                                <div class="text-muted mt-1" style="font-size: 0.65rem; line-height: 1.2;">
                                    <strong>AND:</strong> सभी सक्रिय फ़िल्टर्स मैच होने चाहिए। <br><strong>OR:</strong> किसी भी एक फ़िल्टर के मैच होने पर डेटा दिखाई देगा।
                                </div>
                            </div>
                        </div>

                        <!-- Python Backend Mode Section -->
                        <div class="card mb-3 shadow-xs border-info bg-info bg-opacity-10">
                            <div class="card-body p-2.5">
                                <div class="d-flex align-items-center justify-content-between mb-1.5">
                                    <label class="form-label small fw-bold text-info-emphasis mb-0 d-flex align-items-center gap-1.5">
                                        <i class="bi bi-cpu-fill text-info animate-pulse"></i> <span>Python Backend Processing:</span>
                                    </label>
                                    <span class="badge bg-secondary" id="pythonModeStatus" style="font-size: 0.68rem; padding: 3px 6px;">निष्क्रिय (Local)</span>
                                </div>
                                <div class="form-check form-switch mb-1">
                                    <input class="form-check-input" type="checkbox" role="switch" id="forcePythonBackendBtn">
                                    <label class="form-check-label text-dark small fw-semibold" for="forcePythonBackendBtn" style="font-size: 0.75rem;">Force Python Filter (For testing)</label>
                                </div>
                                <div class="text-muted" style="font-size: 0.65rem; line-height: 1.2;">
                                    डेटा साइज 50MB से अधिक होने पर पायथन बैकएंड स्वचालित रूप से चालू हो जाता है। आप इसे टेस्टिंग के लिए भी सक्रिय कर सकते हैं।
                                </div>
                            </div>
                        </div>

                        <!-- Accordion for Filters -->
                        <div class="accordion accordion-flush border rounded overflow-hidden shadow-xs mb-3" id="filterSortAccordion">
                            
                            <!-- Section 1: Text Filter -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingTextFilter">
                                    <button class="accordion-button py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTextFilter" aria-expanded="true" aria-controls="collapseTextFilter">
                                        <i class="bi bi-type text-info me-2"></i> टेक्स्ट कॉलम फ़िल्टर
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="textFilterActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseTextFilter" class="accordion-collapse collapse show" aria-labelledby="headingTextFilter" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label for="filterCol" class="form-label text-muted small mb-1">कॉलम चुनें:</label>
                                        <select id="filterCol" class="form-select form-select-sm mb-2"></select>
                                        
                                        <label for="textFilterOperator" class="form-label text-muted small mb-1">मैच ऑपरेटर:</label>
                                        <select id="textFilterOperator" class="form-select form-select-sm mb-2">
                                            <option value="includes">शामिल है (Contains)</option>
                                            <option value="startsWith">से शुरू होता है (Starts With)</option>
                                            <option value="endsWith">से खत्म होता है (Ends With)</option>
                                            <option value="equals">के बराबर है (Exactly Equals)</option>
                                            <option value="doesNotInclude">शामिल नहीं है (Does Not Contain)</option>
                                        </select>
                                        
                                        <label for="filterValue" class="form-label text-muted small mb-1">तुलना मूल्य (Value):</label>
                                        <input type="text" id="filterValue" class="form-control form-control-sm" placeholder="खोज मान दर्ज करें...">
                                    </div>
                                </div>
                            </div>

                            <!-- Section 2: Multi-Select Filter -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingMultiFilter">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMultiFilter" aria-expanded="false" aria-controls="collapseMultiFilter">
                                        <i class="bi bi-list-check text-warning me-2"></i> बहु-चयन (Multi-Select) फ़िल्टर
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="multiFilterActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseMultiFilter" class="accordion-collapse collapse" aria-labelledby="headingMultiFilter" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label for="multiSelectFilterCol" class="form-label text-muted small mb-1">कॉलम चुनें:</label>
                                        <select id="multiSelectFilterCol" class="form-select form-select-sm mb-2"></select>
                                        
                                        <!-- Quick search within multiselect options -->
                                        <div id="multiSelectSearchContainer" style="display: none;">
                                            <div class="input-group input-group-sm mb-2">
                                                <span class="input-group-text bg-light text-muted" style="font-size: 0.75rem;"><i class="bi bi-search"></i></span>
                                                <input type="text" id="multiSelectSearch" class="form-control form-control-sm" placeholder="ऑप्शंस खोजें...">
                                            </div>
                                        </div>
                                        
                                        <div id="multiSelectOptions" class="mt-1 p-2 border rounded bg-white" style="max-height: 150px; overflow-y: auto;">
                                            <div class="text-muted small text-center py-2">कॉलम चुनने पर विकल्प यहां लोड होंगे।</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 3: Numeric Range Filter -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingNumericFilter">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNumericFilter" aria-expanded="false" aria-controls="collapseNumericFilter">
                                        <i class="bi bi-hash text-success me-2"></i> संख्यात्मक रेंज फ़िल्टर
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="numericFilterActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseNumericFilter" class="accordion-collapse collapse" aria-labelledby="headingNumericFilter" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label for="filterNumericCol" class="form-label text-muted small mb-1">संख्या कॉलम:</label>
                                        <select id="filterNumericCol" class="form-select form-select-sm mb-2"></select>
                                        
                                        <!-- Numeric Range Distribution Preview -->
                                        <div id="numericDistributionPreview" class="mb-3 p-2 rounded bg-light border" style="display: none; font-size: 0.72rem; border-color: #e2e8f0 !important;">
                                            <div class="fw-bold text-secondary mb-1"><i class="bi bi-calculator"></i> कॉलम सांख्यिकी (Stats):</div>
                                            <div class="row g-1 text-dark">
                                                <div class="col-6">न्यूनतम: <span id="numStatMin" class="fw-bold text-primary">-</span></div>
                                                <div class="col-6">अधिकतम: <span id="numStatMax" class="fw-bold text-primary">-</span></div>
                                                <div class="col-12 mt-1">औसत: <span id="numStatAvg" class="fw-bold text-success">-</span></div>
                                            </div>
                                        </div>

                                        <div class="row g-2">
                                            <div class="col-6">
                                                <label for="minNumericValue" class="form-label text-muted small mb-0">न्यूनतम (Min):</label>
                                                <input type="number" id="minNumericValue" class="form-control form-control-sm" placeholder="कम से कम">
                                            </div>
                                            <div class="col-6">
                                                <label for="maxNumericValue" class="form-label text-muted small mb-0">अधिकतम (Max):</label>
                                                <input type="number" id="maxNumericValue" class="form-control form-control-sm" placeholder="अधिक से अधिक">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 4: Date Range Filter -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingDateFilter">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDateFilter" aria-expanded="false" aria-controls="collapseDateFilter">
                                        <i class="bi bi-calendar-event text-danger me-2"></i> तारीख (Date) रेंज फ़िल्टर
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="dateFilterActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseDateFilter" class="accordion-collapse collapse" aria-labelledby="headingDateFilter" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <div class="mb-2">
                                            <label for="startDate" class="form-label text-muted small mb-1">शुरुआती तारीख (Start):</label>
                                            <input type="date" id="startDate" class="form-control form-control-sm">
                                        </div>
                                        <div>
                                            <label for="endDate" class="form-label text-muted small mb-1">अंतिम तारीख (End):</label>
                                            <input type="date" id="endDate" class="form-control form-control-sm">
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 5: Group By -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingGroupBy">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGroupBy" aria-expanded="false" aria-controls="collapseGroupBy">
                                        <i class="bi bi-intersect text-dark me-2"></i> ग्रुप बाय (Group By)
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="groupByActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseGroupBy" class="accordion-collapse collapse" aria-labelledby="headingGroupBy" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label for="groupByCols" class="form-label text-muted small mb-1">ग्रुप कॉलम (Multi-Select):</label>
                                        <select id="groupByCols" multiple class="form-select form-select-sm" style="height:100px;" title="Ctrl दबाकर मल्टी-सेलेक्ट करें"></select>
                                        <div class="text-muted small mt-1" style="font-size: 0.65rem;">कीबोर्ड का Ctrl (या Cmd) की दबाकर कई कॉलम एक साथ चुनें।</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 6: Multi-Column Sort -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingSortRules">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSortRules" aria-expanded="false" aria-controls="collapseSortRules">
                                        <i class="bi bi-sort-alpha-down text-primary me-2"></i> बहु-कॉलम सॉर्ट (Multi-Sort)
                                        <span class="badge bg-success ms-2 rounded-pill text-xxs d-none" id="sortActiveBadge" style="font-size: 0.6rem; padding: 2px 6px;">सक्रिय</span>
                                    </button>
                                </h2>
                                <div id="collapseSortRules" class="accordion-collapse collapse" aria-labelledby="headingSortRules" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label class="form-label text-muted small mb-1">सॉर्ट नियम सूची (Rules Priority):</label>
                                        <div id="sortRulesContainer"></div>
                                        <button id="addSortRuleBtn" class="btn btn-outline-secondary btn-sm w-100 mt-2.5"><i class="bi bi-plus"></i> एक और सॉर्ट नियम जोड़ें</button>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 7: Presets -->
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingPresets">
                                    <button class="accordion-button collapsed py-2.5 px-3 fw-bold small text-secondary d-flex align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapsePresets" aria-expanded="false" aria-controls="collapsePresets">
                                        <i class="bi bi-bookmark-star text-pink me-2"></i> फ़िल्टर प्रीसेट्स (Presets)
                                    </button>
                                </h2>
                                <div id="collapsePresets" class="accordion-collapse collapse" aria-labelledby="headingPresets" data-bs-parent="#filterSortAccordion">
                                    <div class="accordion-body p-3">
                                        <label for="presetName" class="form-label text-muted small mb-1">नया प्रीसेट सेव करें:</label>
                                        <div class="input-group input-group-sm mb-3">
                                            <input type="text" id="presetName" class="form-control" placeholder="प्रीसेट नाम...">
                                            <button id="savePresetBtn" class="btn btn-success" title="प्रीसेट सेव करें"><i class="bi bi-bookmark-plus-fill"></i> सेव</button>
                                        </div>
                                        
                                        <label for="loadPreset" class="form-label text-muted small mb-1">प्रीसेट लोड करें:</label>
                                        <select id="loadPreset" class="form-select form-select-sm mb-2">
                                            <option value="">प्रीसेट चुनें...</option>
                                        </select>
                                        <button id="applyPresetBtn" class="btn btn-outline-primary btn-sm w-100"><i class="bi bi-cloud-arrow-up-fill"></i> प्रीसेट लागू करें (Load)</button>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <!-- Reset & Apply Action Buttons -->
                        <div class="row g-2 pt-2 border-top">
                            <div class="col-6">
                                <button type="button" id="resetFiltersBtn" class="btn btn-outline-warning w-100 py-2 btn-sm fw-semibold">
                                    <i class="bi bi-arrow-counterclockwise"></i> सभी रीसेट करें
                                </button>
                            </div>
                            <div class="col-6">
                                <button id="applyFilterSort" class="btn btn-primary w-100 py-2 btn-sm fw-bold">
                                    <i class="bi bi-check-circle-fill"></i> लागू करें
                                </button>
                            </div>
                        </div>
                    </div>
                `,
  "chartFormattingContent": `
                    <h5 class="mb-3"><i class="bi bi-brush"></i> चार्ट फॉर्मेटिंग</h5>
                    <div id="chartFormattingSection">
                        <div class="mb-3">
                            <label class="form-label"><i class="bi bi-palette"></i> चार्ट कंटेनर रंग टेम्पलेट्स चुनें:</label>
                            <div id="chartContainerColorGallery" class="d-flex flex-wrap justify-content-center gap-3 mt-2">
                                </div>
                        </div>
                        <div class="text-center mt-3">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-paint-bucket"></i> कलर स्कोप चुनें:</label>
                                <div class="btn-group w-100" role="group">
                                    <input type="radio" class="btn-check" name="chartContainerScope" id="scopeAllCharts" autocomplete="off" checked>
                                    <label class="btn btn-outline-primary" for="scopeAllCharts">सभी चार्ट्स पर</label>
                                    <input type="radio" class="btn-check" name="chartContainerScope" id="scopeSelectedCharts" autocomplete="off">
                                    <label class="btn btn-outline-primary" for="scopeSelectedCharts">चयनित चार्ट्स पर</label>
                                </div>
                            </div>
                            <div id="dashboardChartOverview" style="display: none;">
                                <label class="form-label"><i class="bi bi-list-check"></i> चार्ट चुनें:</label>
                                <div id="chartSelectionList" class="form-control" style="max-height: 200px; overflow-y: auto;">
                                    </div>
                            </div>
                            <button id="applyChartContainerColorBtn" class="btn btn-success w-100 mt-3"><i class="bi bi-check-circle"></i> कंटेनर रंग लागू करें</button>
                        </div>
                        <div class="col-md-12 mt-3">
                            <hr>
                            <h6>कस्टम रंग और शैली</h6>
                            <p class="text-muted small">यहाँ JSON फॉर्मेट में कोड डालें।</p>
                            <div class="input-group">
                                <textarea id="customChartContainerCode" class="form-control" rows="12" placeholder="उदाहरण: { 'style': { 'background': '#ff5733', 'color': '#ffffff' }, 'chartBackgroundColor': '#ff5733' }"></textarea>
                                <button class="btn btn-outline-secondary" type="button" id="openChartFormatEditorBtn" data-bs-toggle="modal" data-bs-target="#codeEditorModal"><i class="bi bi-arrows-fullscreen"></i></button>
                            </div>
                            <button id="applyCustomChartContainerCodeBtn" class="btn btn-primary w-100 mt-2"><i class="bi bi-code"></i> कस्टम शैली लागू करें</button>
                        </div>
                    </div>
                `,
  "chartEffectsContent": `    
                    <h5 class="mb-3"><i class="bi bi-magic text-primary"></i> चार्ट इफेक्ट्स (Advanced Chart Effects)</h5>    
                    <div id="chartEffectsSection">    
                        <div class="mb-3">    
                            <label class="form-label fw-bold">प्रभाव का प्रकार (Effect Type)</label>    
                            <div class="btn-group w-100" role="group" aria-label="इफ़ेक्ट्स विकल्प">    
                                <input type="radio" class="btn-check" name="effectsOption" id="customEffectsRadio" autocomplete="off" checked>    
                                <label class="btn btn-outline-primary" for="customEffectsRadio">कस्टम इफ़ेक्ट्स</label>    
                                <input type="radio" class="btn-check" name="effectsOption" id="templateEffectsRadio" autocomplete="off">    
                                <label class="btn btn-outline-primary" for="templateEffectsRadio">रेडीमेड टेम्पलेट्स</label>    
                                <input type="radio" class="btn-check" name="effectsOption" id="customCodeRadio" autocomplete="off">    
                                <label class="btn btn-outline-primary" for="customCodeRadio">कस्टम कोड</label>    
                            </div>    
                        </div>    

                        <!-- 1. CUSTOM EFFECTS SECTION -->
                        <div id="customEffectsSection">    
                            <div class="row">    
                                <!-- Card Style Type -->
                                <div class="col-md-12 mb-3">
                                    <label for="cardStyleType" class="form-label fw-bold small text-muted"><i class="bi bi-palette"></i> कार्ड डिज़ाइन थीम (Card Design Style)</label>
                                    <select id="cardStyleType" class="form-select">
                                        <option value="solid" selected>साधारण / सॉलिड रंग (Solid Background)</option>
                                        <option value="gradient">लिनियर ग्रेडिएंट (Linear Gradient)</option>
                                        <option value="glass">ग्लासमॉर्फिज्म - फ्रॉस्टेड लुक (Glassmorphism)</option>
                                        <option value="neumorphic">न्यूमॉर्फिज्म - सॉफ्ट 3D (Neumorphism)</option>
                                    </select>
                                </div>

                                <!-- Gradient Preset Section -->
                                <div class="col-md-12 mb-3" id="gradientPresetSection" style="display: none;">
                                    <label for="gradientPreset" class="form-label fw-bold small text-muted">ग्रेडिएंट प्रीसेट (Gradient Preset)</label>
                                    <select id="gradientPreset" class="form-select mb-2">
                                        <option value="sunset">Sunset Gold (सूर्यास्त स्वर्ण)</option>
                                        <option value="ocean" selected>Cool Ocean (शांत महासागर)</option>
                                        <option value="royal">Royal Purple (शाही बैंगनी)</option>
                                        <option value="emerald">Emerald Glow (पन्ना चमक)</option>
                                        <option value="darkknight">Dark Knight (डार्क नाइट)</option>
                                        <option value="custom">कस्टम ग्रेडिएंट (Custom CSS Gradient)</option>
                                    </select>
                                    <input type="text" id="customGradientText" class="form-control" value="linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)" placeholder="CSS linear-gradient syntax..." style="display: none;">
                                </div>

                                <!-- Hover Animation Section -->
                                <div class="col-md-12 mb-3">
                                    <label for="cardHoverAnimation" class="form-label fw-bold small text-muted"><i class="bi bi-cursor-fill"></i> कार्ड हॉवर एनिमेशन (Hover Effect)</label>
                                    <select id="cardHoverAnimation" class="form-select">
                                        <option value="none" selected>कोई नहीं (None)</option>
                                        <option value="float">ऊपर की ओर तैरें (Float Up)</option>
                                        <option value="zoom">ज़ूम इन करें (Zoom In)</option>
                                        <option value="glow">नियॉन बॉर्डर ग्लो (Border Glow)</option>
                                    </select>
                                </div>

                                <div class="col-md-6 mb-3">    
                                    <label for="shadowColor" class="form-label small text-muted">शैडो रंग</label>    
                                    <div id="shadowColorPicker"></div>
                                </div>    
                                <div class="col-md-6 mb-3">    
                                    <label for="shadowBlur" class="form-label small text-muted">शैडो ब्लर</label>    
                                    <input type="number" class="form-control" id="shadowBlur" value="10" min="0" max="50">    
                                </div>    
                                <div class="col-md-6 mb-3">    
                                    <label for="shadowOffsetX" class="form-label small text-muted">शैडो ऑफसेट X</label>    
                                    <input type="number" class="form-control" id="shadowOffsetX" value="0" min="-50" max="50">    
                                </div>    
                                <div class="col-md-6 mb-3">    
                                    <label for="shadowOffsetY" class="form-label small text-muted">शैडो ऑफसेट Y</label>    
                                    <input type="number" class="form-control" id="shadowOffsetY" value="5" min="-50" max="50">    
                                </div>

                                <!-- Background and Border pickers for Custom Effects -->
                                <div class="col-md-6 mb-3">    
                                    <label class="form-label small text-muted">बैकग्राउंड रंग</label>    
                                    <div id="backgroundColorPicker"></div>
                                </div>    
                                <div class="col-md-6 mb-3">    
                                    <label class="form-label small text-muted">बॉर्डर रंग</label>    
                                    <div id="chartBorderColorPicker"></div>
                                </div>

                                <!-- Border widths, styles, radii and overlay effects -->
                                <div class="col-md-6 mb-3">    
                                    <label for="borderWidth" class="form-label small text-muted">बॉर्डर चौड़ाई (px)</label>    
                                    <input type="number" class="form-control" id="borderWidth" value="1" min="0" max="20">    
                                </div>
                                <div class="col-md-6 mb-3">    
                                    <label for="borderStyle" class="form-label small text-muted">बॉर्डर स्टाइल</label>    
                                    <select id="borderStyle" class="form-select">
                                        <option value="solid" selected>सॉलिड (Solid)</option>
                                        <option value="dashed">डैश्ड (Dashed)</option>
                                        <option value="dotted">डॉटेड (Dotted)</option>
                                        <option value="double">डबल (Double)</option>
                                        <option value="none">कोई नहीं (None)</option>
                                    </select>
                                </div>
                                <div class="col-md-6 mb-3">    
                                    <label for="borderRadius" class="form-label small text-muted">बॉर्डर गोलाई (Radius)</label>    
                                    <input type="number" class="form-control" id="borderRadius" value="12" min="0" max="50">    
                                </div>
                                <div class="col-md-6 mb-3">    
                                    <label for="extraOverlayEffects" class="form-label small text-muted">अतिरिक्त ओवरले (Overlay)</label>    
                                    <select id="extraOverlayEffects" class="form-select">
                                        <option value="none" selected>कोई नहीं (None)</option>
                                        <option value="pulse-glow">धीमी धड़कन पल्स (Pulse)</option>
                                        <option value="shimmer">चमकता नियॉन (Shimmer)</option>
                                    </select>
                                </div>
                            </div>    
                        </div>    

                        <!-- 2. TEMPLATE EFFECTS SECTION -->
                        <div id="templateEffectsSection" style="display: none;">
                            <label class="form-label fw-bold small text-muted mb-2">रेडीमेड इफ़ेक्ट गैलरी (Template Gallery)</label>
                            <div id="effectsTemplatesGallery" class="d-flex flex-column gap-2" style="max-height: 250px; overflow-y: auto;">
                                <!-- Templates dynamically loaded -->
                            </div>
                        </div>

                        <!-- 3. CUSTOM CODE EFFECTS SECTION -->
                        <div id="customCodeEffectsSection" style="display: none;">
                            <div class="mb-3">
                                <label for="customEffectCode" class="form-label small text-muted fw-bold">कस्टम इफ़ेक्ट कोड (JSON Format)</label>
                                <textarea id="customEffectCode" class="form-control text-monospace" rows="8" placeholder='{
  "shadowColor": "rgba(0, 240, 255, 0.5)",
  "shadowBlur": 20,
  "shadowOffsetX": 0,
  "shadowOffsetY": 0,
  "backgroundColor": "#0a0e17",
  "borderColor": "#ff007f",
  "borderWidth": 2,
  "borderStyle": "solid",
  "borderRadius": 14,
  "cardStyleType": "solid",
  "cardHoverAnimation": "glow"
}'></textarea>
                            </div>
                            <button id="openChartEffectEditorBtn" class="btn btn-sm btn-outline-secondary mb-2"><i class="bi bi-arrows-fullscreen"></i> कोड एडिटर में खोलें</button>
                        </div>

                        <hr class="my-3">

                        <!-- EFFECT SCOPE & ACTION BUTTONS -->
                        <div class="mb-3">
                            <label class="form-label fw-bold small text-muted">प्रभाव का क्षेत्र (Effect Scope)</label>
                            <div class="btn-group w-100" role="group">
                                <input type="radio" class="btn-check" name="effectsScope" id="applyToAllRadio" autocomplete="off" checked>
                                <label class="btn btn-outline-primary btn-sm" for="applyToAllRadio">सभी चार्ट्स पर</label>
                                <input type="radio" class="btn-check" name="effectsScope" id="applyToSelectedRadio" autocomplete="off">
                                <label class="btn btn-outline-primary btn-sm" for="applyToSelectedRadio">चयनित चार्ट्स पर</label>
                            </div>
                        </div>

                        <div id="dashboardChartOverviewEffects" style="display: none;" class="mb-3">
                            <label class="form-label fw-bold small text-muted d-flex justify-content-between">
                                <span>चार्ट चुनें (Select Charts):</span>
                                <button id="refreshChartsListBtn" class="btn btn-link btn-xs p-0 text-decoration-none" style="font-size:0.75rem;"><i class="bi bi-arrow-clockwise"></i> रीफ्रेश</button>
                            </label>
                            <div id="chartSelectionListEffects" class="form-control" style="max-height: 150px; overflow-y: auto;">
                                <!-- populated dynamically -->
                            </div>
                        </div>

                        <div id="effectAlertsContainer"></div>

                        <div class="row g-2">
                            <div class="col-6">
                                <button type="button" id="resetAllEffects" class="btn btn-outline-danger w-100 py-2 btn-sm fw-semibold">
                                    <i class="bi bi-trash"></i> इफ़ेक्ट हटाएँ
                                </button>
                            </div>
                            <div class="col-6">
                                <button type="button" id="applyChartEffects" class="btn btn-primary w-100 py-2 btn-sm fw-bold">
                                    <i class="bi bi-check-circle"></i> इफ़ेक्ट लागू करें
                                </button>
                            </div>
                        </div>
                        
                        <button id="saveCustomEffectBtn" class="btn btn-outline-success btn-sm w-100 mt-2"><i class="bi bi-save"></i> इस इफ़ेक्ट को गैलरी में सेव करें</button>
                    </div>    
                `,
  "textboxContent": `
                    <!-- HEADER WITH FULLSCREEN BUTTON -->
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h5 class="mb-0 d-flex align-items-center">
                            <i class="bi bi-textarea-t text-primary me-2"></i> 
                            <span>टेक्स्टबॉक्स स्टूडियो (Textbox Studio)</span>
                            <button id="toggleSidebarFullscreenBtn" class="btn btn-xs btn-outline-secondary py-1 px-1.5 ms-2 d-flex align-items-center" title="फ़ुलस्क्रीन (Fullscreen)" style="border-radius: 6px;">
                                <i class="bi bi-arrows-fullscreen"></i>
                            </button>
                        </h5>
                        <span id="textboxAutoSaveBadge" class="badge bg-success-subtle text-success border border-success-subtle rounded-pill py-1 px-2" style="font-size: 0.75rem;">
                            <span class="spinner-grow spinner-grow-sm text-success me-1" style="width: 8px; height: 8px;" role="status"></span> सहेजा गया (Auto-Saved)
                        </span>
                    </div>

                    <!-- SINGLE RESPONSIVE GRID WRAPPER FOR BOTH SIDEBAR AND FULLSCREEN MODES -->
                    <div class="textbox-grid-wrapper">
                        
                        <!-- COLUMN 1: DASHBOARD CONTEXT & PRESETS (Left Column in Fullscreen) -->
                        <div class="textbox-col">
                            <!-- TEXTBOX LIST OVERVIEW -->
                            <div class="card border-0 shadow-sm bg-body" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div class="card-body p-3">
                                    <h6 class="card-title d-flex justify-content-between align-items-center mb-2" style="font-size: 0.9rem; font-weight: 600; color: #1e293b;">
                                        <span><i class="bi bi-collection-play text-primary me-1.5"></i> एक्टिव टेक्स्टबॉक्स (Active List)</span>
                                        <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-2.5 py-1" id="activeTextboxCount">0</span>
                                    </h6>
                                    <p class="text-muted small mb-2.5" style="font-size: 0.72rem; line-height: 1.3;">कैनवास पर मौजूद टेक्स्टबॉक्स चुनें या नया बनाएं।</p>
                                    <div id="textboxList" class="list-group list-group-flush border-top pt-2" style="max-height: 150px; overflow-y: auto; font-size: 0.85rem; scrollbar-width: thin;">
                                        <!-- Will be dynamically populated -->
                                    </div>
                                </div>
                            </div>

                            <!-- READY MADE TEMPLATES WITH TOGGLE -->
                            <div class="card border-0 shadow-sm bg-body" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-center mb-1">
                                        <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600; color: #1e293b;">
                                            <i class="bi bi-grid-1x2 text-primary me-1.5"></i> डिज़ाइनर टेम्पलेट्स (Presets)
                                        </h6>
                                        <button id="toggleTemplatesBtn" class="btn btn-link btn-sm text-primary p-0 text-decoration-none fw-semibold" style="font-size: 0.8rem;">
                                            <i class="bi bi-chevron-down me-1"></i> अधिक दिखाएं
                                        </button>
                                    </div>
                                    <p class="text-muted small mb-3" style="font-size: 0.72rem;">क्लिक करें और तुरंत शानदार डिज़ाइन लागू करें:</p>
                                    <div id="templateGallery" class="d-flex flex-wrap gap-2 justify-content-start">
                                        <!-- Templates will load here -->
                                    </div>
                                </div>
                            </div>
                        </div> <!-- Closes Column 1 -->

                        <!-- COLUMN 2: CONTENT COMPOSITION & ALIGNMENT (Center Column in Fullscreen) -->
                        <div class="textbox-col">
                            <!-- WYSIWYG EDITOR -->
                            <div class="card border-0 shadow-sm bg-body" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div class="card-body p-3">
                                    <div class="d-flex justify-content-between align-items-center mb-2.5">
                                        <h6 class="mb-0" style="font-size: 0.9rem; font-weight: 600; color: #1e293b;">
                                            <i class="bi bi-pencil-square text-primary me-1.5"></i> सामग्री संपादक (Text Editor)
                                        </h6>
                                        <button id="dataInsertButton" type="button" class="btn btn-xs btn-outline-primary py-1 px-2.5 d-flex align-items-center" title="Insert Dynamic Data Field" style="font-size: 0.75rem; border-radius: 6px;">
                                            <i class="bi bi-database-fill me-1"></i> लाइव डेटा जोड़ें
                                        </button>
                                    </div>
                                    <div id="quill-container" style="height: 200px; border-radius: 8px; overflow: hidden; border: 1px solid #cbd5e1; background: #ffffff;"></div>
                                </div>
                            </div>

                            <!-- SMART CANVAS DESIGN & ALIGNMENT TOOLS -->
                            <div class="card border-0 shadow-sm bg-body" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div class="card-body p-3">
                                    <h6 class="mb-2.5" style="font-size: 0.9rem; font-weight: 600; color: #1e293b;">
                                        <i class="bi bi-layers-half text-primary me-1.5"></i> संरेखण और कैनवास टूल्स (Canvas Tools)
                                    </h6>
                                    
                                    <!-- Row 1: Snaps, History, Z-Layers, Style Copy/Paste -->
                                    <div class="d-flex flex-wrap gap-2 align-items-center justify-content-between mb-3 border-bottom pb-2.5">
                                        <!-- Grid/Selection Group -->
                                        <div class="btn-group" role="group" title="ग्रिड और मल्टी-सेलेक्ट">
                                            <button id="gridToggle" class="btn btn-sm btn-outline-primary px-2.5 py-1.5" title="ग्रिड स्नैपिंग (Snap to Grid)">
                                                <i class="bi bi-grid-3x3-gap"></i>
                                            </button>
                                            <button id="multiSelectToggle" class="btn btn-sm btn-outline-primary px-2.5 py-1.5" title="मल्टी-सेलेक्ट (Multi-Select Mode)">
                                                <i class="bi bi-cursor-fill"></i>
                                            </button>
                                        </div>

                                        <!-- History Group -->
                                        <div class="btn-group" role="group" title="Undo/Redo">
                                            <button id="undoButton" class="btn btn-sm btn-outline-secondary px-2.5 py-1.5" disabled title="पूर्ववत (Undo - Ctrl+Z)">
                                                <i class="bi bi-arrow-counterclockwise"></i>
                                            </button>
                                            <button id="redoButton" class="btn btn-sm btn-outline-secondary px-2.5 py-1.5" disabled title="पुनः करें (Redo - Ctrl+Y)">
                                                <i class="bi bi-arrow-clockwise"></i>
                                            </button>
                                        </div>

                                        <!-- Layers Group -->
                                        <div class="btn-group" role="group" title="लेयर्स (Z-Index)">
                                            <button id="bringToFront" class="btn btn-sm btn-outline-dark px-2.5 py-1.5" disabled title="सबसे ऊपर लाएँ (Bring to Front)">
                                                <i class="bi bi-chevron-double-up"></i>
                                            </button>
                                            <button id="sendToBack" class="btn btn-sm btn-outline-dark px-2.5 py-1.5" disabled title="सबसे पीछे ले जाएँ (Send to Back)">
                                                <i class="bi bi-chevron-double-down"></i>
                                            </button>
                                        </div>

                                        <!-- Style Copy/Paste -->
                                        <div class="btn-group" role="group" title="स्टाइल कॉपी/पेस्ट">
                                            <button id="copyStyle" class="btn btn-sm btn-outline-secondary px-2.5 py-1.5" disabled title="स्टाइल कॉपी करें (Copy Style)">
                                                <i class="bi bi-brush"></i>
                                            </button>
                                            <button id="pasteStyle" class="btn btn-sm btn-outline-secondary px-2.5 py-1.5" disabled title="स्टाइल पेस्ट करें (Paste Style)">
                                                <i class="bi bi-clipboard-pulse"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Row 2: Alignment & Distribution (Clean layout) -->
                                    <div class="row g-2 align-items-center">
                                        <!-- Alignment Options -->
                                        <div class="col-12 col-md-7">
                                            <span class="text-secondary small d-block mb-1" style="font-size: 0.72rem; font-weight: 500;">
                                                <i class="bi bi-align-center text-primary me-1"></i> संरेखण उपकरण (Align Boxes)
                                            </span>
                                            <div class="btn-group w-100" role="group">
                                                <button id="alignLeft" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="बाएँ संरेखित करें (Align Left)">
                                                    <i class="bi bi-align-start"></i>
                                                </button>
                                                <button id="alignCenterHorizontal" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="क्षैतिज मध्य संरेखण (Horizontal Center)">
                                                    <i class="bi bi-align-center"></i>
                                                </button>
                                                <button id="alignRight" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="दाएँ संरेखित करें (Align Right)">
                                                    <i class="bi bi-align-end"></i>
                                                </button>
                                                <button id="alignTop" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="ऊपर संरेखित करें (Align Top)">
                                                    <i class="bi bi-align-top"></i>
                                                </button>
                                                <button id="alignCenterVertical" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="लंबवत मध्य संरेखण (Vertical Center)">
                                                    <i class="bi bi-align-middle"></i>
                                                </button>
                                                <button id="alignBottom" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="नीचे संरेखित करें (Align Bottom)">
                                                    <i class="bi bi-align-bottom"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <!-- Distribution Options -->
                                        <div class="col-12 col-md-5">
                                            <span class="text-secondary small d-block mb-1" style="font-size: 0.72rem; font-weight: 500;">
                                                <i class="bi bi-distribute-vertical text-primary me-1"></i> दूरी बराबर करें (Distribute)
                                            </span>
                                            <div class="btn-group w-100" role="group">
                                                <button id="distributeHorizontal" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="क्षैतिज समान अंतर (Distribute Horizontal)">
                                                    <i class="bi bi-distribute-horizontal"></i>
                                                </button>
                                                <button id="distributeVertical" class="btn btn-sm btn-outline-secondary py-1.5" disabled title="लंबवत समान अंतर (Distribute Vertical)">
                                                    <i class="bi bi-distribute-vertical"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> <!-- Closes Column 2 -->

                        <!-- COLUMN 3: LIVE PROPERTIES, PREVIEW & SAVE (Right Column in Fullscreen) -->
                        <div class="textbox-col">
                            <!-- LIVE PREVIEW WINDOW -->
                            <div class="card border-0 shadow-sm bg-body mb-3" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div class="card-body p-3">
                                    <h6 class="mb-2" style="font-size: 0.9rem; font-weight: 600; color: #1e293b;">
                                        <i class="bi bi-eye-fill text-primary me-1.5"></i> वास्तविक समय पूर्वावलोकन (Real-time Preview)
                                    </h6>
                                    <div id="textboxPreview" class="box-preview m-0" style="min-height: 100px; border: 2px dashed #6366f1; background: #fdfdfd; border-radius: 12px; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05); padding: 8px;">
                                        <div class="ql-editor" style="font-size: 0.85rem; padding: 0;"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- ADVANCED STYLING CONTROLS (ACCORDION STYLE) -->
                            <div class="accordion mb-3" id="stylingControlsAccordion" style="border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
                                <!-- Item 1: Background & Padding -->
                                <div class="accordion-item border-0 border-bottom">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button py-2.5 px-3 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#styleCollapseBg" aria-expanded="true" style="font-size: 0.85rem; font-weight: 600;">
                                            <i class="bi bi-paint-bucket text-primary me-2"></i> बैकग्राउंड और पैडिंग
                                        </button>
                                    </h2>
                                    <div id="styleCollapseBg" class="accordion-collapse collapse show" data-bs-parent="#stylingControlsAccordion">
                                        <div class="accordion-body p-3">
                                            <div class="row g-2">
                                                <div class="col-6">
                                                    <label for="bgColorPicker" class="form-label small mb-1" style="font-weight: 500;">बैकग्राउंड रंग</label>
                                                    <input type="color" class="form-control form-control-color w-100" id="bgColorPicker" value="#ffffff" title="Background Color" style="height: 38px;">
                                                </div>
                                                <div class="col-6">
                                                    <label for="textColorPicker" class="form-label small mb-1" style="font-weight: 500;">सीमा / टेक्स्ट रंग</label>
                                                    <input type="color" class="form-control form-control-color w-100" id="textColorPicker" value="#374151" title="Border/Text Color" style="height: 38px;">
                                                </div>
                                                <div class="col-12 mt-2">
                                                    <label for="paddingSlider" class="form-label small mb-1 d-flex justify-content-between">
                                                        <span>आंतरिक पैडिंग (Internal Padding)</span>
                                                        <span id="paddingVal" class="text-primary fw-bold">8px</span>
                                                    </label>
                                                    <input type="range" class="form-range" id="paddingSlider" min="0" max="40" value="8">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 2: Borders & Corners -->
                                <div class="accordion-item border-0 border-bottom">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed py-2.5 px-3 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#styleCollapseBorders" style="font-size: 0.85rem; font-weight: 600;">
                                            <i class="bi bi-bounding-box-circles text-primary me-2"></i> सीमाएं और कोने
                                        </button>
                                    </h2>
                                    <div id="styleCollapseBorders" class="accordion-collapse collapse" data-bs-parent="#stylingControlsAccordion">
                                        <div class="accordion-body p-3">
                                            <div class="row g-2">
                                                <div class="col-6">
                                                    <label for="borderStyleSelect" class="form-label small mb-1" style="font-weight: 500;">बॉर्डर स्टाइल</label>
                                                    <select id="borderStyleSelect" class="form-select form-select-sm">
                                                        <option value="solid" selected>सॉलिड (Solid)</option>
                                                        <option value="dashed">डैश्ड (Dashed)</option>
                                                        <option value="dotted">डॉटेड (Dotted)</option>
                                                        <option value="double">डबल (Double)</option>
                                                        <option value="none">कोई नहीं (None)</option>
                                                    </select>
                                                </div>
                                                <div class="col-6">
                                                    <label for="borderColorPicker" class="form-label small mb-1" style="font-weight: 500;">बॉर्डर का रंग</label>
                                                    <input type="color" class="form-control form-control-color w-100" id="borderColorPicker" value="#cfcfcf" title="Border Color" style="height: 34px; padding: 2px;">
                                                </div>
                                                <div class="col-6 mt-2">
                                                    <label for="borderWidthSlider" class="form-label small mb-1 d-flex justify-content-between">
                                                        <span>बॉर्डर चौड़ाई</span>
                                                        <span id="borderWidthVal" class="text-primary fw-bold">1px</span>
                                                    </label>
                                                    <input type="range" class="form-range" id="borderWidthSlider" min="0" max="10" value="1">
                                                </div>
                                                <div class="col-6 mt-2">
                                                    <label for="borderRadiusSlider" class="form-label small mb-1 d-flex justify-content-between">
                                                        <span>कॉर्नर गोलाई</span>
                                                        <span id="borderRadiusVal" class="text-primary fw-bold">8px</span>
                                                    </label>
                                                    <input type="range" class="form-range" id="borderRadiusSlider" min="0" max="30" value="8">
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Item 3: Shadows & Animations -->
                                <div class="accordion-item border-0">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed py-2.5 px-3 bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#styleCollapseEffects" style="font-size: 0.85rem; font-weight: 600;">
                                            <i class="bi bi-stars text-primary me-2"></i> विशेष प्रभाव
                                        </button>
                                    </h2>
                                    <div id="styleCollapseEffects" class="accordion-collapse collapse" data-bs-parent="#stylingControlsAccordion">
                                        <div class="accordion-body p-3">
                                            <div class="row g-2">
                                                <div class="col-12">
                                                    <label for="boxShadowSelect" class="form-label small mb-1" style="font-weight: 500;">शैडो इफ़ेक्ट (Shadow Effect)</label>
                                                    <select id="boxShadowSelect" class="form-select form-select-sm">
                                                        <option value="none" selected>कोई नहीं (None)</option>
                                                        <option value="soft">हल्का शैडो (Soft Shadow)</option>
                                                        <option value="medium">मध्यम शैडो (Medium Shadow)</option>
                                                        <option value="hard">मजबूत शैडो (Deep Shadow)</option>
                                                        <option value="neon">नियॉन ग्लो (Glowing Neon)</option>
                                                    </select>
                                                </div>
                                                <div class="col-12 mt-2">
                                                    <label for="animationSelect" class="form-label small mb-1" style="font-weight: 500;">कस्टम एनिमेशन (Animation)</label>
                                                    <select id="animationSelect" class="form-select form-select-sm">
                                                        <option value="" selected>कोई नहीं (Static)</option>
                                                        <option value="bg-animated-pulse">धीमी पल्स धड़कन (Pulse Glow)</option>
                                                        <option value="neon-shimmer">नियॉन शिमर (Glowing Neon border)</option>
                                                        <option value="slide-up-fade">स्लाइड इन और फेड (Slide-Up Entrance)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- CORE SUBMIT BUTTON -->
                            <button id="mainActionButton" class="btn btn-primary w-100 py-2.5 mb-2" style="font-weight: 600; border-radius: 8px; box-shadow: 0 4px 12px rgba(13, 110, 253, 0.15);">
                                <i class="bi bi-plus-square-fill me-1.5"></i> नया टेक्स्टबॉक्स बनाएँ (Create Textbox)
                            </button>
                        </div> <!-- Closes Column 3 -->
                    </div> <!-- Closes .textbox-grid-wrapper -->
                `,
  "userInfoContent": `
                    <h5 class="mb-3 text-primary fw-bold" style="font-family: var(--font-display);"><i class="bi bi-person-badge-fill"></i> यूजर प्रोफाइल (Vedra BI Pro Profile)</h5>
                    
                    <!-- Advanced colorful avatar header card matching Login theme exactly -->
                    <div class="card border-0 mb-3 overflow-hidden shadow" style="border-radius: 16px; background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);">
                        <div class="card-body text-white text-center py-4 position-relative">
                            <!-- Circular background glow design -->
                            <div class="position-absolute" style="top: -50px; right: -50px; width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.08); pointer-events: none;"></div>
                            
                            <div class="position-relative d-inline-block mb-3">
                                <div id="userAvatar" class="bg-white text-primary rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-lg" style="width: 76px; height: 76px; font-size: 32px; margin: 0 auto; border: 3px solid rgba(255, 255, 255, 0.45); font-family: var(--font-display);">
                                    U
                                </div>
                                <span class="position-absolute bottom-0 end-0 bg-success border border-white rounded-circle p-2 shadow" style="border-width: 2.5px !important;" title="Active Session"></span>
                            </div>
                            <h5 id="profileDisplayName" class="mb-1 fw-bold" style="font-family: var(--font-display); font-size: 1.25rem;">Demo User</h5>
                            <p id="profileUserEmail" class="text-white-50 small mb-3" style="font-size: 0.82rem; word-break: break-all; opacity: 0.85;"></p>
                            <span id="profileUserBadge" class="badge bg-white text-primary fw-bold px-3 py-1.5 shadow-sm" style="border-radius: 20px; font-size: 0.72rem; letter-spacing: 0.3px;"><i class="bi bi-star-fill text-warning me-1"></i> प्रो विश्लेषक (Pro Analyst)</span>
                        </div>
                    </div>

                    <!-- Mini Mock Dashboard embedded in user profile to sync layout visually -->
                    <div class="card border-0 shadow-sm mb-3 text-start" style="border-radius: 14px; background: #ffffff; border: 1px solid #e2e8f0;">
                        <div class="card-body p-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h6 class="m-0 text-slate-800 fw-bold" style="font-size: 0.75rem; font-family: var(--font-display);">My Performance Visual</h6>
                                <span class="badge bg-primary bg-opacity-10 text-primary" style="font-size: 0.58rem; font-weight: 700;">Live Engine</span>
                            </div>
                            
                            <!-- Mini interactive looking graph columns -->
                            <div class="d-flex justify-content-between align-items-end position-relative" style="height: 52px; padding-top: 5px;">
                                <!-- Tiny Tooltip mimicking Login -->
                                <div class="position-absolute bg-dark text-white rounded px-1.5 py-0.5" style="bottom: 34px; right: 2px; font-size: 0.55rem; z-index: 5; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
                                    Active: <strong style="color: #60a5fa;">$49K</strong>
                                </div>

                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #f1f5f9; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 45%; border-radius: 2px;"></div></div></div>
                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #f1f5f9; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 60%; border-radius: 2px;"></div></div></div>
                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #f1f5f9; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 35%; border-radius: 2px;"></div></div></div>
                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #f1f5f9; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 75%; border-radius: 2px;"></div></div></div>
                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #f1f5f9; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 50%; border-radius: 2px;"></div></div></div>
                                <div class="flex-fill px-0.5"><div style="height: 38px; background: #cbd5e1; border-radius: 2px;" class="position-relative"><div class="bg-primary w-100 position-absolute bottom-0" style="height: 85%; border-radius: 2px;"></div></div></div>
                            </div>
                        </div>
                    </div>

                    <!-- Interactive User Status / Bio with royal blue highlights -->
                    <div class="card border-0 mb-3 p-3 shadow-sm" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <label class="form-label text-slate-600 small fw-bold mb-1.5"><i class="bi bi-chat-quote-fill text-primary"></i> आपका बायो (Your Bio)</label>
                        <div class="d-flex align-items-center gap-2">
                            <input type="text" id="profileBioInput" class="form-control form-control-sm" style="height: 36px; border-radius: 8px; border-color: #cbd5e1; font-size: 0.85rem;" value="डेटा ही सुंदर भविष्य की कुंजी है! 📊" placeholder="अपना बायो दर्ज करें...">
                            <button id="saveBioBtn" class="btn btn-primary btn-sm d-flex align-items-center justify-content-center" style="height: 36px; width: 36px; border-radius: 8px;"><i class="bi bi-check-lg fs-5"></i></button>
                        </div>
                    </div>

                    <!-- Usage Statistics Dashboard Card -->
                    <div class="card border-0 mb-3 shadow-sm" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-700 fw-bold mb-3 small" style="font-family: var(--font-display);"><i class="bi bi-activity text-primary"></i> वास्तविक समय के आँकड़े (Real-time Stats)</h6>
                            <div class="row g-2">
                                <div class="col-6">
                                    <div class="p-2 bg-light rounded text-center" style="border: 1px solid #f1f5f9;">
                                        <div id="statTotalCharts" class="fs-5 fw-bold text-primary">0</div>
                                        <div class="text-muted small" style="font-size: 0.72rem;">कुल चार्ट्स</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-2 bg-light rounded text-center" style="border: 1px solid #f1f5f9;">
                                        <div id="statTotalRows" class="fs-5 fw-bold text-success">0</div>
                                        <div class="text-muted small" style="font-size: 0.72rem;">डेटा पंक्तियाँ</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-2 bg-light rounded text-center" style="border: 1px solid #f1f5f9;">
                                        <div id="statTotalAIQueries" class="fs-5 fw-bold text-warning">0</div>
                                        <div class="text-muted small" style="font-size: 0.72rem;">AI प्रश्न</div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-2 bg-light rounded text-center" style="border: 1px solid #f1f5f9;">
                                        <div id="statActiveTheme" class="fs-5 fw-bold text-info">लाइट</div>
                                        <div class="text-muted small" style="font-size: 0.72rem;">सक्रिय थीम</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Backup and Restore Feature Cards -->
                    <div class="card border-0 bg-light mb-3" style="border-radius: 10px;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-muted fw-bold mb-2 small"><i class="bi bi-cloud-arrow-down text-info"></i> डैशबोर्ड बैकअप और रीस्टोर</h6>
                            <p class="text-muted small" style="font-size: 0.75rem;">अपना संपूर्ण डैशबोर्ड डेटा निर्यात/आयात करें:</p>
                            <div class="d-flex gap-2">
                                <button id="btnBackupDashboard" class="btn btn-outline-secondary btn-sm flex-fill py-1.5"><i class="bi bi-download"></i> बैकअप लें</button>
                                <button id="btnRestoreDashboard" class="btn btn-outline-secondary btn-sm flex-fill py-1.5" onclick="document.getElementById('restoreFileInput').click();"><i class="bi bi-upload"></i> रीस्टोर करें</button>
                                <input type="file" id="restoreFileInput" class="d-none" accept=".json">
                            </div>
                        </div>
                    </div>

                    <!-- System Action Menu -->
                    <div class="list-group mb-3" style="border-radius: 8px;">
                        <button id="btnResetDashboardAll" class="list-group-item list-group-item-action text-danger fw-bold d-flex align-items-center justify-content-between py-2">
                            <span><i class="bi bi-trash3 me-2"></i> सभी स्थानीय डेटा रीसेट करें</span>
                            <i class="bi bi-chevron-right"></i>
                        </button>
                    </div>

                    <!-- Logout Button Container -->
                    <div class="mt-3 mb-4">
                        <button id="logoutBtn" class="btn btn-danger w-100 py-2.5 fw-bold" style="border-radius: 8px;"><i class="bi bi-box-arrow-right me-2"></i> लॉग आउट (Log Out)</button>
                    </div>
                `,
  "advancedSettingsContent": `
                    <h5 class="mb-3"><i class="bi bi-sliders text-primary"></i> एडवांस्ड चार्ट सेटिंग्स</h5>
                    <div id="advancedChartSettings" class="p-1">
                        <!-- Existing Switches with nice design -->
                        <div class="card border-0 bg-white p-3 mb-3 shadow-sm" style="border-radius: 12px;">
                            <h6 class="text-primary mb-3"><i class="bi bi-display"></i> सामान्य सेटिंग्स (General)</h6>
                            <div class="mb-2.5 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="gridShowHide" checked>
                                <label class="form-check-label fw-semibold text-secondary" for="gridShowHide" style="font-size: 0.9rem;">ग्रिड दिखाएँ/छिपाएँ</label>
                            </div>
                            <div class="mb-2.5 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="tooltipOnOff" checked>
                                <label class="form-check-label fw-semibold text-secondary" for="tooltipOnOff" style="font-size: 0.9rem;">टूलटिप चालू/बंद</label>
                            </div>
                            <div class="mb-2.5 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="zoomEnable">
                                <label class="form-check-label fw-semibold text-secondary" for="zoomEnable" style="font-size: 0.9rem;">ज़ूम सक्षम करें (DataZoom)</label>
                            </div>
                            <div class="mb-2.5 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showLabels" checked>
                                <label class="form-check-label fw-semibold text-secondary" for="showLabels" style="font-size: 0.9rem;">डेटा लेबल दिखाएँ</label>
                            </div>
                            <div class="mb-0 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="showToolbox">
                                <label class="form-check-label fw-semibold text-secondary" for="showToolbox" style="font-size: 0.9rem;">स्मार्ट टूलबॉक्स दिखाएं (Save/View Data)</label>
                            </div>
                        </div>

                        <div class="card border-0 bg-white p-3 mb-3 shadow-sm" style="border-radius: 12px;">
                            <h6 class="text-primary mb-3"><i class="bi bi-palette"></i> शैली और रंग (Style & Color)</h6>
                            
                            <div class="mb-3">
                                <label for="colorPaletteName" class="form-label small fw-bold text-muted">कलर थीम चुनें (Color Palette):</label>
                                <select class="form-select form-select-sm" id="colorPaletteName">
                                    <option value="classic">क्लासिक (Default)</option>
                                    <option value="vibrant">ऊर्जावान (Vibrant)</option>
                                    <option value="pastel">पेस्टल (Soft Pastel)</option>
                                    <option value="neon">चमकदार नियॉन (Glowing Neon)</option>
                                    <option value="sunset">सूर्यास्त (Warm Sunset)</option>
                                    <option value="forest">प्रकृति / वन (Forest Earth)</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label for="fontSize" class="form-label small fw-bold text-muted">टेक्स्ट फ़ॉन्ट साइज (Font Size):</label>
                                <select class="form-select form-select-sm" id="fontSize">
                                    <option value="small">छोटा (Small)</option>
                                    <option value="medium" selected>सामान्य (Medium)</option>
                                    <option value="large">बड़ा (Large)</option>
                                </select>
                            </div>

                            <div class="mb-0">
                                <label for="gridStyle" class="form-label small fw-bold text-muted">ग्रिड लाइन स्टाइल (Grid Line Style):</label>
                                <select class="form-select form-select-sm" id="gridStyle">
                                    <option value="solid" selected>सॉलिड रेखा (Solid)</option>
                                    <option value="dashed">टूटी रेखा (Dashed)</option>
                                    <option value="dotted">बिंदु वाली रेखा (Dotted)</option>
                                </select>
                            </div>
                        </div>

                        <div class="card border-0 bg-white p-3 mb-3 shadow-sm" style="border-radius: 12px;">
                            <h6 class="text-primary mb-3"><i class="bi bi-activity"></i> चार्ट विशिष्ट सेटिंग्स (Specifics)</h6>
                            
                            <div class="mb-3">
                                <label for="lineStyle" class="form-label small fw-bold text-muted">लाइन चार्ट वक्र (Line Style):</label>
                                <select class="form-select form-select-sm" id="lineStyle">
                                    <option value="normal" selected>सीधी रेखा (Normal)</option>
                                    <option value="smooth">स्मूद कर्व (Smooth)</option>
                                    <option value="step">स्टेप लाइन (Step)</option>
                                </select>
                            </div>

                            <div class="mb-2.5 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="areaFill">
                                <label class="form-check-label fw-semibold text-secondary" for="areaFill" style="font-size: 0.9rem;">लाइन चार्ट में रंग भरें (Area Fill)</label>
                            </div>

                            <div class="mb-0 form-check form-switch">
                                <input class="form-check-input" type="checkbox" id="barRounded" checked>
                                <label class="form-check-label fw-semibold text-secondary" for="barRounded" style="font-size: 0.9rem;">बार चार्ट को घुमावदार (Rounded) बनाएं</label>
                            </div>
                        </div>

                        <div class="card border-0 bg-white p-3 mb-3 shadow-sm" style="border-radius: 12px;">
                            <h6 class="text-primary mb-3"><i class="bi bi-clock-history"></i> उन्नत विन्यास (Advanced)</h6>
                            
                            <div class="mb-3">
                                <label for="animationDuration" class="form-label small fw-bold text-muted">एनीमेशन अवधि (मिलीसेकंड): <span id="animationDurationValue" class="badge bg-secondary">1000</span></label>
                                <input type="range" class="form-range" id="animationDuration" min="0" max="3000" value="1000" step="100">
                            </div>
                            
                            <div class="mb-3">
                                <label for="axisFormat" class="form-label small fw-bold text-muted">एक्सिस फॉर्मेट:</label>
                                <select class="form-select form-select-sm" id="axisFormat">
                                    <option value="none">कोई नहीं</option>
                                    <option value="compact">कॉम्पैक्ट (जैसे 1K, 1M)</option>
                                    <option value="currency">करेंसी (जैसे ₹1,000)</option>
                                    <option value="percent">प्रतिशत (जैसे 10%)</option>
                                </select>
                            </div>
                            
                            <div class="mb-0">
                                <label for="legendPosition" class="form-label small fw-bold text-muted">लेजेंड पोजीशन:</label>
                                <select class="form-select form-select-sm" id="legendPosition">
                                    <option value="bottom">नीचे (Bottom)</option>
                                    <option value="top">ऊपर (Top)</option>
                                    <option value="left">बाएं (Left)</option>
                                    <option value="right">दाएं (Right)</option>
                                    <option value="none">कोई नहीं (None)</option>
                                </select>
                            </div>
                        </div>

                        <div class="mb-3">
                            <button id="applyChartSettings" class="btn btn-primary w-100 py-2.5 fw-bold shadow-sm" style="border-radius: 8px;"><i class="bi bi-check-circle-fill me-1"></i> सेटिंग्स लागू करें</button>
                        </div>
                    </div>
                `,
  "dataContent": `
                    <h5 class="mb-3"><i class="bi bi-database-fill-gear text-primary"></i> डेटा अपलोड और लाइव सोर्सेज</h5>
                    
                    <!-- Inner navigation pills -->
                    <ul class="nav nav-pills nav-fill mb-3" id="dataTab" role="tablist" style="font-size: 0.8rem;">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active py-1.5" id="file-tab" data-bs-toggle="pill" data-bs-target="#file-upload-panel" type="button" role="tab" aria-controls="file-upload-panel" aria-selected="true">
                                <i class="bi bi-file-earmark-arrow-up"></i> फ़ाइल
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-1.5" id="api-tab" data-bs-toggle="pill" data-bs-target="#api-source-panel" type="button" role="tab" aria-controls="api-source-panel" aria-selected="false">
                                <i class="bi bi-hdd-network"></i> API
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-1.5" id="mock-tab" data-bs-toggle="pill" data-bs-target="#mock-generator-panel" type="button" role="tab" aria-controls="mock-generator-panel" aria-selected="false">
                                <i class="bi bi-magic"></i> मॉक
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-1.5" id="clean-tab" data-bs-toggle="pill" data-bs-target="#clean-transform-panel" type="button" role="tab" aria-controls="clean-transform-panel" aria-selected="false">
                                <i class="bi bi-scissors"></i> क्लीन
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-1.5" id="profile-tab" data-bs-toggle="pill" data-bs-target="#data-profile-panel" type="button" role="tab" aria-controls="data-profile-panel" aria-selected="false">
                                <i class="bi bi-bar-chart-steps"></i> प्रोफाइल
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content" id="dataTabContent">
                        <!-- Panel A: File Upload -->
                        <div class="tab-pane fade show active" id="file-upload-panel" role="tabpanel" aria-labelledby="file-tab">
                            <div id="file-drag-zone" class="border border-2 border-dashed rounded-3 p-4 text-center mb-3 bg-white hover-shadow" style="cursor: pointer; transition: all 0.2s ease;">
                                <i class="bi bi-cloud-arrow-up text-primary fs-1 mb-2 d-block"></i>
                                <p class="mb-1 fw-bold">फ़ाइल ड्रैग करें या क्लिक करें</p>
                                <p class="text-muted small mb-0" style="font-size: 0.75rem;">CSV, XLS, XLSX, JSON फ़ाइलों का समर्थन है</p>
                                <input type="file" id="fileInput" class="d-none" accept=".csv, .xlsx, .xls, .json">
                            </div>

                            <div class="card border-0 bg-white p-3 mb-3 shadow-sm" style="border-radius: 12px; border: 1px solid #e2e8f0;">
                                <h6 class="text-primary mb-2 small fw-bold"><i class="bi bi-google"></i> Google Sheets लाइव सिंक</h6>
                                <p class="text-muted small mb-2" style="font-size: 0.75rem;">सार्वजनिक (Anyone with link can view) Google Sheet का लिंक दर्ज करें:</p>
                                <div class="input-group input-group-sm mb-2">
                                    <input type="url" id="googleSheetUrlInput" class="form-control" placeholder="https://docs.google.com/spreadsheets/d/.../edit">
                                    <button id="syncGoogleSheetBtn" class="btn btn-primary" type="button"><i class="bi bi-arrow-repeat"></i> सिंक करें</button>
                                </div>
                                <div class="text-muted small" style="font-size: 0.7rem;"><i class="bi bi-info-circle"></i> नोट: सुनिश्चित करें कि शीट "Anyone with link can view" पर सेट हो।</div>
                            </div>
                        </div>

                        <!-- Panel B: Live API Source -->
                        <div class="tab-pane fade" id="api-source-panel" role="tabpanel" aria-labelledby="api-tab">
                            <div class="mb-3">
                                <label class="form-label text-muted small"><i class="bi bi-box-arrow-in-right"></i> रेडीमेड लाइव डेटा सोर्स:</label>
                                <select id="presetApiSelect" class="form-select">
                                    <option value="">-- अपनी पसंद का सोर्स चुनें (वैकल्पिक) --</option>
                                    <option value="crypto-bitcoin">₿ Bitcoin Live Price (Realtime CoinGecko)</option>
                                    <option value="crypto-market">📊 Cryptocurrencies Market Rate (Binance Feed)</option>
                                    <option value="weather-feed">☀️ Live Weather Tracker (Simulated Cities)</option>
                                    <option value="random-user-sales">💼 Sales Performance (Dynamic Corporate API)</option>
                                </select>
                            </div>
                            
                            <div class="mb-3">
                                <label for="apiInput" class="form-label"><i class="bi bi-link-45deg"></i> API URL:</label>
                                <input type="url" class="form-control" id="apiInput" placeholder="https://api.example.com/data">
                            </div>

                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-arrow-right-circle"></i> HTTP Method & Cache:</label>
                                <div class="row g-2">
                                    <div class="col-6">
                                        <select id="apiMethod" class="form-select">
                                            <option value="GET">GET</option>
                                            <option value="POST">POST</option>
                                        </select>
                                    </div>
                                    <div class="col-6 d-flex align-items-center justify-content-center">
                                        <div class="form-check form-switch mb-0">
                                            <input class="form-check-input" type="checkbox" id="cacheBuster" checked>
                                            <label class="form-check-label small" for="cacheBuster" style="font-size:0.75rem;">नो-कैश</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-code-square"></i> कस्टम हेडर (Headers JSON):</label>
                                <textarea id="apiHeaders" class="form-control font-mono" style="height: 60px; font-size: 0.75rem;" placeholder='{"Content-Type": "application/json"}'></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-signpost-split"></i> JSON डेटा पाथ (Parsing Path):</label>
                                <input type="text" id="apiDataPath" class="form-control" placeholder="उदा: data.results, list, results (ऑटो-डिटेक्ट के लिए खाली छोड़ें)">
                            </div>

                            <div class="mb-3">
                                <label for="updateInterval" class="form-label"><i class="bi bi-stopwatch"></i> ऑटो-अपडेट अंतराल (सेकंड):</label>
                                <input type="number" class="form-control" id="updateInterval" value="60">
                            </div>

                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="apiPerformanceMode" checked>
                                    <label class="form-check-label small fw-bold text-success" for="apiPerformanceMode"><i class="bi bi-cpu"></i> हाई-परफॉर्मेंस मोड (बिना लैग)</label>
                                </div>
                                <div class="text-muted" style="font-size: 0.65rem; margin-top: 2px;">सक्रिय रहने पर लाइव अपडेट के दौरान भारी टेबल रेंडरिंग को रोका जाता है ताकि ब्राउज़र लैग न करे।</div>
                            </div>

                            <!-- Live Connection Status Display -->
                            <div class="mb-3 p-2 border rounded bg-light" id="liveStatusContainer" style="display: none;">
                                <div class="d-flex align-items-center justify-content-between mb-1">
                                    <span class="small fw-bold text-secondary"><i class="bi bi-broadcast text-danger"></i> लाइव फीड:</span>
                                    <span class="badge bg-success" id="liveStatusBadge"><span class="spinner-grow spinner-grow-sm me-1" style="width: 8px; height: 8px;" role="status"></span>सक्रिय (Active)</span>
                                </div>
                                <div class="small" style="font-size: 0.7rem;">
                                    <strong>अंतिम सिंक:</strong> <span id="liveStatusLastSync">-</span><br>
                                    <strong>अपडेटेड रिकॉर्ड्स:</strong> <span id="liveStatusRecords">-</span>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between gap-2">
                                <button id="fetchDataFromApiBtn" class="btn btn-primary flex-fill py-2"><i class="bi bi-play-circle"></i> लाइव शुरू करें</button>
                                <button id="stopLiveUpdateBtn" class="btn btn-danger flex-fill py-2"><i class="bi bi-stop-circle"></i> रोकें</button>
                            </div>
                        </div>

                        <!-- Panel C: Mock Generator -->
                        <div class="tab-pane fade" id="mock-generator-panel" role="tabpanel" aria-labelledby="mock-tab">
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-card-list"></i> मॉक डेटा थीम चुनें:</label>
                                <select id="mockThemeSelect" class="form-select">
                                    <option value="sales">E-Commerce Sales (शहर, बिक्री, दिनांक)</option>
                                    <option value="finance">Finance Expenses (विभाग, बजट, खर्च)</option>
                                    <option value="hr">HR Performance (कर्मचारी, रेटिंग, विभाग)</option>
                                    <option value="iot">IoT Sensors (सेंसर, तापमान, समय)</option>
                                    <option value="stock">Cryptocurrency Daily Rates (कॉइन, मूल्य, वॉल्यूम)</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label class="form-label"><i class="bi bi-hash"></i> पंक्तियों की संख्या (Row Count):</label>
                                <input type="number" id="mockRowCount" class="form-control text-center" value="15" min="5" max="200">
                            </div>
                            <div class="mb-3">
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="mockAutoRefresh">
                                    <label class="form-check-label small" for="mockAutoRefresh">हर 10 सेकंड में ऑटो-अपडेट करें (लाइव सिमुलेशन)</label>
                                </div>
                            </div>
                            <button id="generateMockDataBtn" class="btn btn-success w-100 py-2">
                                <i class="bi bi-gear-wide-connected"></i> मॉक डेटा जनरेट करें
                            </button>
                        </div>

                        <!-- Panel D: Power Query / Clean & Transform -->
                        <div class="tab-pane fade" id="clean-transform-panel" role="tabpanel" aria-labelledby="clean-tab">
                            <div class="accordion accordion-flush" id="cleanAccordion">
                                
                                <!-- Rename Column Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRename">
                                            <span class="small fw-bold"><i class="bi bi-pencil-square text-primary me-1"></i> कॉलम का नाम बदलें (Rename Column)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseRename" class="accordion-collapse collapse show" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">कॉलम चुनें:</label>
                                                <select id="cleanRenameColSelect" class="form-select form-select-sm"></select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">नया नाम दर्ज करें:</label>
                                                <input type="text" id="cleanNewColName" class="form-control form-control-sm" placeholder="उदा: City_Name">
                                            </div>
                                            <button id="cleanRenameBtn" class="btn btn-sm btn-primary w-100"><i class="bi bi-check-circle"></i> नाम बदलें</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Remove Column Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseRemove">
                                            <span class="small fw-bold"><i class="bi bi-trash-fill text-danger me-1"></i> कॉलम हटाएं (Remove Column)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseRemove" class="accordion-collapse collapse" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">हटाने के लिए कॉलम चुनें:</label>
                                                <select id="cleanRemoveColSelect" class="form-select form-select-sm"></select>
                                            </div>
                                            <button id="cleanRemoveBtn" class="btn btn-sm btn-danger w-100"><i class="bi bi-trash"></i> कॉलम हटाएं</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Missing Values Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMissing">
                                            <span class="small fw-bold"><i class="bi bi-magic text-warning me-1"></i> मिसिंग वैल्यूज सुधारें (Impute/Clean)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseMissing" class="accordion-collapse collapse" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">कॉलम चुनें:</label>
                                                <select id="cleanMissingColSelect" class="form-select form-select-sm">
                                                    <option value="all">सभी कॉलम (All Columns)</option>
                                                </select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">क्या करना चाहते हैं?</label>
                                                <select id="cleanMissingStrategySelect" class="form-select form-select-sm">
                                                    <option value="drop">रिक्त रो/पंक्ति हटा दें (Drop Rows)</option>
                                                    <option value="zero">0 से भरें (Fill with 0)</option>
                                                    <option value="custom">कस्टम मान भरें (Fill with Custom Value)</option>
                                                    <option value="mean">औसत से भरें (Mean - Numeric Only)</option>
                                                    <option value="median">मध्यिका से भरें (Median - Numeric Only)</option>
                                                </select>
                                            </div>
                                            <div class="mb-2" id="cleanCustomValWrapper" style="display:none;">
                                                <label class="form-label small text-muted">कस्टम वैल्यू दर्ज करें:</label>
                                                <input type="text" id="cleanMissingCustomVal" class="form-control form-control-sm" placeholder="उदा: N/A या Unknown">
                                            </div>
                                            <button id="cleanMissingBtn" class="btn btn-sm btn-warning w-100"><i class="bi bi-stars"></i> मिसिंग डेटा ठीक करें</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Permanent Filter Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFilter">
                                            <span class="small fw-bold"><i class="bi bi-funnel-fill text-success me-1"></i> कठोर रो फ़िल्टर (Row Reducer)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseFilter" class="accordion-collapse collapse" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">फ़िल्टर कॉलम:</label>
                                                <select id="cleanFilterColSelect" class="form-select form-select-sm"></select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">शर्त (Condition):</label>
                                                <select id="cleanFilterOperatorSelect" class="form-select form-select-sm">
                                                    <option value="eq">बराबर (Equals)</option>
                                                    <option value="ne">बराबर नहीं (Not Equal)</option>
                                                    <option value="gt">से अधिक (Greater Than &gt;)</option>
                                                    <option value="lt">से कम (Less Than &lt;)</option>
                                                    <option value="contains">शामिल है (Contains)</option>
                                                    <option value="not_contains">शामिल नहीं है (Doesn't Contain)</option>
                                                </select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">तुलना मूल्य (Value):</label>
                                                <input type="text" id="cleanFilterVal" class="form-control form-control-sm" placeholder="उदा: Mumbai या 5000">
                                            </div>
                                            <button id="cleanFilterBtn" class="btn btn-sm btn-success w-100"><i class="bi bi-filter-square"></i> स्थायी रूप से हटाएँ/रखें</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Change Data Type Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseDataType">
                                            <span class="small fw-bold"><i class="bi bi-hash text-info me-1"></i> डेटा टाइप बदलें (Change Data Type)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseDataType" class="accordion-collapse collapse" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">कॉलम चुनें:</label>
                                                <select id="cleanTypeColSelect" class="form-select form-select-sm"></select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">लक्ष्य टाइप (Target Type):</label>
                                                <select id="cleanTypeTargetSelect" class="form-select form-select-sm">
                                                    <option value="number">संख्या (Number)</option>
                                                    <option value="text">टेक्स्ट (Text)</option>
                                                    <option value="date">दिनांक (Date)</option>
                                                </select>
                                            </div>
                                            <button id="cleanTypeBtn" class="btn btn-sm btn-info text-white w-100"><i class="bi bi-arrow-left-right"></i> टाइप बदलें</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Custom Formula Section -->
                                <div class="accordion-item bg-transparent">
                                    <h2 class="accordion-header">
                                        <button class="accordion-button collapsed px-1 py-2.5 bg-transparent" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFormula">
                                            <span class="small fw-bold"><i class="bi bi-calculator-fill text-dark me-1"></i> विज़ुअल फ़ॉर्मूला (Apply Formula)</span>
                                        </button>
                                    </h2>
                                    <div id="collapseFormula" class="accordion-collapse collapse" data-bs-parent="#cleanAccordion">
                                        <div class="accordion-body px-1 py-2 text-start">
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">परिणामी कॉलम (Target Column):</label>
                                                <input type="text" id="formulaTargetCol" class="form-control form-control-sm" placeholder="उदा: Total_Amount">
                                                <div class="form-text text-muted" style="font-size: 10px;">नया कॉलम बनाने के लिए नया नाम लिखें या पुराने को बदलने के लिए उसका नाम लिखें।</div>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">कॉलम ए (Column A):</label>
                                                <select id="formulaColA" class="form-select form-select-sm"></select>
                                            </div>
                                            <div class="mb-2">
                                                <label class="form-label small text-muted">ऑपरेटर (Operator):</label>
                                                <select id="formulaOp" class="form-select form-select-sm">
                                                    <option value="+">जोड़ें (Add +)</option>
                                                    <option value="-">घटाएं (Subtract -)</option>
                                                    <option value="*">गुणा करें (Multiply *)</option>
                                                    <option value="/">भाग दें (Divide /)</option>
                                                    <option value="concat">टेक्स्ट जोड़ें (Concat Text)</option>
                                                </select>
                                            </div>
                                            <div class="mb-3">
                                                <label class="form-label small text-muted">दूसरा इनपुट (Input B):</label>
                                                <div class="mb-1">
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="formulaBType" id="formulaBTypeCol" value="col" checked>
                                                        <label class="form-check-label small" for="formulaBTypeCol">कॉलम</label>
                                                    </div>
                                                    <div class="form-check form-check-inline">
                                                        <input class="form-check-input" type="radio" name="formulaBType" id="formulaBTypeVal" value="val">
                                                        <label class="form-check-label small" for="formulaBTypeVal">स्थिर मान</label>
                                                    </div>
                                                </div>
                                                <select id="formulaColB" class="form-select form-select-sm mb-1"></select>
                                                <input type="text" id="formulaValB" class="form-control form-control-sm d-none" placeholder="उदा: 10 या USD">
                                            </div>
                                            <button id="formulaApplyBtn" class="btn btn-sm btn-dark w-100"><i class="bi bi-play-fill"></i> फ़ॉर्मूला लागू करें</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- Panel E: Data Profile / Quality Check -->
                        <div class="tab-pane fade" id="data-profile-panel" role="tabpanel" aria-labelledby="profile-tab">
                            <h6 class="small text-muted mb-2"><i class="bi bi-info-circle-fill text-info"></i> डेटा सांख्यिकी और स्वास्थ्य प्रोफाइल</h6>
                            
                            <div class="row g-2 mb-3">
                                <div class="col-6">
                                    <div class="p-2 border rounded text-center bg-light">
                                        <span class="d-block text-muted small" style="font-size:0.7rem;">कुल रो (Rows)</span>
                                        <strong id="profileTotalRows" class="fs-5">-</strong>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="p-2 border rounded text-center bg-light">
                                        <span class="d-block text-muted small" style="font-size:0.7rem;">कॉलम (Cols)</span>
                                        <strong id="profileTotalCols" class="fs-5">-</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small text-muted fw-bold"><i class="bi bi-heart-pulse-fill text-danger"></i> कॉलम स्वास्थ्य (Quality):</label>
                                <div class="table-responsive border rounded" style="max-height: 250px; overflow-y: auto;">
                                    <table class="table table-sm table-striped mb-0 text-center" style="font-size: 0.72rem;">
                                        <thead class="table-dark sticky-top">
                                            <tr>
                                                <th class="text-start">कॉलम</th>
                                                <th>प्रकार</th>
                                                <th>रिक्त (%)</th>
                                                <th>यूनिक</th>
                                            </tr>
                                        </thead>
                                        <tbody id="profileStatsBody">
                                            <tr>
                                                <td colspan="4" class="text-muted text-center py-3">कोई डेटा लोड नहीं है</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div class="mb-3">
                                <label class="form-label small text-muted fw-bold"><i class="bi bi-table text-primary"></i> छोटा डेटा प्रिव्यू (First 3 Rows):</label>
                                <div class="table-responsive border rounded" style="max-height: 180px; overflow-y: auto;">
                                    <table class="table table-sm table-bordered mb-0" style="font-size: 0.68rem; min-width: 300px;">
                                        <thead class="table-light sticky-top" id="profilePreviewHead">
                                        </thead>
                                        <tbody id="profilePreviewBody">
                                            <tr>
                                                <td class="text-muted text-center py-2">कोई डेटा लोड नहीं है</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <button id="profileExportBtn" class="btn btn-sm btn-outline-primary w-100 mb-2">
                                <i class="bi bi-download"></i> क्लीन डेटा डाउनलोड करें (CSV)
                            </button>
                        </div>
                    </div>
                `,
  "templatesContent": `
                    <h5 class="mb-2 text-primary"><i class="bi bi-folder-symlink-fill"></i> लेआउट टेम्पलेट्स</h5>
                    <p class="text-muted text-xs mb-3">आपके द्वारा बनाए गए पूरे सुंदर डैशबोर्ड को सेव करने और अगली बार सीधे लोड करने का विकल्प। आप अलग-अलग विभागों (जैसे Sales, Finance, HR) के लिए अलग लेआउट सेव कर सकेंगे।</p>
                    
                    <!-- Save Template Form -->
                    <div class="card p-3 mb-3 border bg-light-subtle shadow-sm">
                        <h6 class="fw-bold text-dark mb-2" style="font-size: 13px;"><i class="bi bi-cloud-arrow-up-fill text-success"></i> नया लेआउट सहेजें</h6>
                        <div class="mb-2">
                            <label for="templateNameInput" class="form-label text-xs font-semibold mb-1">टेम्पलेट का नाम:</label>
                            <input type="text" id="templateNameInput" class="form-control form-control-sm" placeholder="उदा: मासिक सेल्स रिपोर्ट">
                        </div>
                        <div class="mb-3">
                            <label for="templateDeptSelect" class="form-label text-xs font-semibold mb-1">विभाग (Department):</label>
                            <select id="templateDeptSelect" class="form-select form-select-sm">
                                <option value="General">सामान्य (General)</option>
                                <option value="Sales">बिक्री (Sales)</option>
                                <option value="Finance">वित्त (Finance)</option>
                                <option value="HR">मानव संसाधन (HR)</option>
                            </select>
                        </div>
                        <button id="saveTemplateLayoutBtn" class="btn btn-sm btn-success w-100 fw-bold"><i class="bi bi-check-circle-fill"></i> वर्तमान लेआउट सहेजें</button>
                    </div>

                    <!-- Layout Presets List -->
                    <div class="mb-3">
                        <h6 class="fw-bold text-dark mb-2" style="font-size: 13px;"><i class="bi bi-collection-play-fill text-primary"></i> रेडीमेड और सहेजे गए टेम्पलेट्स</h6>
                        
                        <!-- Filter Templates by Dept -->
                        <div class="d-flex gap-1 mb-2 overflow-x-auto pb-1" id="templateFilters">
                            <button class="btn btn-xs btn-primary template-filter-btn" data-dept="All">सभी</button>
                            <button class="btn btn-xs btn-outline-secondary template-filter-btn" data-dept="Sales">Sales</button>
                            <button class="btn btn-xs btn-outline-secondary template-filter-btn" data-dept="Finance">Finance</button>
                            <button class="btn btn-xs btn-outline-secondary template-filter-btn" data-dept="HR">HR</button>
                            <button class="btn btn-xs btn-outline-secondary template-filter-btn" data-dept="General">General</button>
                        </div>
                        
                        <!-- Dynamic list of templates -->
                        <div id="templatesListContainer" class="d-flex flex-column gap-2" style="max-height: 320px; overflow-y: auto;">
                            <!-- Templates will be rendered dynamically -->
                        </div>
                    </div>
                `,
  "dataInsertSidebar": `
        <div class="offcanvas-header bg-primary text-white">
            <h5 class="offcanvas-title" id="dataInsertSidebarLabel"><i class="bi bi-database-fill me-2"></i> Live Data Insertion</h5>
            <button type="button" class="btn-close btn-close-white" id="closeDataSidebarBtn" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body d-flex flex-column">
            <p class="text-muted small">टेक्स्टबॉक्स में डालने के लिए विशिष्ट **डेटा पंक्तियों (Data Rows)** का चयन करें। (फ़िल्टर्ड डेटा की पहली 50 पंक्तियाँ दिखा रहा है)</p>
            
            <div id="dataListContainer" class="flex-grow-1 overflow-auto p-2 border rounded mb-3 bg-light" style="max-height: 80%;">
                <p class="text-center text-muted p-5">डेटा लोड हो रहा है...</p>
            </div>

            <button id="insertSelectedDataBtn" class="btn btn-success w-100 mt-auto">
                <i class="bi bi-box-arrow-in-down me-2"></i> चयनित डेटा पंक्तियाँ इन्सर्ट करें
            </button>
        </div>
    `,
  "advancedAnalyticsModal": `
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5 class="modal-title" id="advancedAnalyticsModalLabel"><i class="bi bi-cpu-fill me-2"></i> एडवांस्ड एनालिटिक्स रिपोर्ट</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="advancedAnalyticsModalBody">
                    <!-- Dynamic content will go here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">बंद करें</button>
                    <button type="button" class="btn btn-primary" onclick="window.print();"><i class="bi bi-printer me-1"></i> प्रिंट करें</button>
                </div>
            </div>
        </div>
    `,
  "codeEditorModal": `
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content bg-dark border-0">
                <!-- Header -->
                <div class="modal-header bg-black text-white border-bottom border-secondary py-3">
                    <div class="d-flex align-items-center">
                        <div class="bg-primary bg-opacity-25 text-primary border border-primary rounded p-2 me-3 d-flex align-items-center justify-content-center" style="width: 36px; height: 36px;">
                            <i class="bi bi-braces-asterisk fs-5"></i>
                        </div>
                        <div>
                            <h5 class="modal-title fw-bold mb-0" id="codeEditorModalLabel">Professional JSON Workspace</h5>
                            <span class="text-muted small" style="font-size: 0.7rem;">Advanced live-updating JSON style compiler & preview deck</span>
                        </div>
                    </div>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <!-- Main Grid Layout -->
                <div class="modal-body bg-dark text-white p-0">
                    <div class="container-fluid h-100 p-0">
                        <div class="row g-0 h-100">
                            <!-- Left: Code Editor Pane -->
                            <div class="col-12 col-lg-7 d-flex flex-column h-100 border-end border-secondary" style="background: #1e1e1e;">
                                <!-- Top Toolbar -->
                                <div class="p-3 bg-black border-bottom border-secondary d-flex flex-wrap align-items-center justify-content-between gap-2">
                                    <div class="d-flex align-items-center gap-2 flex-grow-1 flex-md-grow-0">
                                        <span class="text-muted small fw-bold me-1"><i class="bi bi-magic"></i> Presets:</span>
                                        <select id="selPresetsJson" class="form-select form-select-sm bg-dark text-light border-secondary" style="min-width: 180px; font-size: 0.75rem;">
                                            <option value="">-- Choose a Preset Design --</option>
                                        </select>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <button class="btn btn-sm btn-outline-info" id="btnBeautifyJson" title="Format / Beautify code">
                                            <i class="bi bi-file-earmark-code me-1"></i> Format
                                        </button>
                                        <button class="btn btn-sm btn-outline-secondary" id="btnMinifyJson" title="Minify / Compress JSON">
                                            <i class="bi bi-node-minus me-1"></i> Minify
                                        </button>
                                        <button class="btn btn-sm btn-outline-success" id="btnValidateJson" title="Validate JSON syntax">
                                            <i class="bi bi-check2-circle me-1"></i> Validate
                                        </button>
                                    </div>
                                </div>

                                <!-- Actual Editor Container -->
                                <div class="flex-grow-1 position-relative" style="overflow: hidden;">
                                    <div id="editorContainer" style="height: 100%; width: 100%;"></div>
                                </div>

                                <!-- Diagnostic Bottom Status Bar -->
                                <div class="p-2 border-top border-secondary bg-black d-flex align-items-center justify-content-between text-muted" style="font-size: 0.75rem;">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="badge" id="jsonStatusBadge">Status</span>
                                        <span id="editorStatusLog">Ready. Edit your JSON configuration.</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-3">
                                        <span>Lines: <strong id="editorTotalLines">0</strong></span>
                                        <span>Size: <strong id="editorTextSize">0 B</strong></span>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Live Preview Panel -->
                            <div class="col-12 col-lg-5 d-flex flex-column h-100 bg-black" style="background: radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px); background-size: 24px 24px;">
                                <!-- Live Toggle Header -->
                                <div class="p-3 bg-black bg-opacity-50 border-bottom border-secondary d-flex align-items-center justify-content-between">
                                    <div class="d-flex align-items-center">
                                        <span class="spinner-grow spinner-grow-sm text-success me-2" role="status"></span>
                                        <h6 class="mb-0 fw-bold"><i class="bi bi-eye"></i> Active Live Preview</h6>
                                    </div>
                                    <div class="form-check form-switch mb-0">
                                        <input class="form-check-input" type="checkbox" id="chkLiveSyncDashboard" checked>
                                        <label class="form-check-label small text-muted fw-semibold" for="chkLiveSyncDashboard">Live Sync with Dashboard</label>
                                    </div>
                                </div>

                                <!-- Workspace Context Header & Mode Switcher -->
                                <div class="px-3 py-2 bg-dark bg-opacity-25 border-bottom border-secondary d-flex flex-wrap align-items-center justify-content-between gap-2" style="font-size: 0.75rem;">
                                    <div class="d-flex align-items-center gap-1">
                                        <span class="badge" id="workspaceBadge">Loading Workspace...</span>
                                    </div>
                                    <div class="btn-group" role="group" aria-label="Preview Mode Selector" style="box-shadow: 0 0 10px rgba(0,0,0,0.5);">
                                        <button type="button" class="btn btn-sm btn-outline-light active" id="btnPreviewModeCombined" style="font-size: 0.65rem; padding: 2px 8px; border-color: rgba(255,255,255,0.15);">Combined View</button>
                                        <button type="button" class="btn btn-sm btn-outline-light" id="btnPreviewModeContainer" style="font-size: 0.65rem; padding: 2px 8px; border-color: rgba(255,255,255,0.15);">Layout Style</button>
                                        <button type="button" class="btn btn-sm btn-outline-light" id="btnPreviewModeEffects" style="font-size: 0.65rem; padding: 2px 8px; border-color: rgba(255,255,255,0.15);">Effects</button>
                                    </div>
                                </div>

                                <!-- Dynamic Preview Canvas -->
                                <div class="flex-grow-1 d-flex align-items-center justify-content-center p-4 position-relative overflow-auto" style="min-height: 350px;">
                                    <div id="mockPreviewCard" class="card p-4 transition-all" style="width: 100%; max-width: 400px; border: 1px solid rgba(255,255,255,0.1); background-color: rgba(30, 41, 59, 0.7); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                                        <!-- Header mock -->
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <div class="d-flex align-items-center gap-1">
                                                <span class="rounded-circle bg-danger bg-opacity-75 d-inline-block" style="width: 8px; height: 8px;"></span>
                                                <span class="rounded-circle bg-warning bg-opacity-75 d-inline-block" style="width: 8px; height: 8px;"></span>
                                                <span class="rounded-circle bg-success bg-opacity-75 d-inline-block" style="width: 8px; height: 8px;"></span>
                                                <span class="text-muted ms-2" style="font-size: 0.65rem; font-family: monospace; letter-spacing: 0.05em;">COMP-08_MOCKUP</span>
                                            </div>
                                            <i class="bi bi-layers text-muted small"></i>
                                        </div>

                                        <!-- Title -->
                                        <h6 class="mb-1 text-white fw-bold" id="mockPreviewTitle">Visual Design Output</h6>
                                        <p class="text-muted mb-4" style="font-size: 0.65rem; font-family: sans-serif;">Live viewport for styling variables and container layout options.</p>

                                        <!-- Graph -->
                                        <div id="mockPreviewChartArea" class="py-2 transition-all" style="height: 130px; transition: background-color 0.3s ease;">
                                            <svg viewBox="0 0 400 200" class="w-100 h-100" style="overflow: visible;">
                                                <defs>
                                                    <linearGradient id="mockBlueGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stop-color="#3b82f6" />
                                                        <stop offset="100%" stop-color="#1d4ed8" />
                                                    </linearGradient>
                                                    <linearGradient id="mockCyanGrad" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stop-color="#06b6d4" />
                                                        <stop offset="100%" stop-color="#0891b2" />
                                                    </linearGradient>
                                                </defs>
                                                <!-- Grid Lines -->
                                                <g stroke="rgba(255,255,255,0.06)" stroke-width="1">
                                                    <line x1="10" y1="20" x2="390" y2="20" />
                                                    <line x1="10" y1="70" x2="390" y2="70" />
                                                    <line x1="10" y1="120" x2="390" y2="120" />
                                                    <line x1="10" y1="170" x2="390" y2="170" />
                                                </g>
                                                <!-- Bars with Hoverable style -->
                                                <g class="mock-bars">
                                                    <rect x="50" y="80" width="35" height="100" rx="6" fill="url(#mockBlueGrad)" />
                                                    <rect x="120" y="40" width="35" height="140" rx="6" fill="url(#mockCyanGrad)" />
                                                    <rect x="190" y="110" width="35" height="70" rx="6" fill="url(#mockBlueGrad)" opacity="0.85" />
                                                    <rect x="260" y="60" width="35" height="120" rx="6" fill="url(#mockCyanGrad)" opacity="0.85" />
                                                    <rect x="330" y="95" width="35" height="85" rx="6" fill="url(#mockBlueGrad)" />
                                                </g>
                                                <!-- Dynamic Sparkline on top -->
                                                <path d="M 68,100 L 138,60 L 208,120 L 278,80 L 348,110" fill="none" stroke="#f43f5e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                                <circle cx="138" cy="60" r="4.5" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
                                                <circle cx="278" cy="80" r="4.5" fill="#f43f5e" stroke="#ffffff" stroke-width="1.5" />
                                            </svg>
                                        </div>

                                        <!-- Footer details -->
                                        <div class="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-secondary border-opacity-25" style="font-size: 0.65rem;">
                                            <span class="text-muted"><i class="bi bi-clock me-1"></i> Updated in Realtime</span>
                                            <span class="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-1 px-2 rounded-pill">Adaptive Mode</span>
                                        </div>
                                    </div>
                                </div>

                                <!-- Bottom Cheat Sheet Guide -->
                                <div class="p-3 bg-black border-top border-secondary" style="font-size: 0.75rem; font-family: sans-serif; background: #0c0c0c !important;">
                                    <div class="d-flex align-items-center justify-content-between mb-2">
                                        <span class="fw-bold text-light"><i class="bi bi-info-circle text-info"></i> JSON Formatting Help:</span>
                                        <span class="text-muted" style="font-size: 0.7rem;">Validate before saving</span>
                                    </div>
                                    <div id="jsonFormatGuideText" class="text-muted small">
                                        <!-- Will load helper text based on active editor -->
                                        Loading schema helper...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="modal-footer bg-black border-top border-secondary py-3">
                    <button type="button" class="btn btn-outline-secondary px-4" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-success px-4 fw-bold" id="saveCodeBtn"><i class="bi bi-save me-1"></i> Apply & Save Code</button>
                </div>
            </div>
        </div>
    `,
  "addDataModal": `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addDataModalLabel"><i class="bi bi-plus-square"></i> नया डेटा जोड़ें</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body" id="addDataForm">
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" id="saveData"><i class="bi bi-save"></i> सहेजें</button>
                </div>
            </div>
        </div>
    `,
  "mainMenuModal": `
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="mainMenuModalLabel"></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div id="dataStatisticsContent" class="modal-content-area" style="display: none;">
                        <h5 class="mb-3"><i class="bi bi-calculator"></i> डेटा सांख्यिकी</h5>
                        <div id="statsSection">
                            <select id="statsCol" class="form-select mb-2 w-100">
                                <option value="">कॉलम चुनें</option>
                                </select>
                            <div id="statsOutput">
                                </div>
                        </div>
                    </div>

                    <div id="dashboardViewContent" class="modal-content-area" style="display: none;">
                        <h5 class="mb-3"><i class="bi bi-eye"></i> डैशबोर्ड दृश्य नियंत्रण (Dashboard View Control)</h5>
                        <div id="dashboardViewSection">
                            <!-- element toggles -->
                            <div class="card p-3 mb-3 border bg-light-subtle">
                                <h6 class="fw-bold mb-2 text-secondary"><i class="bi bi-eye-slash-fill"></i> कैनवास तत्वों को दिखाएं / छिपाएं</h6>
                                <div class="row g-2">
                                    <div class="col-md-6">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="toggleVisualizations" checked>
                                            <label class="form-check-label small" for="toggleVisualizations">चार्ट विज़ुअल्स (Charts)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="toggleDataTable" checked>
                                            <label class="form-check-label small" for="toggleDataTable">डेटा टेबल (Data Table)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="toggleChat" checked>
                                            <label class="form-check-label small" for="toggleChat">AI चैट (AI Chat)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="toggleTextboxes" checked>
                                            <label class="form-check-label small" for="toggleTextboxes">टेक्स्टबॉक्स (Textboxes)</label>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="form-check form-switch">
                                            <input class="form-check-input" type="checkbox" id="toggleMainHeader" checked>
                                            <label class="form-check-label small" for="toggleMainHeader">मुख्य हेडर (Main Header)</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- canvas themes -->
                            <div class="card p-3 mb-3 border bg-light-subtle">
                                <h6 class="fw-bold mb-2 text-secondary"><i class="bi bi-palette-fill"></i> कैनवास बैकड्रॉप थीम (Canvas Themes)</h6>
                                <div class="mb-3">
                                    <select id="canvasBackdropTheme" class="form-select form-select-sm">
                                        <option value="default" selected>डिफ़ॉल्ट लाइट (Default Light)</option>
                                        <option value="dark">चारकोल डार्क (Slate Dark)</option>
                                        <option value="sepia">सॉफ्ट विंटेज क्रीम (Vintage Sepia)</option>
                                        <option value="blue-glow">शाही नीला चमक (Midnight Sapphire Glow)</option>
                                        <option value="glassy">ग्लास विज़ुअल्स (Frosted Glass Canvas)</option>
                                    </select>
                                </div>
                            </div>

                            <!-- auto-grid arrangers -->
                            <div class="card p-3 mb-3 border bg-light-subtle">
                                <h6 class="fw-bold mb-2 text-secondary"><i class="bi bi-grid-3x3-gap-fill"></i> पावर बीआई-ग्रिड संरेखण (Power BI Auto-Grid Arrange)</h6>
                                <p class="text-muted small" style="font-size: 0.72rem;">चार्ट को स्वचालित रूप से सुव्यवस्थित ग्रिड में संरेखित करें:</p>
                                <div class="d-flex flex-wrap gap-2">
                                    <button id="btnArrange1Col" class="btn btn-sm btn-outline-primary flex-fill"><i class="bi bi-layout-sidebar"></i> 1 कॉलम</button>
                                    <button id="btnArrange2Col" class="btn btn-sm btn-outline-primary flex-fill"><i class="bi bi-layout-split"></i> 2 कॉलम</button>
                                    <button id="btnArrange3Col" class="btn btn-sm btn-outline-primary flex-fill"><i class="bi bi-grid-3x3-gap"></i> 3 कॉलम</button>
                                </div>
                            </div>

                            <!-- presentation and lock options -->
                            <div class="card p-3 mb-3 border bg-light-subtle">
                                <h6 class="fw-bold mb-2 text-secondary"><i class="bi bi-shield-lock-fill"></i> संपादन और प्रस्तुति मोड (Safety & Mode)</h6>
                                <div class="form-check mb-2">
                                    <input class="form-check-input" type="checkbox" id="toggleLockModeViewCheckbox">
                                    <label class="form-check-label small fw-bold text-danger" for="toggleLockModeViewCheckbox">
                                        <i class="bi bi-lock-fill"></i> संपादन लॉक करें (Lock Layout Editing)
                                    </label>
                                </div>
                                <button id="btnPresentationMode" class="btn btn-sm btn-success w-100 py-2"><i class="bi bi-play-circle-fill"></i> फुलस्क्रीन / प्रेजेंटेशन मोड चालू करें</button>
                            </div>

                            <div class="col-md-12 mt-4">
                                <button id="downloadFullDashboard" class="btn btn-dark w-100"><i class="bi bi-file-earmark-arrow-down"></i> पूरा डैशबोर्ड डाउनलोड करें</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
  "kpiBuilderContent": `
                    <div class="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2">
                        <h5 class="m-0 font-sans font-semibold text-primary" style="font-size: 14px;"><i class="bi bi-tag-fill me-1"></i> KPI & मिनी-चार्ट बिल्डर</h5>
                        <span class="badge bg-soft-success text-success border border-success-subtle" style="font-size: 9px;"><i class="bi bi-lightning-fill"></i> active</span>
                    </div>

                    <!-- Real-time Live Preview Container -->
                    <div class="card border mb-3 shadow-sm overflow-hidden" id="kpiLivePreviewContainer" style="border-radius: 12px; transition: all 0.3s ease; border-color: #cbd5e1 !important;">
                        <div class="card-header bg-light py-1.5 px-3 border-bottom d-flex justify-content-between align-items-center" style="background-color: #f8fafc !important;">
                            <span class="text-xs fw-bold text-slate-600 uppercase tracking-wider" style="font-size: 10px; letter-spacing: 0.5px;"><i class="bi bi-eye-fill me-1 text-primary"></i> लाइव प्रीव्यू (Live Preview Card)</span>
                            <span class="badge bg-primary bg-opacity-10 text-primary" style="font-size: 9px; font-weight: 600;">raw structure</span>
                        </div>
                        <div class="card-body p-2.5 d-flex align-items-center justify-content-center" style="min-height: 125px; background: #f8fafc; overflow: hidden;" id="kpiLivePreviewBody">
                            <div class="text-muted text-center py-4 text-xs"><i class="bi bi-arrow-repeat spin d-inline-block mb-1"></i> लोड हो रहा है...</div>
                        </div>
                    </div>

                    <!-- Tabs Nav - Icon based -->
                    <ul class="nav nav-pills nav-fill bg-light p-1 rounded-3 mb-3 text-xs" id="kpiBuilderTabs" role="tablist" style="font-size: 11px; border: 1px solid rgba(0,0,0,0.05);">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active py-1.5 px-2 text-dark font-semibold border-0 d-flex align-items-center justify-content-center gap-1.5" id="kpi-preset-tab" data-bs-toggle="tab" data-bs-target="#kpi-presets" type="button" role="tab" aria-selected="true">
                                <i class="bi bi-grid-fill" style="font-size: 13px;"></i> रेडीमेड
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link py-1.5 px-2 text-dark font-semibold border-0 d-flex align-items-center justify-content-center gap-1.5" id="kpi-custom-tab" data-bs-toggle="tab" data-bs-target="#kpi-custom" type="button" role="tab" aria-selected="false">
                                <i class="bi bi-sliders" style="font-size: 13px;"></i> कस्टम डिज़ाइन
                            </button>
                        </li>
                    </ul>

                    <!-- Tabs Content -->
                    <div class="tab-content text-start" id="kpiBuilderTabsContent">
                        <!-- Presets Tab (Compact Grid) -->
                        <div class="tab-pane fade show active" id="kpi-presets" role="tabpanel" aria-labelledby="kpi-preset-tab">
                            <div class="row g-2" style="margin-top: -4px;">
                                <!-- Template 1: Row Counter -->
                                <div class="col-6">
                                    <div class="preset-card p-2.5 border rounded-3 bg-white hover-shadow cursor-pointer transition text-center d-flex flex-column align-items-center justify-content-center h-100" data-preset-type="row-count" style="cursor: pointer; min-height: 85px;">
                                        <div class="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center mb-1.5" style="width: 32px; height: 32px;">
                                            <i class="bi bi-hash" style="font-size: 16px;"></i>
                                        </div>
                                        <span class="fw-bold text-dark text-truncate w-100" style="font-size: 11px;">रिकॉर्ड्स काउंटर</span>
                                    </div>
                                </div>

                                <!-- Template 2: Total Sum -->
                                <div class="col-6">
                                    <div class="preset-card p-2.5 border rounded-3 bg-white hover-shadow cursor-pointer transition text-center d-flex flex-column align-items-center justify-content-center h-100" data-preset-type="total-sum" style="cursor: pointer; min-height: 85px;">
                                        <div class="rounded-circle bg-warning bg-opacity-10 text-warning d-flex align-items-center justify-content-center mb-1.5" style="width: 32px; height: 32px;">
                                            <i class="bi bi-plus-slash-minus" style="font-size: 15px;"></i>
                                        </div>
                                        <span class="fw-bold text-dark text-truncate w-100" style="font-size: 11px;">कुल योग (Sum)</span>
                                    </div>
                                </div>

                                <!-- Template 3: Average Performance -->
                                <div class="col-6">
                                    <div class="preset-card p-2.5 border rounded-3 bg-white hover-shadow cursor-pointer transition text-center d-flex flex-column align-items-center justify-content-center h-100" data-preset-type="avg-perf" style="cursor: pointer; min-height: 85px;">
                                        <div class="rounded-circle bg-info bg-opacity-10 text-info d-flex align-items-center justify-content-center mb-1.5" style="width: 32px; height: 32px;">
                                            <i class="bi bi-percent" style="font-size: 14px;"></i>
                                        </div>
                                        <span class="fw-bold text-dark text-truncate w-100" style="font-size: 11px;">औसत (Average)</span>
                                    </div>
                                </div>

                                <!-- Template 4: Peak Value -->
                                <div class="col-6">
                                    <div class="preset-card p-2.5 border rounded-3 bg-white hover-shadow cursor-pointer transition text-center d-flex flex-column align-items-center justify-content-center h-100" data-preset-type="peak-val" style="cursor: pointer; min-height: 85px;">
                                        <div class="rounded-circle bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center mb-1.5" style="width: 32px; height: 32px;">
                                            <i class="bi bi-graph-up-arrow" style="font-size: 13px;"></i>
                                        </div>
                                        <span class="fw-bold text-dark text-truncate w-100" style="font-size: 11px;">अधिकतम मान</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Custom Builder Tab -->
                        <div class="tab-pane fade" id="kpi-custom" role="tabpanel" aria-labelledby="kpi-custom-tab">
                            <div class="d-flex flex-column gap-2.5">
                                <!-- KPI Title -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-type-h1 me-1 text-primary"></i> KPI नाम (Title)</label>
                                    <input type="text" id="kpiTitleInput" class="form-control form-control-sm text-xs" placeholder="उदा: कुल बिक्री">
                                </div>

                                <!-- Metric Column selection -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-layout-three-columns me-1 text-success"></i> डेटा कॉलम (Metric Column)</label>
                                    <select id="kpiMetricColumn" class="form-select form-select-sm text-xs">
                                        <option value="">-- पंक्ति गणना (Count Rows) --</option>
                                    </select>
                                </div>
                                    <div class="d-flex flex-wrap gap-1 bg-light dark:bg-slate-800/60 p-1 rounded-2 border border-slate-200/55 dark:border-slate-700" id="kpiSparklineTypeButtons">
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="line" title="चिकनी रेखा (Smooth Line)">
                                            <i class="bi bi-graph-up" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="area" title="छायांकित एरिया (Area Wave)">
                                            <i class="bi bi-activity" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="bar" title="मिनी बार चार्ट (Bar micro)">
                                            <i class="bi bi-bar-chart-steps" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="pie" title="पाई चार्ट (Pie Chart)">
                                            <i class="bi bi-pie-chart" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="doughnut" title="डोनट चार्ट (Doughnut)">
                                            <i class="bi bi-record-circle" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="polarArea" title="ध्रुवीय क्षेत्र (Polar Area)">
                                            <i class="bi bi-circle-half" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary py-1 px-2.5 d-flex align-items-center justify-content-center" data-value="radar" title="रडार चार्ट (Radar)">
                                            <i class="bi bi-bullseye" style="font-size: 11px;"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Sparkline Size and Position controls -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-arrows-fullscreen me-1 text-warning"></i> मिनी-चार्ट साइज़ और स्थिति (Size & Position)</label>
                                    
                                    <!-- Position options -->
                                    <div class="mb-2">
                                        <span class="text-xxs text-secondary d-block mb-1">चार्ट की स्थिति (Position)</span>
                                        <select id="kpiSparklinePosition" class="form-select form-select-sm text-xs d-none">
                                            <option value="right">दाहिने (Right Side)</option>
                                            <option value="left">बायें (Left Side)</option>
                                            <option value="bottom">नीचे पूरा चौड़ा (Bottom Full Width)</option>
                                            <option value="background">बैकग्राउंड Watermark (Background)</option>
                                        </select>
                                        <div class="d-flex gap-1 bg-light dark:bg-slate-800/60 p-1 rounded-2 border border-slate-200/55 dark:border-slate-700" id="kpiSparklinePositionButtons">
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="right" title="दाहिने (Right Layout)">
                                                <i class="bi bi-layout-sidebar-reverse" style="font-size: 11px;"></i>
                                            </button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="left" title="बायें (Left Layout)">
                                                <i class="bi bi-layout-sidebar" style="font-size: 11px;"></i>
                                            </button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="bottom" title="नीचे (Bottom Layout)">
                                                <i class="bi bi-layout-split" style="font-size: 11px;"></i>
                                            </button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="background" title="बैकग्राउंड वाटरमार्क (Background Layout)">
                                                <i class="bi bi-stack" style="font-size: 11px;"></i>
                                            </button>
                                        </div>
                                    </div>

                                    <!-- Sliders for width & height -->
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <span class="text-xxs text-secondary d-block mb-1">चौड़ाई: <span id="kpiSparklineWidthVal" class="fw-bold text-dark">110px</span></span>
                                            <input type="range" class="form-range" id="kpiSparklineWidth" min="40" max="200" step="5" value="110" style="height: 14px;">
                                        </div>
                                        <div class="col-6">
                                            <span class="text-xxs text-secondary d-block mb-1">ऊंचाई: <span id="kpiSparklineHeightVal" class="fw-bold text-dark">35px</span></span>
                                            <input type="range" class="form-range" id="kpiSparklineHeight" min="15" max="80" step="1" value="35" style="height: 14px;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Card Design template selection -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-palette me-1 text-secondary"></i> कार्ड शैली (Card Style)</label>
                                    <select id="kpiCardStyle" class="form-select form-select-sm text-xs d-none">
                                        <option value="minimal">क्लासिक बॉर्डर (Minimal)</option>
                                        <option value="glass">ग्लास-इफ़ेक्ट (Glassmorphic)</option>
                                        <option value="accent">थीम बॉर्डर (Accent Highlight)</option>
                                        <option value="dark-neon">डार्क नियॉन (Dark Neon)</option>
                                    </select>
                                    <div class="d-flex gap-1 bg-light dark:bg-slate-800/60 p-1 rounded-2 border border-slate-200/55 dark:border-slate-700" id="kpiCardStyleButtons">
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="minimal" title="क्लासिक बॉर्डर (Minimal Border)">
                                            <i class="bi bi-square" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="glass" title="ग्लास-इफ़ेक्ट (Glassmorphic)">
                                            <i class="bi bi-transparency" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="accent" title="थीम बॉर्डर (Accent Highlight)">
                                            <i class="bi bi-brush" style="font-size: 11px;"></i>
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 py-1 px-1.5 d-flex align-items-center justify-content-center" data-value="dark-neon" title="डार्क नियॉन (Dark Neon)">
                                            <i class="bi bi-moon-stars" style="font-size: 11px;"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- KPI Container Theme Selection -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-droplet-half me-1 text-primary"></i> कंटेनर बैकग्राउंड थीम (KPI Theme)</label>
                                    <select id="kpiContainerTheme" class="form-select form-select-sm text-xs d-none">
                                        <option value="light">क्लासिक लाइट (Classic Light)</option>
                                        <option value="dark-slate">डार्क स्लेट (Dark Slate)</option>
                                        <option value="royal-blue">शाही नीला (Royal Blue)</option>
                                        <option value="emerald">पन्ना हरा (Emerald Green)</option>
                                        <option value="sunset">सूर्यास्त नारंगी (Sunset Orange)</option>
                                        <option value="purple-haze">बैंगनी लहर (Purple Violet)</option>
                                        <option value="glass-cyber">साइबर ग्लास (Cyber Glass)</option>
                                        <option value="custom-solid">कस्टम सॉलिड (Custom Color)</option>
                                    </select>
                                    <div class="d-flex flex-wrap gap-1.5 bg-light dark:bg-slate-800/60 p-1.5 rounded-2 border border-slate-200/55 dark:border-slate-700" id="kpiContainerThemeButtons">
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="light" title="क्लासिक लाइट (Classic Light)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #f8fafc; color: #0f172a; border: 1px solid #cbd5e1; transition: all 0.2s;">
                                            <i class="bi bi-brightness-high-fill"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="dark-slate" title="डार्क स्लेट (Dark Slate)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #1e293b; color: #ffffff; border: 1px solid #475569; transition: all 0.2s;">
                                            <i class="bi bi-moon-fill"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="royal-blue" title="शाही नीला (Royal Blue)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #1e3a8a; color: #ffffff; border: 1px solid #3b82f6; transition: all 0.2s;">
                                            <i class="bi bi-water"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="emerald" title="पन्ना हरा (Emerald Green)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #064e3b; color: #ffffff; border: 1px solid #10b981; transition: all 0.2s;">
                                            <i class="bi bi-gem"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="sunset" title="सूर्यास्त नारंगी (Sunset Orange)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #7c2d12; color: #ffffff; border: 1px solid #f97316; transition: all 0.2s;">
                                            <i class="bi bi-sun-fill"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="purple-haze" title="बैंगनी लहर (Purple Violet)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #4c1d95; color: #ffffff; border: 1px solid #8b5cf6; transition: all 0.2s;">
                                            <i class="bi bi-cloud-haze-fill"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="glass-cyber" title="साइबर ग्लास (Cyber Glass)" style="width: 28px; height: 28px; border-radius: 6px; background-color: #0f172a; color: #ffffff; border: 1px solid #c084fc; transition: all 0.2s;">
                                            <i class="bi bi-cpu-fill"></i>
                                        </button>
                                        <button class="btn btn-xs d-flex align-items-center justify-content-center" data-value="custom-solid" title="कस्टम रंग (Custom Color)" style="width: 28px; height: 28px; border-radius: 6px; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: #ffffff; border: 1px solid #f472b6; transition: all 0.2s;">
                                            <i class="bi bi-palette-fill"></i>
                                        </button>
                                    </div>
                                </div>

                                <!-- Brand Accent Color -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-paint-bucket me-1 text-danger"></i> ब्रांड रंग (Accent Color)</label>ghnut)</option>
                                        <option value="polarArea">ध्रुवीय क्षेत्र (Polar Area)</option>
                                        <option value="radar">रडार चार्ट (Radar)</option>
                                    </select>
                                    <div class="d-flex flex-wrap gap-1 bg-light p-1 rounded-2" id="kpiSparklineTypeButtons">
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="line" style="font-size: 10px;">
                                            <i class="bi bi-graph-up" style="font-size: 11px;"></i> रेखा
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="area" style="font-size: 10px;">
                                            <i class="bi bi-activity" style="font-size: 11px;"></i> एरिया
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="bar" style="font-size: 10px;">
                                            <i class="bi bi-bar-chart-steps" style="font-size: 11px;"></i> बार्स
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="pie" style="font-size: 10px;">
                                            <i class="bi bi-pie-chart" style="font-size: 11px;"></i> पाई
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="doughnut" style="font-size: 10px;">
                                            <i class="bi bi-record-circle" style="font-size: 11px;"></i> डोनट
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="polarArea" style="font-size: 10px;">
                                            <i class="bi bi-circle-half" style="font-size: 11px;"></i> पोलर
                                        </button>
                                        <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1.5 d-flex align-items-center justify-content-center gap-1" data-value="radar" style="font-size: 10px;">
                                            <i class="bi bi-bullseye" style="font-size: 11px;"></i> रडार
                                        </button>
                                    </div>
                                </div>

                                <!-- Sparkline Size and Position controls -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-arrows-fullscreen me-1 text-warning"></i> मिनी-चार्ट साइज़ और स्थिति (Size & Position)</label>
                                    
                                    <!-- Position options -->
                                    <div class="mb-2">
                                        <span class="text-xxs text-secondary d-block mb-1">चार्ट की स्थिति (Position)</span>
                                        <select id="kpiSparklinePosition" class="form-select form-select-sm text-xs d-none">
                                            <option value="right">दाहिने (Right Side)</option>
                                            <option value="left">बायें (Left Side)</option>
                                            <option value="bottom">नीचे पूरा चौड़ा (Bottom Full Width)</option>
                                            <option value="background">बैकग्राउंड वाटरमार्क (Background)</option>
                                        </select>
                                        <div class="d-flex flex-wrap gap-1 bg-light p-1 rounded-2" id="kpiSparklinePositionButtons">
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1" data-value="right" style="font-size: 10px;">दाहिने</button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1" data-value="left" style="font-size: 10px;">बायें</button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1" data-value="bottom" style="font-size: 10px;">नीचे</button>
                                            <button class="btn btn-xs btn-outline-secondary flex-grow-1 text-xxs py-1 px-1" data-value="background" style="font-size: 10px;">बैकग्राउंड</button>
                                        </div>
                                    </div>

                                    <!-- Sliders for width & height -->
                                    <div class="row g-2">
                                        <div class="col-6">
                                            <span class="text-xxs text-secondary d-block mb-1">चौड़ाई: <span id="kpiSparklineWidthVal" class="fw-bold text-dark">110px</span></span>
                                            <input type="range" class="form-range" id="kpiSparklineWidth" min="40" max="200" step="5" value="110" style="height: 14px;">
                                        </div>
                                        <div class="col-6">
                                            <span class="text-xxs text-secondary d-block mb-1">ऊंचाई: <span id="kpiSparklineHeightVal" class="fw-bold text-dark">35px</span></span>
                                            <input type="range" class="form-range" id="kpiSparklineHeight" min="15" max="80" step="1" value="35" style="height: 14px;">
                                        </div>
                                    </div>
                                </div>

                                <!-- Card Design template selection -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-palette me-1 text-secondary"></i> कार्ड थीम (Theme Card Style)</label>
                                    <select id="kpiCardStyle" class="form-select form-select-sm text-xs d-none">
                                        <option value="minimal">क्लासिक बॉर्डर (Minimal)</option>
                                        <option value="glass">ग्लास-इफ़ेक्ट (Glassmorphic)</option>
                                        <option value="accent">थीम बॉर्डर (Accent Highlight)</option>
                                        <option value="dark-neon">डार्क नियॉन (Dark Neon)</option>
                                    </select>
                                    <div class="row g-1 bg-light p-1 rounded-2" id="kpiCardStyleButtons" style="margin: 0;">
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1 d-flex align-items-center justify-content-center gap-1" data-value="minimal" style="font-size: 10px;">
                                                <i class="bi bi-square" style="font-size: 10px;"></i> क्लासिक
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1 d-flex align-items-center justify-content-center gap-1" data-value="glass" style="font-size: 10px;">
                                                <i class="bi bi-transparency" style="font-size: 10px;"></i> ग्लास
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1 d-flex align-items-center justify-content-center gap-1" data-value="accent" style="font-size: 10px;">
                                                <i class="bi bi-brush" style="font-size: 10px;"></i> हाइलाइट
                                            </button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1 d-flex align-items-center justify-content-center gap-1" data-value="dark-neon" style="font-size: 10px;">
                                                <i class="bi bi-moon-stars" style="font-size: 10px;"></i> नियॉन
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <!-- KPI Container Theme Selection -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-droplet-half me-1 text-primary"></i> कंटेनर बैकग्राउंड थीम (KPI Theme)</label>
                                    <select id="kpiContainerTheme" class="form-select form-select-sm text-xs d-none">
                                        <option value="light">क्लासिक लाइट (Classic Light)</option>
                                        <option value="dark-slate">डार्क स्लेट (Dark Slate)</option>
                                        <option value="royal-blue">शाही नीला (Royal Blue)</option>
                                        <option value="emerald">पन्ना हरा (Emerald Green)</option>
                                        <option value="sunset">सूर्यास्त नारंगी (Sunset Orange)</option>
                                        <option value="purple-haze">बैंगनी लहर (Purple Violet)</option>
                                        <option value="glass-cyber">साइबर ग्लास (Cyber Glass)</option>
                                        <option value="custom-solid">कस्टम सॉलिड (Custom Color)</option>
                                    </select>
                                    <div class="row g-1 bg-light p-1 rounded-2" id="kpiContainerThemeButtons" style="margin: 0;">
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="light" style="font-size: 10px;">लाइट</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="dark-slate" style="font-size: 10px;">डार्क स्लेट</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="royal-blue" style="font-size: 10px;">शाही नीला</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="emerald" style="font-size: 10px;">पन्ना हरा</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="sunset" style="font-size: 10px;">सूर्यास्त</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="purple-haze" style="font-size: 10px;">बैंगनी लहर</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="glass-cyber" style="font-size: 10px;">ग्लास साइबर</button>
                                        </div>
                                        <div class="col-6">
                                            <button class="btn btn-xs btn-outline-secondary w-100 text-xxs py-1 px-1" data-value="custom-solid" style="font-size: 10px;">कस्टम सॉलिड</button>
                                        </div>
                                    </div>
                                </div>

                                <!-- Brand Accent Color -->
                                <div>
                                    <label class="form-label text-xs font-semibold text-muted mb-1"><i class="bi bi-paint-bucket me-1 text-danger"></i> ब्रांड रंग (Accent Color)</label>
                                    <div class="d-flex align-items-center gap-2">
                                        <input type="color" id="kpiColorPicker" class="form-control form-control-color" style="width: 35px; height: 30px; border-radius: 6px; cursor: pointer; padding: 0; border: none;" value="#8b5cf6">
                                        <div class="d-flex flex-wrap gap-1" id="kpiPaletteColors">
                                            <span class="color-dot cursor-pointer border" style="background-color: #8b5cf6; width: 16px; height: 16px; display: inline-block; border-radius: 50%;" data-color="#8b5cf6"></span>
                                            <span class="color-dot cursor-pointer border" style="background-color: #3b82f6; width: 16px; height: 16px; display: inline-block; border-radius: 50%;" data-color="#3b82f6"></span>
                                            <span class="color-dot cursor-pointer border" style="background-color: #10b981; width: 16px; height: 16px; display: inline-block; border-radius: 50%;" data-color="#10b981"></span>
                                            <span class="color-dot cursor-pointer border" style="background-color: #f59e0b; width: 16px; height: 16px; display: inline-block; border-radius: 50%;" data-color="#f59e0b"></span>
                                            <span class="color-dot cursor-pointer border" style="background-color: #ef4444; width: 16px; height: 16px; display: inline-block; border-radius: 50%;" data-color="#ef4444"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Add KPI Action Button -->
                    <div class="border-top pt-2 mt-3">
                        <button id="btnAddKpiCard" class="btn btn-primary w-100 py-1.5 fw-semibold text-xs transition" style="border-radius: 6px;">
                            <i class="bi bi-plus-circle me-1.5"></i> KPI कार्ड जोड़ें (Add)
                        </button>
                        <button id="btnCancelKpiEdit" class="btn btn-sm btn-outline-secondary w-100 mt-2 text-xs py-1" style="display: none; border-radius: 6px;">
                            रद्द करें (Cancel)
                        </button>
                    </div>
    `,
  "chartAnnotationModal": `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content shadow-lg border-0" style="border-radius: 12px;">
                <div class="modal-header bg-light border-bottom-0 pb-1" style="border-radius: 12px 12px 0 0;">
                    <h6 class="modal-title font-sans font-bold text-dark d-flex align-items-center gap-2"><i class="bi bi-pin-angle-fill text-danger"></i> चार्ट एनोटेशन जोड़ें / टिप्पणी लिखें</h6>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="font-size: 10px;"></button>
                </div>
                <div class="modal-body py-3">
                    <div id="annotationPointDetails" class="p-2.5 mb-3 bg-light rounded text-xs text-secondary border"></div>
                    <div class="mb-1">
                        <label for="annotationNoteInput" class="form-label text-xs font-semibold mb-1">टिप्पणी या चेतावनी संदेश:</label>
                        <textarea class="form-control text-xs" id="annotationNoteInput" rows="3" placeholder="उदा: यहाँ बिक्री सबसे अधिक रही क्योंकि दिवाली सेल का विशेष विज्ञापन अभियान सक्रिय था।"></textarea>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-1">
                    <button type="button" class="btn btn-secondary btn-sm text-xs" data-bs-dismiss="modal">रद्द करें</button>
                    <button type="button" class="btn btn-primary btn-sm text-xs" id="saveAnnotationBtn"><i class="bi bi-check-circle-fill"></i> नोट सहेजें</button>
                </div>
            </div>
        </div>
    `,
  "dashboardThemeContent": `
                    <h5 class="mb-3 text-primary fw-bold" style="font-family: var(--font-display);"><i class="bi bi-palette2"></i> डैशबोर्ड थीम (Dashboard Theme)</h5>
                    
                    <!-- Explanation card -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; background: #ffffff; border: 1px solid #e2e8f0;">
                        <div class="card-body p-3">
                            <p class="text-muted small mb-0" style="font-size: 0.75rem;">यहाँ से आप अपने डैशबोर्ड के मुख्य रंगों, चार्ट्स कलर पैलेट और ब्रांड पहचान को कस्टमाइज़ कर सकते हैं।</p>
                        </div>
                    </div>

                    <!-- 1. Brand Accent Color Selection -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-800 fw-bold mb-2 small" style="font-family: var(--font-display);"><i class="bi bi-palette-fill text-warning"></i> ब्रांड कलर थीम (Accent Theme)</h6>
                            <p class="text-muted small" style="font-size: 0.72rem; margin-bottom: 0.75rem;">सक्रिय थीम के मुख्य रंगों को नियंत्रित करें:</p>
                            <div class="d-flex gap-2 justify-content-between mt-2 mb-1">
                                <button class="btn btn-accent-theme p-0 rounded-circle bg-primary" data-theme-accent="primary" style="width: 32px; height: 32px; border: 2px solid transparent;" title="Ocean Blue"></button>
                                <button class="btn btn-accent-theme p-0 rounded-circle bg-success" data-theme-accent="success" style="width: 32px; height: 32px; border: 2px solid transparent;" title="Emerald Green"></button>
                                <button class="btn btn-accent-theme p-0 rounded-circle bg-danger" data-theme-accent="danger" style="width: 32px; height: 32px; border: 2px solid transparent;" title="Sunset Red"></button>
                                <button class="btn btn-accent-theme p-0 rounded-circle bg-warning" data-theme-accent="warning" style="width: 32px; height: 32px; border: 2px solid transparent;" title="Golden Amber"></button>
                                <button class="btn btn-accent-theme p-0 rounded-circle bg-dark" data-theme-accent="dark" style="width: 32px; height: 32px; border: 2px solid transparent;" title="Mystic Slate"></button>
                            </div>
                        </div>
                    </div>

                    <!-- 2. Custom Brand Theme Generator -->
                    <div class="card border-0 mb-3 p-3 shadow-sm text-start" id="custom-theme-creator-box" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <h6 class="fw-bold mb-2 text-slate-700" style="font-size: 0.8rem; font-family: var(--font-display);">
                            <i class="bi bi-palette2 text-primary"></i> कस्टम ब्रांड थीम जनरेटर
                        </h6>
                        <p class="text-muted small mb-2.5" style="font-size: 0.72rem;">अपनी कंपनी का मुख्य ब्रांड कलर चुनें। सिस्टम तुरंत एक सममित 5-रंग पैलेट बनाकर चार्ट्स और पूरे यूआई को री-ब्रांड कर देगा।</p>
                        
                        <div class="row g-2 align-items-center mb-3">
                            <div class="col-4">
                                <label class="small text-slate-600 fw-medium" style="font-size: 0.72rem;">कलर चुनें:</label>
                                <input type="color" id="custom-theme-picker" class="form-control form-control-color w-100" style="height: 38px; border-radius: 8px; padding: 4px;" value="#8b5cf6">
                            </div>
                            <div class="col-8">
                                <label class="small text-slate-600 fw-medium d-block" style="font-size: 0.72rem;">जनरेटेड थीम पैलेट:</label>
                                <div id="palette-colors-preview" class="d-flex gap-1 py-1 mt-1">
                                    <!-- generated palette items will go here -->
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <label class="small text-slate-600 fw-medium d-block mb-1.5" style="font-size: 0.72rem;">रेडीमेड ब्रांड पैलेट्स (Presets):</label>
                            <div class="d-flex flex-wrap gap-1.5">
                                <button class="btn btn-xs btn-outline-secondary brand-preset-btn" data-preset="#f59e0b" style="font-size: 10px; padding: 3px 8px; border-radius: 6px;">Amber Gold</button>
                                <button class="btn btn-xs btn-outline-secondary brand-preset-btn" data-preset="#0ea5e9" style="font-size: 10px; padding: 3px 8px; border-radius: 6px;">Ocean Blue</button>
                                <button class="btn btn-xs btn-outline-secondary brand-preset-btn" data-preset="#10b981" style="font-size: 10px; padding: 3px 8px; border-radius: 6px;">Emerald Forest</button>
                                <button class="btn btn-xs btn-outline-secondary brand-preset-btn" data-preset="#8b5cf6" style="font-size: 10px; padding: 3px 8px; border-radius: 6px;">Cosmic Violet</button>
                                <button class="btn btn-xs btn-outline-secondary brand-preset-btn" data-preset="#ec4899" style="font-size: 10px; padding: 3px 8px; border-radius: 6px;">Rose Garden</button>
                            </div>
                        </div>

                        <div class="d-flex gap-2">
                            <button id="btn-apply-custom-theme" class="btn btn-primary btn-sm flex-fill py-2 fw-bold" style="border-radius: 8px; font-size: 0.8rem;">
                                <i class="bi bi-magic me-1.5"></i> थीम लागू करें
                            </button>
                            <button id="btn-reset-custom-theme" class="btn btn-outline-danger btn-sm py-2 px-2.5 fw-bold" style="border-radius: 8px; font-size: 0.8rem;" title="मूल थीम पर रीसेट करें">
                                <i class="bi bi-arrow-counterclockwise me-1"></i> रीसेट
                            </button>
                        </div>
                    </div>

                    <!-- 2.1 display Mode (Dark/Light Switcher) -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-800 fw-bold mb-2 small" style="font-family: var(--font-display);"><i class="bi bi-brightness-high-fill text-warning"></i> डिस्प्ले मोड (Display Mode)</h6>
                            <p class="text-muted small" style="font-size: 0.72rem; margin-bottom: 0.75rem;">डैशबोर्ड थीम स्विच करें:</p>
                            <div class="btn-group w-100" role="group">
                                <button class="btn btn-light border py-1.5 px-3" id="btn-theme-mode-light" title="लाइट मोड (Light Mode)">
                                    <i class="bi bi-sun-fill text-warning" style="font-size: 1.1rem;"></i> <span class="ms-1" style="font-size: 0.75rem;">लाइट</span>
                                </button>
                                <button class="btn btn-light border py-1.5 px-3" id="btn-theme-mode-dark" title="डार्क मोड (Dark Mode)">
                                    <i class="bi bi-moon-stars-fill text-primary" style="font-size: 1.1rem;"></i> <span class="ms-1" style="font-size: 0.75rem;">डार्क</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 2.2 Typography Selector -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff; position: relative; z-index: 1000;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-800 fw-bold mb-2 small" style="font-family: var(--font-display);"><i class="bi bi-fonts text-info"></i> फॉन्ट स्टाइल (Typography)</h6>
                            <p class="text-muted small" style="font-size: 0.72rem; margin-bottom: 0.75rem;">डैशबोर्ड फॉन्ट चुनें:</p>
                            <select class="form-select text-xs py-2 fw-medium" id="theme-font-family-selector" style="border-radius: 8px; font-size: 0.78rem; position: relative; z-index: 10000; cursor: pointer;">
                                <option value="inter">Inter (Balanced & Clean)</option>
                                <option value="space-grotesk">Space Grotesk (Tech Style)</option>
                                <option value="jetbrains-mono">JetBrains Mono (Developer Coding)</option>
                                <option value="playfair-display">Playfair Display (Elegant Serif)</option>
                            </select>
                        </div>
                    </div>

                    <!-- 2.3 Border Radius & Shadows -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-800 fw-bold mb-2 small" style="font-family: var(--font-display);"><i class="bi bi-bounding-box-circles text-success"></i> लेआउट और छाया (Layout Style)</h6>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <label class="small text-slate-600 fw-medium" style="font-size: 0.72rem;">बॉर्डर रेडियस: <span id="label-border-radius-val" class="fw-bold text-primary">12px</span></label>
                                </div>
                                <input type="range" class="form-range" id="slider-theme-border-radius" min="0" max="30" step="2" value="12" style="height: 6px;">
                            </div>
                            
                            <div>
                                <label class="small text-slate-600 fw-medium d-block mb-1.5" style="font-size: 0.72rem;">छाया प्रभाव (Shadow):</label>
                                <div class="btn-group w-100" role="group">
                                    <button class="btn btn-light border btn-sm shadow-btn d-flex align-items-center justify-content-center gap-1 py-2" data-shadow="none" title="कोई छाया नहीं">
                                        <i class="bi bi-square" style="font-size: 0.9rem;"></i> <span style="font-size: 0.72rem;">None</span>
                                    </button>
                                    <button class="btn btn-light border btn-sm shadow-btn d-flex align-items-center justify-content-center gap-1 py-2" data-shadow="soft" title="हल्की छाया">
                                        <i class="bi bi-square-half" style="font-size: 0.9rem;"></i> <span style="font-size: 0.72rem;">Soft</span>
                                    </button>
                                    <button class="btn btn-light border btn-sm shadow-btn d-flex align-items-center justify-content-center gap-1 py-2" data-shadow="deep" title="गहरी छाया">
                                        <i class="bi bi-square-fill" style="font-size: 0.9rem;"></i> <span style="font-size: 0.72rem;">Deep</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 3. Premium Ready-made Templates -->
                    <div class="card border-0 mb-3 shadow-sm text-start" style="border-radius: 12px; border: 1px solid #e2e8f0; background: #ffffff;">
                        <div class="card-body p-3">
                            <h6 class="card-title text-slate-800 fw-bold mb-2 small" style="font-family: var(--font-display);"><i class="bi bi-stars text-primary"></i> रेडीमेड थीम टेम्पलेट्स (Ready-made Templates)</h6>
                            <p class="text-muted small" style="font-size: 0.72rem; margin-bottom: 0.75rem;">एक क्लिक में पूरा डैशबोर्ड और यूआई लुक बदलें:</p>
                            
                            <div class="d-flex flex-column gap-2" id="ready-made-templates-container">
                                <!-- 1. Royal Sapphire -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#2563eb" data-template-palette='["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#1e40af"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #2563eb;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">शाही नीलम (Royal Sapphire)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #2563eb;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #3b82f6;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #60a5fa;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #93c5fd;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #1e40af;"></span>
                                    </div>
                                </button>
                                
                                <!-- 2. Emerald Forest -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#059669" data-template-palette='["#059669", "#10b981", "#34d399", "#6ee7b7", "#065f46"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #059669;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">वन्य पन्ना (Emerald Forest)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #059669;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #10b981;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #34d399;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #6ee7b7;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #065f46;"></span>
                                    </div>
                                </button>

                                <!-- 3. Crimson Rose -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#e11d48" data-template-palette='["#e11d48", "#f43f5e", "#fb7185", "#fda4af", "#9f1239"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #e11d48;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">सिंदूरी गुलाब (Crimson Rose)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #e11d48;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #f43f5e;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #fb7185;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #fda4af;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #9f1239;"></span>
                                    </div>
                                </button>

                                <!-- 4. Sunset Amber -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#d97706" data-template-palette='["#d97706", "#f59e0b", "#fbbf24", "#fcd34d", "#78350f"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #d97706;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">सूर्यास्त एम्बर (Sunset Amber)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #d97706;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #f59e0b;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #fbbf24;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #fcd34d;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #78350f;"></span>
                                    </div>
                                </button>

                                <!-- 5. Cosmic Violet -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#7c3aed" data-template-palette='["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#4c1d95"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #7c3aed;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">ब्रह्मांडीय बैंगनी (Cosmic Violet)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #7c3aed;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #8b5cf6;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #a78bfa;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #c4b5fd;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #4c1d95;"></span>
                                    </div>
                                </button>

                                <!-- 6. Carbon Midnight -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#4b5563" data-template-palette='["#4b5563", "#6b7280", "#9ca3af", "#d1d5db", "#1f2937"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #4b5563;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">आधी रात का कोयला (Carbon Midnight)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #4b5563;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #6b7280;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #9ca3af;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #d1d5db;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #1f2937;"></span>
                                    </div>
                                </button>

                                <!-- 7. Ocean Teal -->
                                <button class="btn btn-light border p-2 text-start d-flex justify-content-between align-items-center w-100 template-preset-row-btn" data-template-primary="#0d9488" data-template-palette='["#0d9488", "#14b8a6", "#2dd4bf", "#5eead4", "#115e59"]' style="border-radius: 10px; transition: all 0.2s;">
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="rounded-circle" style="width: 14px; height: 14px; background-color: #0d9488;"></div>
                                        <span class="fw-semibold text-slate-700" style="font-size: 0.75rem;">समुद्री चैती (Ocean Teal)</span>
                                    </div>
                                    <div class="d-flex gap-0.5">
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #0d9488;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #14b8a6;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #2dd4bf;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #5eead4;"></span>
                                        <span class="rounded-circle" style="width: 8px; height: 8px; background-color: #115e59;"></span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
  `,
};
