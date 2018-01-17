import { Tokenizer, Note, MeasureBound, TokenType, SuffixType } from 'qys_file_parser'
import * as Vex from 'vexflow'

const str = `//东方红
//陕北民歌
<1=F><2/4><90>
55_^6_|2-|11_^6,_|2-|55|6_^1'_6_5_|11_^6,_|2-|52|17,_^6,_|5,5|23_2_|11_^6,_|2_3_2_1_|2_^1_7,_^6,_|5,-^|5,0||`
const tokenizedData = new Tokenizer(str).tokenize()
const VF = Vex.Flow
const div = document.getElementById('boo')
const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG)
renderer.resize(1800, 1800)
const context = renderer.getContext()
context.setFont('Arial', 10, 1).setBackgroundFillStyle('#eed')
var stave = new VF.Stave(10, 40, 1700);
stave.addClef("treble").addTimeSignature("2/4");
stave.setContext(context).draw();
const Dict = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

const Notes: Vex.Flow.Note[] = []
const NoteTokens = tokenizedData.Sections[0].Tracks[0].filter((token) => token.type === TokenType.Note || token.type === TokenType.MeasureBound) as Array<Note | MeasureBound>
for (const note of NoteTokens) {
    if (note instanceof Note) {
        let major = 4
        let flag = ''
        note.Pitches[0].Suffix.forEach((suffix) => {
            switch (suffix.suffixType) {
                case SuffixType.Flat:
                    flag += 'b'
                    break
                case SuffixType.Sharp:
                    flag += '#'
                    break
                case SuffixType.DotAbove:
                    major += 1
                    break
                case SuffixType.DotBelow:
                    major -= 1
                    break
            }
        })
        const sd = note.Pitches[0].ScaleDegree
        const key = (sd === 0 ? 'b' : Dict[sd - 1]) + flag + '/' + major.toString()
        let duration = 1
        note.Suffix.forEach((suffix) => {
            switch (suffix.suffixType) {
                case SuffixType.Dash:
                    duration += 1
                    break
                case SuffixType.DotAfter:
                    duration *= 2 - Math.pow(2, - suffix.dotCount)
                    break
                case SuffixType.Underline:
                    duration /= 2
                    break
            }
        })
        const staveNote = new VF.StaveNote({
            clef: "treble",
            keys: [key],
            duration: (4 / duration).toString() + (sd === 0 ? 'r' : '')
        })
        Notes.push(staveNote)
    } else {
        Notes.push(new VF.BarNote())
    }
}
var beams = VF.Beam.generateBeams(Notes as any);

VF.Formatter.FormatAndDraw(context, stave, Notes)
beams.forEach(function (b) { b.setContext(context).draw() })

const ties: Vex.Flow.StaveTie[] = [
    new Vex.Flow.StaveTie({
        first_note: Notes[1],
        last_note: Notes[2],
        first_indices: [0],
        last_indices: [0]
    }),
    new Vex.Flow.StaveTie({
        first_note: Notes[7],
        last_note: Notes[8],
        first_indices: [0],
        last_indices: [0]
    }),
    new Vex.Flow.StaveTie({
        first_note: Notes[15],
        last_note: Notes[16],
        first_indices: [0],
        last_indices: [0]
    }),
]

ties.forEach(function (t) { t.setContext(context).draw() })