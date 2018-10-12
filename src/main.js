global.L = require('leaflet');

const url_satelite = 'map://47626774/{z}/{x}/{y}';
const glayer_satelite = new L.TileLayer(url_satelite, { minZoom: 3, maxZoom: 19, attribution: '技术支持：<a href="http://www.socialdatamax.com" target="_blank">聚微合智</a>' });
const latlng = new L.latLng(426.0, 209.0);

let map = new L.Map('mainmap', { center: latlng, minZoom: 1, zoom: 3, layers: [glayer_satelite] }); // attributionControl:false remove all attributions
let attribution = map.attributionControl;
attribution.setPrefix(false);

var shell = require('electron').shell;
//open links externally by default
document.addEventListener('click', function (event) {
    if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
        event.preventDefault()
        shell.openExternal(event.target.href)
    }
})