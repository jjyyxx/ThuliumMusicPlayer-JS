import { defineLanguage, showEditor } from './editor'

window.require.config({ paths: { 'vs': 'vs' } })
window.require(['vs/editor/editor.main'], function () {
    defineLanguage()
    showEditor()
})

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(registration => {
        console.log('SW registered: ', registration)
    }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
    })
}

