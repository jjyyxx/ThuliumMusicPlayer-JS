interface Array<T> {
    split(callbackfn: (element: T) => boolean): T[][]
}

Array.prototype.split = function (callbackfn) {
    let pointer = 0
    let length = this.length
    let prev = -1
    const result = []
    while (pointer < this.length) {
        if (callbackfn(this[pointer])) {
            result.push(this.slice(prev + 1, pointer))
            prev = pointer
        }
        pointer += 1
    }
    return result
}