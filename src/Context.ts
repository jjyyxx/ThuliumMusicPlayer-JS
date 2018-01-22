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
    public height: number = window.innerHeight
    private renderer: Vex.Flow.Renderer
    private context: Vex.IRenderContext
    private staves: Vex.Flow.Stave[] = []
    private x: number = 20
    private y: number = 40

    constructor(content: string, fileType: string, id: string) {
        this.content = content
        this.fileType = fileType
        Global.CurrentFormat = fileType
        this.tokenizedData = new Tokenizer(this.content).tokenize()
        this.svg = document.getElementById(id)
    }

    public paint() {
        this.init()
        this.tokenizedData.Sections.forEach(section => this.paintSection(section))
    }

    private init() {
        this.renderer = new Vex.Flow.Renderer(this.svg, Vex.Flow.Renderer.Backends.SVG)
        this.context = this.renderer.getContext()
        this.renderer.resize(this.width, this.height)
        this.context.setFont('Arial', 10, 1).setBackgroundFillStyle('#eed')
    }

    public paintSection(section: Section) {
        const globalSetting = new GlobalSetting()
        globalSetting.tokensUpdate(section.GlobalSettings)
        const length = section.Tracks.length
        const allTies = []
        const allBeams = []
        const allMeasures = []
        const allTuplets = []

        for (let i = 0; i < length; i++) {
            const { ties, beams, measures, tuplets } = this.preprocessTrack(section.Tracks[i], globalSetting.extend())
            allTies.push(ties)
            allBeams.push(beams)
            allMeasures.push(measures)
            allTuplets.push(tuplets)
        }

        const trackLength = allMeasures[0].length

        for (let i = 0; i < trackLength; i++) {
            this.drawMeasures(allMeasures.map((track) => track[i]), i === 0)
        }
        for (let i = 0; i < length; i++) {
            this.drawBeams(allBeams[i])
            this.drawTies(allTies[i])
            this.drawTuplets(allTuplets[i])
        }

        this.y += length * 100
        this.x = 20
    }

    /*public paintTrack(track: BaseToken[], globalSetting: GlobalSetting) {
        measures.forEach((measure) => this.drawMeasure(measure))
        this.drawBeams(beams)
        this.drawTies(ties)
        this.drawTuplets(tuplets)
    }*/

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

    private drawMeasures(measures: any[][], first: boolean) {
        const voices = measures.map((measure) => {
            const notes = measure.map((wrap) => wrap.result)
            const voice = new Vex.Flow.Voice({ num_beats: measure[0].setting.Bar, beat_value: measure[0].setting.Beat })
            voice.addTickables(notes)
            Vex.Flow.Accidental.applyAccidentals([voice], Object.keys(Global.tonalityDict).find((key) => Global.tonalityDict[key] === measure[0].setting.Key))
            return voice
        })
        const formatter = new Vex.Flow.Formatter()
        formatter.joinVoices(voices).format(voices, 100)
        if (first) {
            const length = voices.length
            const staves = []
            for (let i = 0; i < length; i++) {
                const stave = this.addStave(150, 100 * i, i === length - 1, { clef: 'treble', keySignature: measures[i][0].setting.KeySignature, timeSignature: measures[i][0].setting.TimeSignature })
                voices[i].draw(this.context, stave)
                staves.push(stave)
            }
            if (measures.length > 1) {
                const con = new Vex.Flow.StaveConnector(staves[0], staves[length - 1])
                con.setType(Vex.Flow.StaveConnector.type.BRACKET)
                con.setContext(this.context).draw()
            }
        } else {
            const length = voices.length
            for (let i = 0; i < length; i++) {
                const stave = this.addStave(150, 100 * i, i === length - 1)
                voices[i].draw(this.context, stave)
            }
        }
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

    private addStave(width: number, y: number, offset: boolean, { clef = '', keySignature = '', timeSignature = '' } = {}) {
        width += (clef === '' ? 0 : 60)
        const stave = new Vex.Flow.Stave(this.x, this.y + y, width)
        this.x += offset ? width : 0
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
        return stave
    }
}

export { Context }
