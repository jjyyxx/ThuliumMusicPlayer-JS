let Tokenizer = require('qys_file_parser').Tokenizer
const str = `//东方红
//陕北民歌
<1=F><2/4><90>
55_^6_|2-|11_^6,_|2-|55|6_^1'_6_5_|11_^6,_|2-|52|17,_^6,_|5,5|23_2_|11_^6,_|2_3_2_1_|2_^1_7,_^6,_|5,-^|5,0||`
const tokenizedData = new Tokenizer(str).tokenize()

const Vex = require('vexflow')
const VF = Vex.Flow

var div = document.getElementById('boo')
var renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)

// Configure the rendering context.
renderer.resize(500, 500)
var context = renderer.getContext()
context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed')

var stave = new VF.Stave(10, 40, 400)

// Add a clef and time signature.
stave.addClef('treble').addTimeSignature('4/4')

// Connect it to the rendering context and draw!
stave.setContext(context).draw()