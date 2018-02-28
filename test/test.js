const tok = require('../src/tokenizer/Tokenizer')
const par = require('../src/parser/Parser')

const res = new tok('<Piano>Trace(2)12%%').tokenize()
const pa = new par(res).parse()
pa