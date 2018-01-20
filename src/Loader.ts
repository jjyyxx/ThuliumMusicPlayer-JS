class Loader {
    public name: string
    public type: string
    
    constructor(content: string | File | URL, fileType?: string) {
        if (content instanceof File) {
            this.loadFile(content)
        }
    }

    private loadFile(file: File) {
        const fileName = file.name
        const { name, extension } = this.getNameAndExtension(fileName)
        this.name = name
        this.type = extension
        file
    }

    private getNameAndExtension(fileName: string): { name: string, extension: string } {
        if (fileName.includes('.')) {
            const index = fileName.lastIndexOf('.')
            return {
                name: fileName.slice(0, index),
                extension: fileName.slice(index + 1)
            }
        } else {
            return {
                name: fileName,
                extension: undefined
            }
        }
    }
}