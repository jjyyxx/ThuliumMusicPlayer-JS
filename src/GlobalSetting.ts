import { FunctionToken } from "qys_file_parser/dist/tokens/Function";

class GlobalSetting {
    public Key: number
    public Bar: number
    public Beat: number
    public Speed: number
    public Volume: number
    public Instr: string
    public Stac: number
    public Port: number
    public Appo: number
    public Dur: number
    public Oct: number
    public FadeIn: number
    public FadeOut: number

    constructor({
        Key = 0,
        Bar = 4,
        Beat = 4,
        Speed = 90,
        Volume = 1.0,
        Instr = 'Piano',
        Stac = 1 / 2,
        Port = 6,
        Appo = 1 / 4,
        Dur = 0,
        Oct = 0,
        FadeIn = 2,
        FadeOut = 2,
    } = {}) {
        this.Key = Key
        this.Bar = Bar
        this.Beat = Beat
        this.Speed = Speed
        this.Volume = Volume
        this.Instr = Instr
        this.Stac = Stac
        this.Port = Port
        this.Appo = Appo
        this.Dur = Dur
        this.Oct = Oct
        this.FadeIn = FadeIn
        this.FadeOut = FadeOut
    }

    public extend(settingObj = {}): GlobalSetting {
        const newSetting = new GlobalSetting()
        Object.assign(newSetting, this, settingObj)
        return newSetting
    }

    public update(settingObj: object) {
        Object.assign(this, settingObj)
    }

    public tokenUpdate(funcToken: FunctionToken) {
        this.update(funcToken.Argument)
    }

    public tokensUpdate(funcTokens: FunctionToken[]) {
        funcTokens.forEach((funcToken) => this.tokenUpdate(funcToken))
    }
}

export { GlobalSetting }