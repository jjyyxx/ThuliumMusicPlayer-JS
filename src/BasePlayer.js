const Tone = require('tone')

class BasePlayer {
    constructor() {
        this.synth = new Tone.Synth()
        this.source = []
    }

    push(staff) {
        this.source.push(staff)
    }

    play() {
        this.connect()
        const self = this
        const part = new Tone.Part((time, { freq, beatCount }) => {
            self.synth.triggerAttackRelease(freq, beatCount, time, 1)
        }, this.source)
        part.humanize = true
        part.start('0')
        Tone.Transport.bpm.rampTo(180)
        Tone.Transport.start('0')
    }

    connect() {
        this.synth.toMaster()
    }

    disconnect() {
        this.synth.disconnect()
    }
}

export { BasePlayer }