const { parse } = require ('ansicolor')

function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const convertAnsiLogsToCssLines = (logLines) => {
    return logLines.map(logLine => {
        const parsed = parse(logLine);
        const spans =  parsed.spans.map((span) => {
            return span.css? `<span style="${span.css}">${escapeHtml(span.text)}"</span>`: `<span>${escapeHtml(span.text)}</span>`
        })
        return spans.join('')
    }).join('<br>')
}

module.exports = {
    convertAnsiLogsToCssLines
}