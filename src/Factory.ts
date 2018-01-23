import { Note, SuffixType } from "qys_file_parser"
import { Suffix } from "qys_file_parser/dist/tokens/Suffix"
import { Pitch } from "qys_file_parser/dist/tokens/Pitch"
import * as Vex from 'vexflow'
import { GlobalSetting } from "./GlobalSetting";
import { Global } from "qys_file_parser/dist/Global";

const Dict = ['c', 'd', 'e', 'f', 'g', 'a', 'b']

export class Factory {
    static makeStaveNote(note: Note, setting: GlobalSetting, grace = false) {
        const ContextNote = grace ? Vex.Flow.GraceNote : Vex.Flow.StaveNote
        Factory.mergePitch(note)
        let scaleDegree: number
        let keys: string[]
        let suffix = ''
        if (note.Pitches[0].ScaleDegree === 0) {
            keys = ['b/4']
            suffix = 'r'
        } else if (note.Pitches[0].ScaleDegree === 8) { 
            keys = ['f/4']
            suffix = 'm'
        }
        else {
            keys = note.Pitches.map((pitch) => {
                const { flag, octave, scaleDegree } = Factory.calcPitch(pitch, setting)
                const flagString = flag === 0 ? '' : flag > 0 ? '#'.repeat(flag) : 'b'.repeat(-flag)
                const key = Dict[scaleDegree - 1] + flagString + '/' + octave.toString()
                return key
                // FIXME: deal with key and octave function
            })
        }
        if (Factory.isLegalDuration(note)) {
            return new ContextNote({
                clef: "treble",
                keys,
                duration: Factory.getLegalDuration(note) + suffix
            })
        } else {
            console.warn(`Illegal duration ${note.toString}`)
            const durs = Factory.getFallbackDuration(note)
            return durs.map((dur) =>
                new ContextNote({
                    clef: "treble",
                    keys,
                    duration: dur + suffix
                })
            )
        }
    }

    static mergePitch(note: Note) {
        note.Pitches.forEach((pitch) =>
            pitch.Suffix.push(...note.Suffix.filter((suffix) => Factory.isPitchSuffix(suffix))))
    }

    static isPitchSuffix(suffix: Suffix) {
        return (suffix.suffixType === SuffixType.DotAbove)
            || (suffix.suffixType === SuffixType.DotBelow)
            || (suffix.suffixType === SuffixType.Sharp)
            || (suffix.suffixType === SuffixType.Flat)
    }

    static isLegalDuration(note: Note) {
        const length = note.Suffix.length
        let DorU = undefined    // 0-d 1-u
        let dotAppeared = false
        for (let i = 0; i < length; i++) {
            if (note.Suffix[i].suffixType === SuffixType.Dash) {
                if (DorU === 1 || dotAppeared) {
                    return false
                }
                DorU = 0
            }
            if (note.Suffix[i].suffixType === SuffixType.Underline) {
                if (DorU === 0 || dotAppeared) {
                    return false
                }
                DorU = 1
            }
            if (note.Suffix[i].suffixType === SuffixType.DotAfter) {
                dotAppeared = true
            }
        }
        return true
    }

    static getLegalDuration(note: Note) {
        if (note.Suffix.length > 0) {
            const last = note.Suffix[note.Suffix.length - 1]
            if (last.suffixType === SuffixType.DotAfter) {
                return (4 / Factory.calcDuration(note.Suffix.slice(0, -1))).toString() + 'd'.repeat(last.dotCount)
            } else if (note.Suffix[0].suffixType === SuffixType.Underline) {
                return (4 / Factory.calcDuration(note.Suffix)).toString()
            } else {
                const dur = Factory.calcDuration(note.Suffix)
                return dur === 3 ? '2d' : (4 / dur).toString()  //TODO: support 1/2 FIXME: support beat except 4
            }
        } else {
            return '4'
        }
    }

    static getFallbackDuration(note: Note) {
        const dur = Factory.calcDuration(note.Suffix)
        const intPart = Math.floor(dur)
        const resultArray: string[] = []
        switch (intPart) {
            case 1:
                resultArray.push('4')
                break
            case 2:
                resultArray.push('2')
                break
            case 3:
                resultArray.push('2d')
                break
            case 4:
                resultArray.push('1')
                break
        }
        const decimalPart = (dur % 1).toString(2)
        const length = decimalPart.length
        for (let i = 2; i < length; i++) {
            if (decimalPart[i] === '1') {
                resultArray.push((2 << i).toString())
            }
        }
        return resultArray
    }

    static calcDuration(suffixes: Suffix[]) {
        let duration: number = 1
        suffixes.forEach((suffix) => {
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
        return duration
    }

    static calcPitch(pitch: Pitch, setting: GlobalSetting) {
        let octave = 4
        let flag = 0
        let scaleDegree = pitch.ScaleDegree
        pitch.Suffix.forEach((suffix) => {
            switch (suffix.suffixType) {
                case SuffixType.Flat:
                    flag -= 1
                    break
                case SuffixType.Sharp:
                    flag += 1
                    break
                case SuffixType.DotAbove:
                    octave += 1
                    break
                case SuffixType.DotBelow:
                    octave -= 1
                    break
            }
        })
        let num = octave * 12 + flag + Global.pitchDict[scaleDegree] + setting.Key
        const remain = num % 12
        octave = (num - remain) / 12
        scaleDegree = [0,2,4,5,7,9,11].indexOf(remain) + 1
        flag = 0
        if (scaleDegree === 0) {
            flag = 1
            scaleDegree = [0,2,4,5,7,9,11].indexOf(remain - 1) + 1
        }
        return { octave, flag, scaleDegree }
    }
}