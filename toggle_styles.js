mapboxgl.accessToken = 'pk.eyJ1Ijoidm9ybWlyIiwiYSI6ImNrem81OGVtZTBhaWQydnFtdnZ1cGh2NnUifQ.nUvum4Lnw_0dQp60KQiWXQ';

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [0, 0],
    zoom: 1
})

map.on("load", () => {
    const layerList = document.getElementById('menu')
    const inputs = layerList.getElementsByTagName('input')

    function switchLayer(layer) {
        const layerId = layer.target.id
        map.setStyle("mapbox://styles/mapbox/" + layerId)
    }

    for (let i = 0; i < inputs.length; i++) {
        inputs[i].onclick = switchLayer
    }
})