importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "app.bundle.js",
    "revision": "b92610bb6b6bc77d78dfe254f302d964"
  },
  {
    "url": "favicon.ico",
    "revision": "6b6f1aa6df8c0ae6adc59b8a348bd4b0"
  },
  {
    "url": "index.html",
    "revision": "11a39638faac53666733bdcb283c606d"
  },
  {
    "url": "vs/base/worker/workerMain.js",
    "revision": "93cdf8019f17ddfdbcbc7d00fcb1a786"
  },
  {
    "url": "vs/basic-languages/src/bat.js",
    "revision": "e51f2cd80e0cd7ec1dcff4a90e684094"
  },
  {
    "url": "vs/basic-languages/src/coffee.js",
    "revision": "ed3bca6cd2700565f57c1a1dde618568"
  },
  {
    "url": "vs/basic-languages/src/cpp.js",
    "revision": "54bfcf0015c44907f5c2fb2196e1dd58"
  },
  {
    "url": "vs/basic-languages/src/csharp.js",
    "revision": "a7e1364b05b1876835b79dbc352ef325"
  },
  {
    "url": "vs/basic-languages/src/css.js",
    "revision": "a7b9d6e850a4349f9d14916194be041a"
  },
  {
    "url": "vs/basic-languages/src/dockerfile.js",
    "revision": "36fc3b44c33edc66bb38ceae042e56d2"
  },
  {
    "url": "vs/basic-languages/src/fsharp.js",
    "revision": "140e636ea1605cb9dc149aef82f433b1"
  },
  {
    "url": "vs/basic-languages/src/go.js",
    "revision": "2f7827643fb34c6b31db0de15bfb5faf"
  },
  {
    "url": "vs/basic-languages/src/handlebars.js",
    "revision": "a5bb8ec7e9ebe498f22e6574d52afd5d"
  },
  {
    "url": "vs/basic-languages/src/html.js",
    "revision": "b4ac31ee3c7fee961840dce71d2b4b0c"
  },
  {
    "url": "vs/basic-languages/src/ini.js",
    "revision": "7efdf6ef2739f4b764c819d10fe33346"
  },
  {
    "url": "vs/basic-languages/src/java.js",
    "revision": "865e1b3795015e91639c4b7c8eb4161a"
  },
  {
    "url": "vs/basic-languages/src/less.js",
    "revision": "606c56b2caef781ee79be92fa0ec73d0"
  },
  {
    "url": "vs/basic-languages/src/lua.js",
    "revision": "25ebf7b2bdaf938882802ce193f22f1b"
  },
  {
    "url": "vs/basic-languages/src/markdown.js",
    "revision": "e4ef9a583b4a9b184ba0cb46bbf29d8c"
  },
  {
    "url": "vs/basic-languages/src/msdax.js",
    "revision": "e486a9bf9d45fe031359a381d168d1c2"
  },
  {
    "url": "vs/basic-languages/src/objective-c.js",
    "revision": "aa7540b900b058ff3769e4c708c71d88"
  },
  {
    "url": "vs/basic-languages/src/php.js",
    "revision": "44242b01b7b7d982ec278f9af3469c10"
  },
  {
    "url": "vs/basic-languages/src/postiats.js",
    "revision": "b0ce479e2f34bc3a934881d42878dc9d"
  },
  {
    "url": "vs/basic-languages/src/powershell.js",
    "revision": "7784001d1ea6ebf755ce7a778aa1ece2"
  },
  {
    "url": "vs/basic-languages/src/pug.js",
    "revision": "653127a3f1af6b633b66910b3d020b7a"
  },
  {
    "url": "vs/basic-languages/src/python.js",
    "revision": "66f336259b4ac3e1afcf20350f6cbc85"
  },
  {
    "url": "vs/basic-languages/src/r.js",
    "revision": "68f2cd091513a7e8efbf6c836cfa3a01"
  },
  {
    "url": "vs/basic-languages/src/razor.js",
    "revision": "3d8fd5eca2c05e49e670f60b3696b37f"
  },
  {
    "url": "vs/basic-languages/src/ruby.js",
    "revision": "fdf1dfb0e84028e4494149e8709a10db"
  },
  {
    "url": "vs/basic-languages/src/sb.js",
    "revision": "4a922f1aae92304528d92ecf20705c7e"
  },
  {
    "url": "vs/basic-languages/src/scss.js",
    "revision": "1489d414500bf1e3187fc31981849404"
  },
  {
    "url": "vs/basic-languages/src/solidity.js",
    "revision": "ae00d1fca04371d175c4b6bce9d7d2f1"
  },
  {
    "url": "vs/basic-languages/src/sql.js",
    "revision": "85a85b94c90bcb4740cd9e731b4903a5"
  },
  {
    "url": "vs/basic-languages/src/swift.js",
    "revision": "e316b6013d070ad64076b6ef793cd276"
  },
  {
    "url": "vs/basic-languages/src/vb.js",
    "revision": "7814472a1bdcdf3a8a3ae49d091f7fb2"
  },
  {
    "url": "vs/basic-languages/src/xml.js",
    "revision": "29542b689cfc3091cc86027a3e2adb09"
  },
  {
    "url": "vs/basic-languages/src/yaml.js",
    "revision": "b4f1fd85a61b500c905e4a1a656e764b"
  },
  {
    "url": "vs/editor/editor.main.css",
    "revision": "ad44f47d754a4d6cc7389b05fc37a508"
  },
  {
    "url": "vs/editor/editor.main.js",
    "revision": "3a82940062c2a1874398c094a6e60dde"
  },
  {
    "url": "vs/editor/editor.main.nls.de.js",
    "revision": "4019650a865961530de6e171a5a44c85"
  },
  {
    "url": "vs/editor/editor.main.nls.es.js",
    "revision": "bca78689da6bf40a1d67326898fb88a3"
  },
  {
    "url": "vs/editor/editor.main.nls.fr.js",
    "revision": "4cf5f1adcf63ca2472cb66e40e2c8baf"
  },
  {
    "url": "vs/editor/editor.main.nls.hu.js",
    "revision": "9308e02b6c62b43386e75306d78a4a36"
  },
  {
    "url": "vs/editor/editor.main.nls.it.js",
    "revision": "4acb3ff02176e79df6ab573eea3e8185"
  },
  {
    "url": "vs/editor/editor.main.nls.ja.js",
    "revision": "17922fedcf1e6ed0134b3ee94b0a0962"
  },
  {
    "url": "vs/editor/editor.main.nls.js",
    "revision": "f490fab3eb9c793b20f99db9b6e48d95"
  },
  {
    "url": "vs/editor/editor.main.nls.ko.js",
    "revision": "6be4c0e0eb005bce674dbbdb8e7a7e38"
  },
  {
    "url": "vs/editor/editor.main.nls.pt-br.js",
    "revision": "5bd4e381e481dd824f04985295b40eb2"
  },
  {
    "url": "vs/editor/editor.main.nls.ru.js",
    "revision": "c3f5724ee2fbff5e8f3b5f2ccac4a7e8"
  },
  {
    "url": "vs/editor/editor.main.nls.tr.js",
    "revision": "ce8907e3f4fd52bc74620c26e264c78c"
  },
  {
    "url": "vs/editor/editor.main.nls.zh-cn.js",
    "revision": "9d9f318a1e6852ff0c2c4bd8a09cc6e9"
  },
  {
    "url": "vs/editor/editor.main.nls.zh-tw.js",
    "revision": "12127046be5ba373438d9141f25205f3"
  },
  {
    "url": "vs/language/css/cssMode.js",
    "revision": "40f15898b7a09b6fb6b260d7c1dd3f56"
  },
  {
    "url": "vs/language/css/cssWorker.js",
    "revision": "5b7f6412ba66802576e4ac4eb504bdbb"
  },
  {
    "url": "vs/language/html/htmlMode.js",
    "revision": "001e24dec3cf105d1e099316c83a5632"
  },
  {
    "url": "vs/language/html/htmlWorker.js",
    "revision": "f065b0b4b1a6c1919bc3370d249df808"
  },
  {
    "url": "vs/language/json/jsonMode.js",
    "revision": "4a3dab54b23af097e9e414100867200e"
  },
  {
    "url": "vs/language/json/jsonWorker.js",
    "revision": "4dcceaade2ef2a37ea5b3f6883f5fe95"
  },
  {
    "url": "vs/language/typescript/lib/typescriptServices.js",
    "revision": "517e6ef05aa497f98e19d6c03a9879dc"
  },
  {
    "url": "vs/language/typescript/src/mode.js",
    "revision": "d96c89a5dacbac90292dcb9502217398"
  },
  {
    "url": "vs/language/typescript/src/worker.js",
    "revision": "d929d97d845eebf18fb20f4f55a9ca49"
  },
  {
    "url": "vs/loader.js",
    "revision": "c8164365b9ce6609cb37358a167fb342"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
