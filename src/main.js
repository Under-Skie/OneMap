global.L = require('leaflet');

const url_satelite = 'map://47626774/{z}/{x}/{y}';
const glayer_satelite = new L.TileLayer(url_satelite, { minZoom: 3, maxZoom: 19, attribution: '卫星地图' });
const latlng = new L.latLng(426.0, 209.0);

let map = new L.Map('mainmap', { center: latlng, minZoom: 1, zoom: 3, layers: [glayer_satelite] });