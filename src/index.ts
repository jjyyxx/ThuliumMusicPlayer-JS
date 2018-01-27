import { Context } from './Context'
import './Util'

/*import * as monaco from '@timkendrick/monaco-editor';

monaco.editor.create();*/

const text = (document.getElementById('text')) as HTMLTextAreaElement
document.getElementById('submit').onclick = function (e) {
    const str = text.value
    new Context(str, 'qym', 'boo').paint()
}

/*const str = `//潜海姑娘
//王立平 曲
<1=C><4/4><90>
{ElectricGuitar}3--5_^6_|33_^2_1.3_|2_.^3__2_1_6,^6,__^1__^2__^1__|2--5,|

{ElectricGuitar}3--5_^6_|33_^2_1.3_|2_.^3__2_1_5,.^2_|1--3__^5__^6__^5__|

{ElectricGuitar}6--1'_^6_|5.^3_53_^5_|6-1'^6_^3_|2--5,|

{ElectricGuitar}3--5_^6_|3_0_3_^2_1.3_|2_^3_2_^1_6,6,__^1__^2__^1__|2--2_3_|

{ElectricGuitar}53_^1'_5_^6_6_5_|33_^2_1.3_|2_.^3__2_1_5,.^2_|1--^1_3_|

{ElectricGuitar}2_.^3__2_1_5,.^2_||`

new Context(str, 'qym', 'boo').paint()*/