const SVGJS = require('svg.js')
const svg = SVGJS('drawing').size(300, 300)
/*const rect = svg.rect(100, 100).attr({ fill: '#b07' })
const line = svg.line(10, 10, 290, 290).stroke({ width: 10, color: '#f06', linecap: 'round' })
const text = svg.text('Lorem ipsum dolor sit amet consectetur.\nCras sodales imperdiet auctor.')*/
window.frac = frac
window.svg = svg
frac(svg, 4, 4, 0, 0)

function frac(svg, nominator, denominator, inix, iniy) {
    svg.text(nominator.toString()).x(inix + 7).y(iniy)
    svg.text(denominator.toString()).x(inix + 7).y(iniy + 19)
    svg.line(inix + 2, iniy + 18, inix + 21, iniy + 18).stroke({ width: 1 })
}