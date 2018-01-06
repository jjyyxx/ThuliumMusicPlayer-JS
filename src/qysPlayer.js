import { BasePlayer } from './BasePlayer'

class qysPlayer extends BasePlayer {
    constructor(context) {
        super()
        this.context = context
        this.init()
    }

    init() {
        let { sections = [], /*ties = []*/ } = this.context
        const self = this
        let counter = 0
        sections.forEach(section => {
            let { setting = {}, sequence = [] } = section
            sequence.forEach(staffUnit => {
                let { pitch, beatCount, isMute } = staffUnit
                if (!isMute) {
                    let freq = qysPlayer.pitchToFrequency(pitch + setting.Key)
                    self.push({
                        time: counter,
                        freq,
                        beatCount
                    })
                }
                counter += beatCount
            })
        })
    }

    static pitchToFrequency(relativePitch) {
        return 440 * Math.pow(2, (relativePitch - 9) / 12)
    }
}

export { qysPlayer }
