// Text Comparison Tool JavaScript

function compareTexts() {
    const oldText = document.getElementById('oldText').value;
    const newText = document.getElementById('newText').value;
    
    if (!oldText && !newText) {
        alert('Please enter text in both fields to compare.');
        return;
    }
    
    const oldLines = oldText.split('\n');
    const newLines = newText.split('\n');
    
    const diff = computeDiff(oldLines, newLines);
    displayComparison(diff);
    
    document.getElementById('comparisonResult').style.display = 'block';
}

function computeDiff(oldLines, newLines) {
    const result = [];
    let oldIndex = 0;
    let newIndex = 0;
    
    while (oldIndex < oldLines.length || newIndex < newLines.length) {
        if (oldIndex >= oldLines.length) {
            // Remaining lines are additions
            result.push({ type: 'added', newLine: newLines[newIndex], newLineNum: newIndex + 1 });
            newIndex++;
        } else if (newIndex >= newLines.length) {
            // Remaining lines are deletions
            result.push({ type: 'removed', oldLine: oldLines[oldIndex], oldLineNum: oldIndex + 1 });
            oldIndex++;
        } else if (oldLines[oldIndex] === newLines[newIndex]) {
            // Lines are the same
            result.push({ 
                type: 'unchanged', 
                oldLine: oldLines[oldIndex], 
                newLine: newLines[newIndex],
                oldLineNum: oldIndex + 1,
                newLineNum: newIndex + 1
            });
            oldIndex++;
            newIndex++;
        } else {
            // Lines are different - check if it's a modification or insertion/deletion
            let foundMatch = false;
            
            // Look ahead to see if old line appears later in new text
            for (let i = newIndex + 1; i < Math.min(newIndex + 5, newLines.length); i++) {
                if (oldLines[oldIndex] === newLines[i]) {
                    // Old line found later, so lines before it are additions
                    while (newIndex < i) {
                        result.push({ type: 'added', newLine: newLines[newIndex], newLineNum: newIndex + 1 });
                        newIndex++;
                    }
                    foundMatch = true;
                    break;
                }
            }
            
            if (!foundMatch) {
                // Look ahead to see if new line appears later in old text
                for (let i = oldIndex + 1; i < Math.min(oldIndex + 5, oldLines.length); i++) {
                    if (newLines[newIndex] === oldLines[i]) {
                        // New line found later, so lines before it are deletions
                        while (oldIndex < i) {
                            result.push({ type: 'removed', oldLine: oldLines[oldIndex], oldLineNum: oldIndex + 1 });
                            oldIndex++;
                        }
                        foundMatch = true;
                        break;
                    }
                }
            }
            
            if (!foundMatch) {
                // Lines are different - treat as modification
                result.push({ 
                    type: 'modified', 
                    oldLine: oldLines[oldIndex], 
                    newLine: newLines[newIndex],
                    oldLineNum: oldIndex + 1,
                    newLineNum: newIndex + 1
                });
                oldIndex++;
                newIndex++;
            }
        }
    }
    
    return result;
}

function displayComparison(diff) {
    const newFileDiv = document.getElementById('newFileComparison');
    const oldFileDiv = document.getElementById('oldFileComparison');
    
    newFileDiv.innerHTML = '';
    oldFileDiv.innerHTML = '';
    
    diff.forEach(item => {
        switch (item.type) {
            case 'added':
                newFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.newLineNum}</span><span class="added">${escapeHtml(item.newLine)}</span></div>`;
                oldFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">-</span><span class="unchanged"></span></div>`;
                break;
            case 'removed':
                newFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">-</span><span class="unchanged"></span></div>`;
                oldFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.oldLineNum}</span><span class="removed">${escapeHtml(item.oldLine)}</span></div>`;
                break;
            case 'unchanged':
                newFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.newLineNum}</span><span class="unchanged">${escapeHtml(item.newLine)}</span></div>`;
                oldFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.oldLineNum}</span><span class="unchanged">${escapeHtml(item.oldLine)}</span></div>`;
                break;
            case 'modified':
                newFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.newLineNum}</span><span class="added">${escapeHtml(item.newLine)}</span></div>`;
                oldFileDiv.innerHTML += `<div class="diff-line"><span class="line-number">${item.oldLineNum}</span><span class="removed">${escapeHtml(item.oldLine)}</span></div>`;
                break;
        }
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function clearAll() {
    document.getElementById('oldText').value = '';
    document.getElementById('newText').value = '';
    document.getElementById('comparisonResult').style.display = 'none';
}

// JSON Converter Functions
function formatJson() {
    const input = document.getElementById('inputJson').value.trim();
    const output = document.getElementById('outputJson');
    const status = document.getElementById('jsonStatus');
    
    if (!input) {
        showStatus('Please enter JSON to format.', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, 2);
        showStatus('JSON formatted successfully!', 'success');
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'danger');
        output.value = '';
    }
}

function minifyJson() {
    const input = document.getElementById('inputJson').value.trim();
    const output = document.getElementById('outputJson');
    const status = document.getElementById('jsonStatus');
    
    if (!input) {
        showStatus('Please enter JSON to minify.', 'warning');
        return;
    }
    
    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
        showStatus('JSON minified successfully!', 'success');
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'danger');
        output.value = '';
    }
}

function validateJson() {
    const input = document.getElementById('inputJson').value.trim();
    const status = document.getElementById('jsonStatus');
    
    if (!input) {
        showStatus('Please enter JSON to validate.', 'warning');
        return;
    }
    
    try {
        JSON.parse(input);
        showStatus('Valid JSON!', 'success');
    } catch (error) {
        showStatus('Invalid JSON: ' + error.message, 'danger');
    }
}

function clearJsonFields() {
    document.getElementById('inputJson').value = '';
    document.getElementById('outputJson').value = '';
    hideStatus();
}

function showStatus(message, type) {
    const status = document.getElementById('jsonStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function hideStatus() {
    const status = document.getElementById('jsonStatus');
    status.style.display = 'none';
}

// UUID Generator Functions
function generateUuid() {
    const uuid = crypto.randomUUID();
    document.getElementById('generatedUuid').value = uuid;
    showUuidStatus('UUID generated successfully!', 'success');
}

function generateMultiple() {
    const uuids = [];
    for (let i = 0; i < 10; i++) {
        uuids.push(crypto.randomUUID());
    }
    document.getElementById('multipleUuids').value = uuids.join('\n');
    showUuidStatus('10 UUIDs generated successfully!', 'success');
}

function copyUuid() {
    const uuidField = document.getElementById('generatedUuid');
    if (!uuidField.value) {
        showUuidStatus('No UUID to copy. Generate one first.', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(uuidField.value).then(() => {
        showUuidStatus('UUID copied to clipboard!', 'success');
    }).catch(() => {
        uuidField.select();
        document.execCommand('copy');
        showUuidStatus('UUID copied to clipboard!', 'success');
    });
}

function clearUuids() {
    document.getElementById('generatedUuid').value = '';
    document.getElementById('multipleUuids').value = '';
    hideUuidStatus();
}

function showUuidStatus(message, type) {
    const status = document.getElementById('uuidStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function hideUuidStatus() {
    const status = document.getElementById('uuidStatus');
    status.style.display = 'none';
}

// Base64/Hash Converter Functions
function encodeBase64() {
    const input = document.getElementById('base64Input').value;
    if (!input) {
        showHashStatus('Please enter text to encode.', 'warning');
        return;
    }
    const encoded = btoa(unescape(encodeURIComponent(input)));
    document.getElementById('base64Output').value = encoded;
    showHashStatus('Text encoded to Base64 successfully!', 'success');
}

function decodeBase64() {
    const input = document.getElementById('base64Input').value;
    if (!input) {
        showHashStatus('Please enter Base64 to decode.', 'warning');
        return;
    }
    try {
        const decoded = decodeURIComponent(escape(atob(input)));
        document.getElementById('base64Output').value = decoded;
        showHashStatus('Base64 decoded successfully!', 'success');
    } catch (error) {
        showHashStatus('Invalid Base64 format.', 'danger');
    }
}

function copyBase64() {
    const output = document.getElementById('base64Output').value;
    if (!output) {
        showHashStatus('No result to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showHashStatus('Result copied to clipboard!', 'success');
    });
}

function clearBase64() {
    document.getElementById('base64Input').value = '';
    document.getElementById('base64Output').value = '';
    hideHashStatus();
}

async function generateMD5() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showHashStatus('Please enter text to hash.', 'warning');
        return;
    }
    const hash = await digestMessage(input, 'MD5');
    document.getElementById('hashOutput').value = `MD5: ${hash}`;
    showHashStatus('MD5 hash generated!', 'success');
}

async function generateSHA1() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showHashStatus('Please enter text to hash.', 'warning');
        return;
    }
    const hash = await digestMessage(input, 'SHA-1');
    document.getElementById('hashOutput').value = `SHA-1: ${hash}`;
    showHashStatus('SHA-1 hash generated!', 'success');
}

async function generateSHA256() {
    const input = document.getElementById('hashInput').value;
    if (!input) {
        showHashStatus('Please enter text to hash.', 'warning');
        return;
    }
    const hash = await digestMessage(input, 'SHA-256');
    document.getElementById('hashOutput').value = `SHA-256: ${hash}`;
    showHashStatus('SHA-256 hash generated!', 'success');
}

async function digestMessage(message, algorithm) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function copyHash() {
    const output = document.getElementById('hashOutput').value;
    if (!output) {
        showHashStatus('No hash to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showHashStatus('Hash copied to clipboard!', 'success');
    });
}

function clearHash() {
    document.getElementById('hashInput').value = '';
    document.getElementById('hashOutput').value = '';
    hideHashStatus();
}

function showHashStatus(message, type) {
    const status = document.getElementById('hashStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function hideHashStatus() {
    const status = document.getElementById('hashStatus');
    status.style.display = 'none';
}

// Code Formatter Functions
function formatCode() {
    const input = document.getElementById('codeInput').value.trim();
    const codeType = document.getElementById('codeType').value;
    const output = document.getElementById('codeOutput');
    
    if (!input) {
        showCodeStatus('Please enter code to format.', 'warning');
        return;
    }
    
    try {
        let formatted;
        switch (codeType) {
            case 'json':
                formatted = JSON.stringify(JSON.parse(input), null, 2);
                break;
            case 'xml':
            case 'html':
                formatted = formatXmlHtml(input);
                break;
            case 'css':
                formatted = formatCss(input);
                break;
            case 'sql':
                formatted = formatSql(input);
                break;
            case 'csharp':
                formatted = formatCSharp(input);
                break;
            default:
                formatted = input;
        }
        output.value = formatted;
        showCodeStatus(`${codeType.toUpperCase()} formatted successfully!`, 'success');
    } catch (error) {
        showCodeStatus(`Error formatting ${codeType.toUpperCase()}: ${error.message}`, 'danger');
    }
}

function minifyCode() {
    const input = document.getElementById('codeInput').value.trim();
    const codeType = document.getElementById('codeType').value;
    const output = document.getElementById('codeOutput');
    
    if (!input) {
        showCodeStatus('Please enter code to minify.', 'warning');
        return;
    }
    
    try {
        let minified;
        switch (codeType) {
            case 'json':
                minified = JSON.stringify(JSON.parse(input));
                break;
            case 'css':
                minified = input.replace(/\s+/g, ' ').replace(/;\s*}/g, '}').replace(/\s*{\s*/g, '{').replace(/;\s*/g, ';').trim();
                break;
            default:
                minified = input.replace(/\s+/g, ' ').trim();
        }
        output.value = minified;
        showCodeStatus(`${codeType.toUpperCase()} minified successfully!`, 'success');
    } catch (error) {
        showCodeStatus(`Error minifying ${codeType.toUpperCase()}: ${error.message}`, 'danger');
    }
}

function formatXmlHtml(input) {
    const formatted = input.replace(/></g, '>\n<');
    const lines = formatted.split('\n');
    let indent = 0;
    const indentSize = 2;
    
    return lines.map(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('</')) indent -= indentSize;
        const result = ' '.repeat(Math.max(0, indent)) + trimmed;
        if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('/>')) {
            indent += indentSize;
        }
        return result;
    }).join('\n');
}

function formatCss(input) {
    return input
        .replace(/\{/g, ' {\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n  ')
        .replace(/,/g, ',\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

function formatSql(input) {
    return input
        .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|ORDER BY|GROUP BY|HAVING)\b/gi, '\n$1')
        .replace(/,/g, ',\n  ')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

function formatCSharp(input) {
    return input
        .replace(/\{/g, '\n{\n  ')
        .replace(/\}/g, '\n}\n')
        .replace(/;/g, ';\n')
        .replace(/\n\s*\n/g, '\n')
        .trim();
}

function copyCode() {
    const output = document.getElementById('codeOutput').value;
    if (!output) {
        showCodeStatus('No formatted code to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showCodeStatus('Code copied to clipboard!', 'success');
    });
}

function clearCodeFields() {
    document.getElementById('codeInput').value = '';
    document.getElementById('codeOutput').value = '';
    hideCodeStatus();
}

function showCodeStatus(message, type) {
    const status = document.getElementById('codeStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function hideCodeStatus() {
    const status = document.getElementById('codeStatus');
    status.style.display = 'none';
}

// Color Palette Functions
function updateColorInfo() {
    const color = document.getElementById('colorPicker').value;
    const rgb = hexToRgb(color);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    document.getElementById('hexValue').textContent = color.toUpperCase();
    document.getElementById('rgbValue').textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('hslValue').textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

function generateRandomPalette() {
    const colors = [];
    for (let i = 0; i < 5; i++) {
        colors.push(getRandomColor());
    }
    displayPalette(colors);
    showColorStatus('Random palette generated!', 'success');
}

function generateComplementary() {
    const baseColor = document.getElementById('colorPicker').value;
    const rgb = hexToRgb(baseColor);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    const colors = [
        baseColor,
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
        hslToHex(hsl.h, Math.max(10, hsl.s - 20), Math.min(90, hsl.l + 20))
    ];
    
    displayPalette(colors);
    showColorStatus('Complementary palette generated!', 'success');
}

function displayPalette(colors) {
    const palette = document.getElementById('colorPalette');
    palette.innerHTML = colors.map(color => 
        `<div class="color-swatch" style="background-color: ${color}" onclick="selectColor('${color}')" title="${color}">
            <span class="color-code">${color}</span>
        </div>`
    ).join('');
}

function selectColor(color) {
    document.getElementById('colorPicker').value = color;
    updateColorInfo();
    showColorStatus(`Color ${color} selected!`, 'info');
}

function saveCurrentColor() {
    const color = document.getElementById('colorPicker').value;
    let savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
    
    if (!savedColors.includes(color)) {
        savedColors.push(color);
        localStorage.setItem('savedColors', JSON.stringify(savedColors));
        displaySavedColors();
        showColorStatus(`Color ${color} saved!`, 'success');
    } else {
        showColorStatus('Color already saved!', 'warning');
    }
}

function displaySavedColors() {
    const savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
    const container = document.getElementById('savedColors');
    
    if (savedColors.length === 0) {
        container.innerHTML = '<p class="text-muted">No saved colors yet.</p>';
        return;
    }
    
    container.innerHTML = savedColors.map(color => 
        `<div class="saved-color-item">
            <div class="color-swatch small" style="background-color: ${color}" onclick="selectColor('${color}')" title="${color}"></div>
            <span class="color-text">${color}</span>
            <button class="btn btn-sm btn-outline-danger" onclick="removeSavedColor('${color}')">×</button>
        </div>`
    ).join('');
}

function removeSavedColor(color) {
    let savedColors = JSON.parse(localStorage.getItem('savedColors') || '[]');
    savedColors = savedColors.filter(c => c !== color);
    localStorage.setItem('savedColors', JSON.stringify(savedColors));
    displaySavedColors();
    showColorStatus(`Color ${color} removed!`, 'info');
}

function clearSavedColors() {
    localStorage.removeItem('savedColors');
    displaySavedColors();
    showColorStatus('All saved colors cleared!', 'info');
}

function copyColor(type) {
    let value;
    switch (type) {
        case 'hex':
            value = document.getElementById('hexValue').textContent;
            break;
        case 'rgb':
            value = document.getElementById('rgbValue').textContent;
            break;
        case 'hsl':
            value = document.getElementById('hslValue').textContent;
            break;
    }
    
    navigator.clipboard.writeText(value).then(() => {
        showColorStatus(`${type.toUpperCase()} value copied to clipboard!`, 'success');
    });
}

function getRandomColor() {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
    l /= 100; s /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

function showColorStatus(message, type) {
    const status = document.getElementById('colorStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

// Initialize color palette on page load
if (document.getElementById('colorPicker')) {
    updateColorInfo();
    displaySavedColors();
}

// API Mock Generator Functions
let currentSwaggerSpec = null;

function generateMockData() {
    const input = document.getElementById('swaggerInput').value.trim();
    if (!input) {
        showApiStatus('Please enter Swagger/OpenAPI JSON.', 'warning');
        return;
    }
    
    try {
        currentSwaggerSpec = JSON.parse(input);
        const mockData = generateAllMockResponses(currentSwaggerSpec);
        document.getElementById('mockOutput').value = JSON.stringify(mockData, null, 2);
        populateSelectors(currentSwaggerSpec);
        showApiStatus('Mock data generated successfully!', 'success');
    } catch (error) {
        showApiStatus('Invalid JSON: ' + error.message, 'danger');
    }
}

function generateEndpoints() {
    const input = document.getElementById('swaggerInput').value.trim();
    if (!input) {
        showApiStatus('Please enter Swagger/OpenAPI JSON.', 'warning');
        return;
    }
    
    try {
        currentSwaggerSpec = JSON.parse(input);
        const endpoints = extractEndpoints(currentSwaggerSpec);
        document.getElementById('mockOutput').value = JSON.stringify(endpoints, null, 2);
        populateSelectors(currentSwaggerSpec);
        showApiStatus('Endpoints extracted successfully!', 'success');
    } catch (error) {
        showApiStatus('Invalid JSON: ' + error.message, 'danger');
    }
}

function generateAllMockResponses(spec) {
    const mockData = {};
    
    if (spec.paths) {
        Object.keys(spec.paths).forEach(path => {
            Object.keys(spec.paths[path]).forEach(method => {
                const operation = spec.paths[path][method];
                if (operation.responses) {
                    const key = `${method.toUpperCase()} ${path}`;
                    mockData[key] = generateResponseMock(operation.responses, spec);
                }
            });
        });
    }
    
    return mockData;
}

function extractEndpoints(spec) {
    const endpoints = [];
    
    if (spec.paths) {
        Object.keys(spec.paths).forEach(path => {
            Object.keys(spec.paths[path]).forEach(method => {
                const operation = spec.paths[path][method];
                endpoints.push({
                    method: method.toUpperCase(),
                    path: path,
                    summary: operation.summary || '',
                    description: operation.description || '',
                    parameters: operation.parameters || [],
                    responses: Object.keys(operation.responses || {})
                });
            });
        });
    }
    
    return endpoints;
}

function generateResponseMock(responses, spec) {
    const response200 = responses['200'] || responses['201'] || Object.values(responses)[0];
    if (!response200) return {};
    
    const content = response200.content;
    if (!content) return {};
    
    const jsonContent = content['application/json'];
    if (!jsonContent || !jsonContent.schema) return {};
    
    return generateMockFromSchema(jsonContent.schema, spec);
}

function generateMockFromSchema(schema, spec) {
    if (schema.$ref) {
        const refPath = schema.$ref.replace('#/', '').split('/');
        let refSchema = spec;
        refPath.forEach(part => refSchema = refSchema[part]);
        return generateMockFromSchema(refSchema, spec);
    }
    
    switch (schema.type) {
        case 'object':
            const obj = {};
            if (schema.properties) {
                Object.keys(schema.properties).forEach(key => {
                    obj[key] = generateMockFromSchema(schema.properties[key], spec);
                });
            }
            return obj;
            
        case 'array':
            const items = schema.items ? generateMockFromSchema(schema.items, spec) : 'item';
            return [items, items];
            
        case 'string':
            if (schema.format === 'date-time') return new Date().toISOString();
            if (schema.format === 'date') return new Date().toISOString().split('T')[0];
            if (schema.format === 'email') return 'user@example.com';
            if (schema.format === 'uuid') return crypto.randomUUID();
            return schema.example || 'string';
            
        case 'integer':
        case 'number':
            return schema.example || 123;
            
        case 'boolean':
            return schema.example !== undefined ? schema.example : true;
            
        default:
            return schema.example || null;
    }
}

function populateSelectors(spec) {
    const schemaSelect = document.getElementById('schemaSelect');
    const endpointSelect = document.getElementById('endpointSelect');
    
    // Clear existing options
    schemaSelect.innerHTML = '<option value="">Select a schema...</option>';
    endpointSelect.innerHTML = '<option value="">Select an endpoint...</option>';
    
    // Populate schemas
    if (spec.components && spec.components.schemas) {
        Object.keys(spec.components.schemas).forEach(schemaName => {
            const option = document.createElement('option');
            option.value = schemaName;
            option.textContent = schemaName;
            schemaSelect.appendChild(option);
        });
    }
    
    // Populate endpoints
    if (spec.paths) {
        Object.keys(spec.paths).forEach(path => {
            Object.keys(spec.paths[path]).forEach(method => {
                const operation = spec.paths[path][method];
                const option = document.createElement('option');
                option.value = `${method}:${path}`;
                option.textContent = `${method.toUpperCase()} ${path} - ${operation.summary || ''}`;
                endpointSelect.appendChild(option);
            });
        });
    }
}

function generateSchemaData() {
    const schemaName = document.getElementById('schemaSelect').value;
    if (!schemaName || !currentSwaggerSpec) return;
    
    const schema = currentSwaggerSpec.components?.schemas?.[schemaName];
    if (schema) {
        const mockData = generateMockFromSchema(schema, currentSwaggerSpec);
        document.getElementById('mockOutput').value = JSON.stringify(mockData, null, 2);
        showApiStatus(`Mock data generated for schema: ${schemaName}`, 'success');
    }
}

function generateEndpointData() {
    const endpointValue = document.getElementById('endpointSelect').value;
    if (!endpointValue || !currentSwaggerSpec) return;
    
    const [method, path] = endpointValue.split(':');
    const operation = currentSwaggerSpec.paths?.[path]?.[method];
    
    if (operation && operation.responses) {
        const mockData = generateResponseMock(operation.responses, currentSwaggerSpec);
        document.getElementById('mockOutput').value = JSON.stringify(mockData, null, 2);
        showApiStatus(`Mock data generated for: ${method.toUpperCase()} ${path}`, 'success');
    }
}

function copyMockData() {
    const output = document.getElementById('mockOutput').value;
    if (!output) {
        showApiStatus('No mock data to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(output).then(() => {
        showApiStatus('Mock data copied to clipboard!', 'success');
    });
}

function clearApiFields() {
    document.getElementById('swaggerInput').value = '';
    document.getElementById('mockOutput').value = '';
    document.getElementById('schemaSelect').innerHTML = '<option value="">Select a schema...</option>';
    document.getElementById('endpointSelect').innerHTML = '<option value="">Select an endpoint...</option>';
    currentSwaggerSpec = null;
    hideApiStatus();
}

function showApiStatus(message, type) {
    const status = document.getElementById('apiStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
}

function hideApiStatus() {
    const status = document.getElementById('apiStatus');
    status.style.display = 'none';
}

// Regex Tester Functions
function testRegex() {
    const pattern = document.getElementById('regexPattern').value;
    const flags = document.getElementById('regexFlags').value;
    const testString = document.getElementById('testString').value;
    const resultsDiv = document.getElementById('regexResults');
    const matchesOutput = document.getElementById('matchesOutput');
    const groupsOutput = document.getElementById('groupsOutput');
    
    if (!pattern) {
        resultsDiv.innerHTML = '<p class="text-muted">Enter a regex pattern to test.</p>';
        matchesOutput.value = '';
        groupsOutput.value = '';
        return;
    }
    
    try {
        const regex = new RegExp(pattern, flags);
        const matches = [];
        const groups = [];
        let match;
        let matchCount = 0;
        
        if (flags.includes('g')) {
            while ((match = regex.exec(testString)) !== null && matchCount < 100) {
                matches.push(match[0]);
                if (match.length > 1) {
                    groups.push(match.slice(1));
                }
                matchCount++;
                if (regex.lastIndex === match.index) break;
            }
        } else {
            match = regex.exec(testString);
            if (match) {
                matches.push(match[0]);
                if (match.length > 1) {
                    groups.push(match.slice(1));
                }
            }
        }
        
        // Display results with highlighting
        if (matches.length > 0) {
            let highlightedText = testString;
            const sortedMatches = [...matches].sort((a, b) => b.length - a.length);
            
            sortedMatches.forEach(match => {
                const escapedMatch = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                highlightedText = highlightedText.replace(new RegExp(escapedMatch, 'g'), `<mark>$&</mark>`);
            });
            
            resultsDiv.innerHTML = `
                <div class="alert alert-success">
                    <strong>${matches.length} match${matches.length !== 1 ? 'es' : ''} found</strong>
                </div>
                <div class="highlighted-text">${highlightedText}</div>
            `;
            
            matchesOutput.value = matches.join('\n');
            groupsOutput.value = groups.map((group, i) => `Match ${i + 1}: ${group.join(', ')}`).join('\n');
        } else {
            resultsDiv.innerHTML = '<div class="alert alert-warning">No matches found</div>';
            matchesOutput.value = '';
            groupsOutput.value = '';
        }
        
        hideRegexStatus();
    } catch (error) {
        resultsDiv.innerHTML = `<div class="alert alert-danger">Invalid regex: ${error.message}</div>`;
        matchesOutput.value = '';
        groupsOutput.value = '';
        showRegexStatus('Invalid regular expression: ' + error.message, 'danger');
    }
}

function updateFlags() {
    const global = document.getElementById('flagGlobal').checked;
    const ignoreCase = document.getElementById('flagIgnoreCase').checked;
    const multiline = document.getElementById('flagMultiline').checked;
    
    let flags = '';
    if (global) flags += 'g';
    if (ignoreCase) flags += 'i';
    if (multiline) flags += 'm';
    
    document.getElementById('regexFlags').value = flags;
    testRegex();
}

function setPattern(pattern) {
    document.getElementById('regexPattern').value = pattern;
    testRegex();
    showRegexStatus('Pattern set: ' + pattern, 'info');
}

function copyMatches() {
    const matches = document.getElementById('matchesOutput').value;
    if (!matches) {
        showRegexStatus('No matches to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(matches).then(() => {
        showRegexStatus('Matches copied to clipboard!', 'success');
    });
}

function copyGroups() {
    const groups = document.getElementById('groupsOutput').value;
    if (!groups) {
        showRegexStatus('No groups to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(groups).then(() => {
        showRegexStatus('Groups copied to clipboard!', 'success');
    });
}

function showRegexStatus(message, type) {
    const status = document.getElementById('regexStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => hideRegexStatus(), 3000);
}

function hideRegexStatus() {
    const status = document.getElementById('regexStatus');
    status.style.display = 'none';
}

function setEmailPattern() {
    setPattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
}

function setHexPattern() {
    setPattern('#[a-fA-F0-9]{6}');
}

// QR Code Generator Functions
function generateQR() {
    const text = document.getElementById('qrText').value.trim();
    const size = document.getElementById('qrSize').value;
    const color = document.getElementById('qrColor').value.replace('#', '');
    const container = document.getElementById('qrCodeContainer');
    
    if (!text) {
        container.innerHTML = '<p class="text-muted">Enter text to generate QR code</p>';
        return;
    }
    
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&color=${color}&data=${encodeURIComponent(text)}`;
    
    container.innerHTML = `
        <img id="qrImage" src="${qrUrl}" alt="QR Code" class="qr-image" onload="showQrStatus('QR code generated successfully!', 'success')" onerror="showQrStatus('Failed to generate QR code', 'danger')">
    `;
}

function downloadQR() {
    const img = document.getElementById('qrImage');
    if (!img) {
        showQrStatus('No QR code to download. Generate one first.', 'warning');
        return;
    }
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = 'qrcode.png';
    link.click();
    showQrStatus('QR code download started!', 'success');
}

function copyQRLink() {
    const img = document.getElementById('qrImage');
    if (!img) {
        showQrStatus('No QR code to copy. Generate one first.', 'warning');
        return;
    }
    
    navigator.clipboard.writeText(img.src).then(() => {
        showQrStatus('QR code link copied to clipboard!', 'success');
    });
}

function setTemplate(type) {
    const textArea = document.getElementById('qrText');
    let template = '';
    
    switch (type) {
        case 'url':
            template = 'https://example.com';
            break;
        case 'email':
            template = 'mailto:user@example.com?subject=Hello&body=Message';
            break;
        case 'phone':
            template = 'tel:+1234567890';
            break;
        case 'sms':
            template = 'sms:+1234567890?body=Hello';
            break;
        case 'wifi':
            template = 'WIFI:T:WPA;S:NetworkName;P:Password;;';
            break;
        case 'vcard':
            template = 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nORG:Company\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
            break;
    }
    
    textArea.value = template;
    generateQR();
    showQrStatus(`${type.toUpperCase()} template loaded!`, 'info');
}

function showQrStatus(message, type) {
    const status = document.getElementById('qrStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => hideQrStatus(), 3000);
}

function hideQrStatus() {
    const status = document.getElementById('qrStatus');
    status.style.display = 'none';
}

// JWT Decoder Functions
function decodeJWT() {
    const token = document.getElementById('jwtInput').value.trim();
    const statusDiv = document.getElementById('jwtStatus');
    const infoDiv = document.getElementById('jwtInfo');
    const headerOutput = document.getElementById('headerOutput');
    const payloadOutput = document.getElementById('payloadOutput');
    const tokenDetails = document.getElementById('tokenDetails');
    
    if (!token) {
        statusDiv.innerHTML = '<span class="badge bg-secondary">No token</span>';
        infoDiv.innerHTML = '<p class="text-muted">Paste a JWT token to see decoded information</p>';
        headerOutput.value = '';
        payloadOutput.value = '';
        tokenDetails.innerHTML = '<p class="text-muted">Token details will appear here after decoding</p>';
        return;
    }
    
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT format. JWT must have 3 parts separated by dots.');
        }
        
        const header = JSON.parse(atob(parts[0]));
        const payload = JSON.parse(atob(parts[1]));
        
        headerOutput.value = JSON.stringify(header, null, 2);
        payloadOutput.value = JSON.stringify(payload, null, 2);
        
        // Token status
        const now = Math.floor(Date.now() / 1000);
        let statusBadge = '';
        
        if (payload.exp) {
            if (payload.exp < now) {
                statusBadge = '<span class="badge bg-danger">Expired</span>';
            } else {
                statusBadge = '<span class="badge bg-success">Valid</span>';
            }
        } else {
            statusBadge = '<span class="badge bg-warning">No expiration</span>';
        }
        
        statusDiv.innerHTML = statusBadge;
        
        // Token info
        let infoHtml = '<div class="jwt-summary">';
        infoHtml += `<p><strong>Algorithm:</strong> ${header.alg || 'Unknown'}</p>`;
        infoHtml += `<p><strong>Type:</strong> ${header.typ || 'Unknown'}</p>`;
        
        if (payload.iss) infoHtml += `<p><strong>Issuer:</strong> ${payload.iss}</p>`;
        if (payload.sub) infoHtml += `<p><strong>Subject:</strong> ${payload.sub}</p>`;
        if (payload.aud) infoHtml += `<p><strong>Audience:</strong> ${Array.isArray(payload.aud) ? payload.aud.join(', ') : payload.aud}</p>`;
        
        infoHtml += '</div>';
        infoDiv.innerHTML = infoHtml;
        
        // Token details
        let detailsHtml = '<div class="row">';
        
        if (payload.iat) {
            detailsHtml += `<div class="col-md-4"><strong>Issued At:</strong><br>${new Date(payload.iat * 1000).toLocaleString()}</div>`;
        }
        
        if (payload.exp) {
            const expDate = new Date(payload.exp * 1000);
            const isExpired = payload.exp < now;
            detailsHtml += `<div class="col-md-4"><strong>Expires At:</strong><br><span class="${isExpired ? 'text-danger' : 'text-success'}">${expDate.toLocaleString()}</span></div>`;
        }
        
        if (payload.nbf) {
            detailsHtml += `<div class="col-md-4"><strong>Not Before:</strong><br>${new Date(payload.nbf * 1000).toLocaleString()}</div>`;
        }
        
        detailsHtml += '</div>';
        
        if (payload.jti) {
            detailsHtml += `<p class="mt-3"><strong>JWT ID:</strong> ${payload.jti}</p>`;
        }
        
        tokenDetails.innerHTML = detailsHtml;
        
        hideJwtAlert();
        
    } catch (error) {
        statusDiv.innerHTML = '<span class="badge bg-danger">Invalid</span>';
        infoDiv.innerHTML = `<div class="alert alert-danger">Error: ${error.message}</div>`;
        headerOutput.value = '';
        payloadOutput.value = '';
        tokenDetails.innerHTML = '<p class="text-muted">Unable to decode token</p>';
        showJwtAlert('Invalid JWT token: ' + error.message, 'danger');
    }
}

function copyHeader() {
    const header = document.getElementById('headerOutput').value;
    if (!header) {
        showJwtAlert('No header to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(header).then(() => {
        showJwtAlert('Header copied to clipboard!', 'success');
    });
}

function copyPayload() {
    const payload = document.getElementById('payloadOutput').value;
    if (!payload) {
        showJwtAlert('No payload to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(payload).then(() => {
        showJwtAlert('Payload copied to clipboard!', 'success');
    });
}

function clearJWT() {
    document.getElementById('jwtInput').value = '';
    decodeJWT();
    showJwtAlert('JWT token cleared!', 'info');
}

function showJwtAlert(message, type) {
    const alert = document.getElementById('jwtAlert');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.display = 'block';
    setTimeout(() => hideJwtAlert(), 3000);
}

function hideJwtAlert() {
    const alert = document.getElementById('jwtAlert');
    alert.style.display = 'none';
}

// DateTime Converter Functions
function updateCurrentTime() {
    const now = new Date();
    const localTime = now.toLocaleString();
    const utcTime = now.toUTCString();
    const unixTime = Math.floor(now.getTime() / 1000);
    
    document.getElementById('currentLocal').textContent = localTime;
    document.getElementById('currentUtc').textContent = utcTime;
    document.getElementById('currentUnix').textContent = unixTime;
}

function convertFromTimestamp() {
    const timestamp = document.getElementById('timestampInput').value;
    const resultsDiv = document.getElementById('timestampResults');
    
    if (!timestamp) {
        resultsDiv.innerHTML = '<p class="text-muted">Enter a Unix timestamp to convert</p>';
        return;
    }
    
    try {
        const date = new Date(parseInt(timestamp) * 1000);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid timestamp');
        }
        
        resultsDiv.innerHTML = `
            <div class="conversion-item">
                <label>Local Time:</label>
                <span>${date.toLocaleString()}</span>
            </div>
            <div class="conversion-item">
                <label>UTC Time:</label>
                <span>${date.toUTCString()}</span>
            </div>
            <div class="conversion-item">
                <label>ISO String:</label>
                <span>${date.toISOString()}</span>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<div class="alert alert-danger">Invalid timestamp</div>';
    }
}

function convertToTimestamp() {
    const dateValue = document.getElementById('dateInput').value;
    const timeValue = document.getElementById('timeInput').value;
    const timezone = document.getElementById('timezoneSelect').value;
    const resultsDiv = document.getElementById('dateResults');
    
    if (!dateValue) {
        resultsDiv.innerHTML = '<p class="text-muted">Select date and time to convert</p>';
        return;
    }
    
    try {
        const dateTimeString = `${dateValue}T${timeValue || '00:00:00'}`;
        let date;
        
        if (timezone === 'utc') {
            date = new Date(dateTimeString + 'Z');
        } else {
            date = new Date(dateTimeString);
        }
        
        const timestamp = Math.floor(date.getTime() / 1000);
        
        resultsDiv.innerHTML = `
            <div class="conversion-item">
                <label>Unix Timestamp:</label>
                <span>${timestamp}</span>
            </div>
            <div class="conversion-item">
                <label>Milliseconds:</label>
                <span>${date.getTime()}</span>
            </div>
            <div class="conversion-item">
                <label>ISO String:</label>
                <span>${date.toISOString()}</span>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<div class="alert alert-danger">Invalid date/time</div>';
    }
}

function convertFromISO() {
    const isoString = document.getElementById('isoInput').value.trim();
    const resultsDiv = document.getElementById('isoResults');
    
    if (!isoString) {
        resultsDiv.innerHTML = '<p class="text-muted">Enter an ISO date string to convert</p>';
        return;
    }
    
    try {
        const date = new Date(isoString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid ISO string');
        }
        
        const timestamp = Math.floor(date.getTime() / 1000);
        
        resultsDiv.innerHTML = `
            <div class="conversion-item">
                <label>Local Time:</label>
                <span>${date.toLocaleString()}</span>
            </div>
            <div class="conversion-item">
                <label>UTC Time:</label>
                <span>${date.toUTCString()}</span>
            </div>
            <div class="conversion-item">
                <label>Unix Timestamp:</label>
                <span>${timestamp}</span>
            </div>
        `;
    } catch (error) {
        resultsDiv.innerHTML = '<div class="alert alert-danger">Invalid ISO date string</div>';
    }
}

function setCurrentTimestamp() {
    const now = Math.floor(Date.now() / 1000);
    document.getElementById('timestampInput').value = now;
    convertFromTimestamp();
    showDateTimeStatus('Current timestamp set!', 'success');
}

function setCurrentISO() {
    const now = new Date().toISOString();
    document.getElementById('isoInput').value = now;
    convertFromISO();
    showDateTimeStatus('Current ISO string set!', 'success');
}

function copyISO() {
    const iso = document.getElementById('isoInput').value;
    if (!iso) {
        showDateTimeStatus('No ISO string to copy.', 'warning');
        return;
    }
    navigator.clipboard.writeText(iso).then(() => {
        showDateTimeStatus('ISO string copied to clipboard!', 'success');
    });
}

function addDays(days) {
    const timestampInput = document.getElementById('timestampInput');
    let timestamp = parseInt(timestampInput.value) || Math.floor(Date.now() / 1000);
    
    timestamp += (days * 24 * 60 * 60);
    timestampInput.value = timestamp;
    convertFromTimestamp();
    
    const action = days > 0 ? `+${days}` : days;
    showDateTimeStatus(`${action} day${Math.abs(days) !== 1 ? 's' : ''} added!`, 'info');
}

function showDateTimeStatus(message, type) {
    const status = document.getElementById('datetimeStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => hideDateTimeStatus(), 3000);
}

function hideDateTimeStatus() {
    const status = document.getElementById('datetimeStatus');
    status.style.display = 'none';
}

// Initialize DateTime Converter
if (document.getElementById('currentLocal')) {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

// Dependency Graph Functions
let graphData = null;
let svg = null;
let simulation = null;

function generateGraph() {
    const input = document.getElementById('dependencyInput').value.trim();
    const container = document.getElementById('graphContainer');
    
    if (!input) {
        container.innerHTML = '<p class="text-muted">Enter dependency data to visualize the graph</p>';
        updateStats(0, 0, 0, 0);
        return;
    }
    
    try {
        graphData = JSON.parse(input);
        const { nodes, links } = processGraphData(graphData);
        
        if (nodes.length === 0) {
            container.innerHTML = '<p class="text-muted">No valid dependencies found</p>';
            return;
        }
        
        renderGraph(nodes, links);
        const cycles = detectCycles(nodes, links);
        const maxDepth = calculateMaxDepth(nodes, links);
        updateStats(nodes.length, links.length, cycles, maxDepth);
        
        showDependencyStatus('Graph generated successfully!', 'success');
    } catch (error) {
        container.innerHTML = `<div class="alert alert-danger">Invalid JSON: ${error.message}</div>`;
        showDependencyStatus('Invalid JSON format', 'danger');
    }
}

function processGraphData(data) {
    const nodeSet = new Set();
    const links = [];
    
    if (Array.isArray(data)) {
        data.forEach(item => {
            if (item.name && item.dependencies) {
                nodeSet.add(item.name);
                item.dependencies.forEach(dep => {
                    nodeSet.add(dep);
                    links.push({ source: item.name, target: dep });
                });
            }
        });
    } else if (typeof data === 'object') {
        Object.keys(data).forEach(key => {
            nodeSet.add(key);
            if (Array.isArray(data[key])) {
                data[key].forEach(dep => {
                    nodeSet.add(dep);
                    links.push({ source: key, target: dep });
                });
            }
        });
    }
    
    const nodes = Array.from(nodeSet).map(id => ({ id, name: id }));
    return { nodes, links };
}

function renderGraph(nodes, links) {
    const container = document.getElementById('graphContainer');
    container.innerHTML = '';
    
    const width = container.clientWidth;
    const height = 500;
    
    svg = d3.select('#graphContainer')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(d3.zoom().on('zoom', (event) => {
            svg.select('g').attr('transform', event.transform);
        }));
    
    const g = svg.append('g');
    
    simulation = d3.forceSimulation(nodes)
        .force('link', d3.forceLink(links).id(d => d.id).distance(100))
        .force('charge', d3.forceManyBody().strength(-300))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Add arrow markers
    svg.append('defs').append('marker')
        .attr('id', 'arrowhead')
        .attr('viewBox', '-0 -5 10 10')
        .attr('refX', 25)
        .attr('refY', 0)
        .attr('orient', 'auto')
        .attr('markerWidth', 8)
        .attr('markerHeight', 8)
        .append('path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', '#666');
    
    const link = g.append('g')
        .selectAll('line')
        .data(links)
        .enter().append('line')
        .attr('stroke', '#666')
        .attr('stroke-width', 2)
        .attr('marker-end', 'url(#arrowhead)');
    
    const node = g.append('g')
        .selectAll('circle')
        .data(nodes)
        .enter().append('circle')
        .attr('r', 20)
        .attr('fill', '#69b3a2')
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .call(d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended));
    
    const label = g.append('g')
        .selectAll('text')
        .data(nodes)
        .enter().append('text')
        .text(d => d.name)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('dy', 4)
        .attr('fill', 'white')
        .attr('font-weight', 'bold');
    
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
        
        label
            .attr('x', d => d.x)
            .attr('y', d => d.y);
    });
}

function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function detectCycles(nodes, links) {
    const graph = {};
    nodes.forEach(node => graph[node.id] = []);
    links.forEach(link => graph[link.source].push(link.target));
    
    const visited = new Set();
    const recStack = new Set();
    let cycles = 0;
    
    function hasCycle(node) {
        if (recStack.has(node)) return true;
        if (visited.has(node)) return false;
        
        visited.add(node);
        recStack.add(node);
        
        for (const neighbor of graph[node] || []) {
            if (hasCycle(neighbor)) {
                cycles++;
                return true;
            }
        }
        
        recStack.delete(node);
        return false;
    }
    
    nodes.forEach(node => {
        if (!visited.has(node.id)) {
            hasCycle(node.id);
        }
    });
    
    return cycles;
}

function calculateMaxDepth(nodes, links) {
    const graph = {};
    const inDegree = {};
    
    nodes.forEach(node => {
        graph[node.id] = [];
        inDegree[node.id] = 0;
    });
    
    links.forEach(link => {
        graph[link.source].push(link.target);
        inDegree[link.target]++;
    });
    
    const queue = [];
    const depth = {};
    
    nodes.forEach(node => {
        if (inDegree[node.id] === 0) {
            queue.push(node.id);
            depth[node.id] = 0;
        }
    });
    
    let maxDepth = 0;
    
    while (queue.length > 0) {
        const current = queue.shift();
        
        graph[current].forEach(neighbor => {
            depth[neighbor] = Math.max(depth[neighbor] || 0, depth[current] + 1);
            maxDepth = Math.max(maxDepth, depth[neighbor]);
            inDegree[neighbor]--;
            
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        });
    }
    
    return maxDepth;
}

function updateStats(nodes, edges, cycles, maxDepth) {
    document.getElementById('nodeCount').textContent = nodes;
    document.getElementById('edgeCount').textContent = edges;
    document.getElementById('cycleCount').textContent = cycles;
    document.getElementById('maxDepth').textContent = maxDepth;
}

function loadSample() {
    const sample = {
        "App": ["Database", "Cache", "Logger"],
        "Database": ["Connection Pool"],
        "Cache": ["Redis"],
        "Logger": ["File System"],
        "Connection Pool": ["Driver"],
        "Redis": [],
        "File System": [],
        "Driver": []
    };
    
    document.getElementById('dependencyInput').value = JSON.stringify(sample, null, 2);
    generateGraph();
    showDependencyStatus('Sample data loaded!', 'info');
}

function clearGraph() {
    document.getElementById('dependencyInput').value = '';
    document.getElementById('graphContainer').innerHTML = '<p class="text-muted">Enter dependency data to visualize the graph</p>';
    updateStats(0, 0, 0, 0);
    showDependencyStatus('Graph cleared!', 'info');
}

function resetZoom() {
    if (svg) {
        svg.transition().duration(750).call(
            d3.zoom().transform,
            d3.zoomIdentity
        );
        showDependencyStatus('Zoom reset!', 'info');
    }
}

function exportSVG() {
    if (!svg) {
        showDependencyStatus('No graph to export!', 'warning');
        return;
    }
    
    const svgData = new XMLSerializer().serializeToString(svg.node());
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dependency-graph.svg';
    link.click();
    
    URL.revokeObjectURL(url);
    showDependencyStatus('Graph exported as SVG!', 'success');
}

function showDependencyStatus(message, type) {
    const status = document.getElementById('dependencyStatus');
    status.className = `alert alert-${type}`;
    status.textContent = message;
    status.style.display = 'block';
    setTimeout(() => hideDependencyStatus(), 3000);
}

function hideDependencyStatus() {
    const status = document.getElementById('dependencyStatus');
    status.style.display = 'none';
}