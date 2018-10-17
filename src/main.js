global.L = require('leaflet');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// const ipcRenderer = require('electron').ipcRenderer;

const url_satelite = 'map://47626774/{z}/{x}/{y}';
// const url_normal = 'map://788865972/{z}/{x}/{y}';
// const glayer_normal = new L.TileLayer(url_normal, { minZoom: 3, maxZoom: 20 });
const abs = '技术支持：<a href="http://www.socialdatamax.com" target="_blank">聚微合智</a>';

function getFileWithExtensionName(dir, ext) {
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {
        if (path.extname(files[i]) === '.' + ext)
            return path.join(dir, files[i])
    }
}

const dbPath = getFileWithExtensionName(path.resolve(__dirname, '..', 'data'), 'sqlite')
const db = new sqlite3.Database(dbPath);

db.all('select * from Meta', function (error, results, fields) {
    let store = results[0];
    const glayer_satelite = new L.TileLayer(url_satelite, { minZoom: store.minZoom, maxZoom: store.maxZoom, attribution: abs });

    let center = JSON.parse(store.center);
    let maxBounds = JSON.parse(store.maxBounds)
    let map = new L.Map('mainmap', {center:center,maxBounds:maxBounds, minZoom: store.minZoom, maxZoom: store.maxZoom, zoom: store.minZoom, layers: [glayer_satelite] }); // attributionControl:false remove all attributions
    let attribution = map.attributionControl;
    attribution.setPrefix(false);

    // mainWindow.webContents.send('store-data', results[0]);
})
db.close()

// ipcRenderer.on('store-data', function (event, store) {

//     // map.setMaxBounds(JSON.parse(store.maxBounds));
//     // map.setMinZoom(store.minZoom);
//     // map.setMaxZoom(store.maxZoom);
//     // map.setView(JSON.parse(store.center));
// });


var shell = require('electron').shell;
//open links externally by default
document.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(event.target.href)
    }
})