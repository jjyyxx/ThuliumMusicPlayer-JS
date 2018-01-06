import { qysPlayer } from './qysPlayer'
let qysFileParser = require('qys_file_parser').qysFileParser

const Tone = require('tone')
window.Tone = Tone
window.qysPlayer = qysPlayer

const str = `//东方红
//陕北民歌
<1=F><2/4><90>
55_^6_|2-|11_^6,_|2-|55|6_^1'_6_5_|11_^6,_|2-|52|17,_^6,_|5,5|23_2_|11_^6,_|2_3_2_1_|2_^1_7,_^6,_|5,-^|5,0||`
const player = new qysPlayer(new qysFileParser(str).parse())
player.play()

/*let arr = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

for (var i = 0; i < 100; i++){
    let index = i % 7
    synth.triggerAttackRelease(`${arr[index]}3`, 0.25, 0.25 * i);
}*/