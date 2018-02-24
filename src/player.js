import { Tokenizer } from 'smml-tokenizer-js'
import { Player } from 'webaudiofont'
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

export function play(result) {
    const tracks = new Parser(new Tokenizer(result).tokenize(), new MIDIAdapter()).parse()
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const player = new Player()
    const instrNames = tracks.map((track) => track.Instrument)
    Promise.all(instrNames.map((instr) => player.loader.load(audioCtx, audioLibFile(instr), audioLibVar(instr)))).then(
        (instrs) => {
            const initialTime = audioCtx.currentTime
            for (var i = 0, tracksLength = tracks.length; i < tracksLength; i++) {
                const content = tracks[i].Content
                for (var j = 0, contentLength = content.length; j < contentLength; j++) {
                    if (content[j].Type === 'Note') {
                        player.queueWaveTable(
                            audioCtx,
                            audioCtx.destination,
                            window.fonts[instrs[i]],
                            content[j].StartTime + initialTime,
                            ((content[j].Pitch === null) ? (drumDict[tracks[i].Instrument]) : (content[j].Pitch + 60)),
                            content[j].Duration,
                            content[j].Volume
                        )
                    }
                }
            }
        }
    )
}