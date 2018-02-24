import { Tokenizer } from 'smml-tokenizer-js'
import * as waf from 'webaudiofont'
import { Parser, MIDIAdapter } from 'qingyun-musicplayer-parser'
import { audioLibDir, defaultInstr, drumDict, instrDict } from './config'

window.fonts = window.fonts || {}

function audioLibFile(instr) {
    if (instr === '') {
        instr = defaultInstr
    }
    if (instr in instrDict) {
        return audioLibDir + ('00' + instrDict[instr].toString()).slice(-3) + '0_FluidR3_GM_sf2_file.json'
    } else {
        return audioLibDir + '128' + drumDict[instr].toString() + '_0_FluidR3_GM_sf2_file.json'
    }
}

function audioLibVar(instr) {
    if (instr === '') {
        instr = defaultInstr
    }
    if (instr in instrDict) {
        return '_tone_' + ('00' + instrDict[instr].toString()).slice(-3) + '0_FluidR3_GM_sf2_file'
    } else {
        return '_drum_' + drumDict[instr].toString() + '_0_FluidR3_GM_sf2_file'
    }
}

export class Player {
    constructor(value) {
        this.value = value
        this.tracks = new Parser(new Tokenizer(value).tokenize(), new MIDIAdapter()).parse()
        this.ctx = new AudioContext()
        this.player = new waf.Player()
        this.status = 0
    }

    play() {
        if (status === 1) {
            return
        }
        this.status = 1
        const instrNames = this.tracks.map((track) => track.Instrument)
        Promise.all(instrNames.map((instr) => this.player.loader.load(this.ctx, audioLibFile(instr), audioLibVar(instr)))).then(
            (instrs) => {
                const initialTime = this.ctx.currentTime
                for (var i = 0, tracksLength = this.tracks.length; i < tracksLength; i++) {
                    const content = this.tracks[i].Content
                    for (var j = 0, contentLength = content.length; j < contentLength; j++) {
                        if (content[j].Type === 'Note') {
                            this.player.queueWaveTable(
                                this.ctx,
                                this.ctx.destination,
                                window.fonts[instrs[i]],
                                content[j].StartTime + initialTime,
                                ((content[j].Pitch === null) ? (drumDict[this.tracks[i].Instrument]) : (content[j].Pitch + 60)),
                                content[j].Duration,
                                content[j].Volume
                            )
                        }
                    }
                }
            }
        )
    }

    suspend() {
        if (this.status === 2) {
            return
        }
        this.status = 2
        this.ctx.suspend()
    }

    resume() {
        if (status === 1) {
            return
        }
        this.status = 1
        this.ctx.resume()
    }

    close() {
        if (this.status === 3) {
            return
        }
        this.status = 3
        this.ctx.close()
    }

    toggle() {
        switch (this.status) {
        case 0:
            this.play()
            break
        case 1:
            this.suspend()
            break
        case 2:
            this.resume()
        }
    }
}