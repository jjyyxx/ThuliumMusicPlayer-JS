import { Tokenizer, Note, MeasureBound, TokenType, SuffixType } from 'qys_file_parser'
import { TokenizedData } from 'qys_file_parser/dist/TokenizedData'
import { Global } from 'qys_file_parser/dist/Global'
import * as Vex from 'vexflow'
import { BaseToken } from 'qys_file_parser/dist/tokens/BaseToken'
import { Factory } from './Factory';
import { Tuplet } from 'qys_file_parser/dist/tokens/Tuplet';
import { Tremolo1 } from 'qys_file_parser/dist/tokens/Tremolo1';
import { Appoggiatura } from 'qys_file_parser/dist/tokens/Appoggiatura';
import { Section } from 'qys_file_parser/dist/tokens/Section';
import { GlobalSetting } from './GlobalSetting';
import { FunctionToken } from 'qys_file_parser/dist/tokens/Function';

const Dict = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

type Wrap = {
    index: number,
    type: TokenType,
    ori: BaseToken,
    result: any
}

class Context {
    public tokenizedData: TokenizedData
    public content: string
    public fileType: string
    public svg: HTMLElement
    public width: number = window.innerWidth
    private renderer: Vex.Flow.Renderer
    private context: Vex.IRenderContext
    private staves: Vex.Flow.Stave[] = []
    private x: number = 0

    constructor(content: string, fileType: string, id: string) {
        this.content = content
        this.fileType = fileType
        Global.CurrentFormat = fileType
        this.tokenizedData = new Tokenizer(this.content).tokenize()
        this.svg = document.getElementById(id)
    }

    public paint() {
        this.init()
        this.paintSection(this.tokenizedData.Sections[0])
    }

    private init() {
        this.renderer = new Vex.Flow.Renderer(this.svg, Vex.Flow.Renderer.Backends.SVG)
        this.context = this.renderer.getContext()
        this.renderer.resize(this.width, 200)
        this.context.setFont('Arial', 10, 1).setBackgroundFillStyle('#eed')
    }

    public paintSection(section: Section) {
        const globalSetting = new GlobalSetting()
        globalSetting.tokensUpdate(section.GlobalSettings)
        this.paintTrack(section.Tracks[0], globalSetting.extend())
    }

    public paintTrack(track: BaseToken[], globalSetting: GlobalSetting) {
        const { ties, beams, measures, tuplets } = this.preprocessTrack(track, globalSetting)
        measures.forEach((measure) => this.drawMeasure(measure))
        this.drawBeams(beams)
        this.drawTies(ties)
        this.drawTuplets(tuplets)
    }

    private preprocessTrack(track: BaseToken[], globalSetting: GlobalSetting) {
        let contextSetting = globalSetting
        const wraps = track.map<Wrap>((token, index) => {
            if (token.type === TokenType.Function) {
                contextSetting = contextSetting.extend()
                contextSetting.tokenUpdate(token as FunctionToken)
            }
            return {
                index,
                type: token.type,
                ori: token,
                setting: contextSetting,
                result: token.type === TokenType.Note ? Factory.makeStaveNote(token as Note, contextSetting) :
                    token.type === TokenType.Appoggiatura ? new Vex.Flow.GraceNoteGroup((token as Appoggiatura).Notes.map((note) => Factory.makeStaveNote(note, contextSetting, true)) as any) : undefined
            }
        })
        this.makeTies(wraps)
        this.makeTuplets(wraps)
        this.makeFermataTremoloAndGraceNote(wraps)
        return this.splitWrap(wraps)
    }

    private drawMeasure(measure: any[]) {
        const notes = measure.map((wrap) => wrap.result)
        const voice = new Vex.Flow.Voice({ num_beats: 2, beat_value: 4 })
        voice.addTickables(notes)
        Vex.Flow.Accidental.applyAccidentals([voice], Object.keys(Global.tonalityDict).find((key) => Global.tonalityDict[key] === measure[0].setting.Key))
        const formatter = new Vex.Flow.Formatter()
        console.log(voice.getTickables(), formatter.joinVoices([voice]).preCalculateMinTotalWidth([voice]))
        formatter.joinVoices([voice]).format([voice], 100)
        if (this.staves.length === 0) {
            this.addStave(180, { clef: 'treble', keySignature: 'F', timeSignature: '2/4' })
        } else {
            this.addStave(120)
        }
        voice.draw(this.context, this.staves[this.staves.length - 1])
    }

    private drawTies(ties: Vex.Flow.StaveTie[]) {
        ties.forEach((t) => t.setContext(this.context).draw())
    }

    private drawTuplets(tuplets: Vex.Flow.Tuplet[]) {
        tuplets.forEach((t) => t.setContext(this.context).draw())
    }

    private drawBeams(beams: Vex.Flow.Beam[][]) {
        beams.forEach(bs => bs.forEach((b) => b.setContext(this.context).draw()))
    }

    private splitWrap(wraps: Wrap[]) {
        const measures = wraps.filter((wrap) => wrap.type === TokenType.Note || wrap.type === TokenType.MeasureBound)
            .split((wrap) => wrap.type === TokenType.MeasureBound)
        const beams = measures.map((measure) => Vex.Flow.Beam.generateBeams(measure.map((wrap) => wrap.result)))
        const ties = wraps.filter((wrap) => wrap.type === TokenType.Tie || wrap.type === TokenType.Portamento).map((wrap) => wrap.result)
        const tuplets = wraps.filter((wrap) => wrap.type === TokenType.Tuplet).map((wrap) => wrap.result)
        return { measures, beams, ties, tuplets }
    }

    private makeTies(wraps: Wrap[]) {
        wraps.forEach((wrap, index, arr) => {
            if (wrap.type === TokenType.Tie || wrap.type === TokenType.Portamento) {
                let rightPointer = index + 1
                while (arr[rightPointer].type !== TokenType.Note) {
                    rightPointer += 1
                }
                let leftPointer = index - 1
                while (arr[leftPointer].type !== TokenType.Note) {
                    leftPointer -= 1
                }
                wrap.result = new Vex.Flow.StaveTie({
                    first_note: arr[leftPointer].result,
                    last_note: arr[rightPointer].result
                })
            }
        })
    }

    private makeTuplets(wraps: Wrap[]) {
        wraps.forEach((wrap, index, arr) => {
            if (wrap.type === TokenType.Tuplet) {
                let num = 0
                let rightPointer = index + 1
                let notes = []
                while (num < (wrap.ori as Tuplet).count) {
                    while (arr[rightPointer].type !== TokenType.Note) {
                        rightPointer += 1
                    }
                    notes.push(arr[rightPointer].result)
                    rightPointer += 1
                    num += 1
                }
                wrap.result = new Vex.Flow.Tuplet(notes)
            }
        })
    }

    private makeFermataTremoloAndGraceNote(wraps: Wrap[]) {
        wraps.forEach((wrap, index, arr) => {
            if (wrap.type === TokenType.Fermata || wrap.type === TokenType.Tremolo1 || wrap.type === TokenType.Appoggiatura) {
                let rightPointer = index + 1
                while (arr[rightPointer].type !== TokenType.Note) {
                    rightPointer += 1
                }
                if (wrap.type === TokenType.Fermata) {
                    (arr[rightPointer].result as Vex.Flow.StaveNote).addArticulation(0, new Vex.Flow.Articulation('a@a').setPosition(Vex.Flow.Modifier.Position.ABOVE))
                } else if (wrap.type === TokenType.Tremolo1) {
                    (arr[rightPointer].result as Vex.Flow.StaveNote).addArticulation(0, new Vex.Flow.Tremolo((wrap.ori as Tremolo1).StrokesCount))
                } else {
                    (arr[rightPointer].result as Vex.Flow.StaveNote).addModifier(0, wrap.result.beamNotes())
                }
            }
        })
    }

    private addStave(width: number, { clef = '', keySignature = '', timeSignature = '' } = {}) {
        const stave = new Vex.Flow.Stave(this.x, 40, width)
        this.x += width
        if (clef !== '') {
            stave.addClef(clef)
        }
        if (keySignature !== '') {
            stave.addKeySignature(keySignature)
        }
        if (timeSignature !== '') {
            stave.addTimeSignature(timeSignature)
        }
        stave.setContext(this.context).draw()
        this.staves.push(stave)
    }
}

export { Context }
