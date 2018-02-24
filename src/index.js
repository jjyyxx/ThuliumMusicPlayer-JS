import { defineLanguage, showEditor } from './editor'

window.require(['vs/editor/editor.main'], () => {
    defineLanguage()
    showEditor()
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
}
