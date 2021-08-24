

const locations =JSON.parse( document.getElementById('map').dataset.locations)
mapboxgl.accessToken = 'pk.eyJ1IjoiaXNhbGFtYSIsImEiOiJja3NmZzhieXIxNHI2Mm5wMnczdTh4MjNoIn0.2cYwILDZRuEdT866N4n4xw';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/isalama/cksh0aevd4bl117ocxk6n9lql',
    scrollZoom:false
    // center: [-118.113491,34.111745],
    // zoom: 10,
    // interactive: false
})

const bounds = new mapboxgl.LngLatBounds()

locations.forEach(loc => {
    //add marker
    const el = document.createElement('div')
    el.className = 'marker'

    //add marker
    new mapboxgl.Marker({
        element:el,
        anchor:'bottom'
    }).setLngLat(loc.coordinates).addTo(map)
    // add popup
    new mapboxgl.Popup({
        offset:30
    }).setLngLat(loc.coordinates).setHTML(`<p>Day ${loc.day} : ${loc.description}</p>`).addTo(map)
    // extend map bounds to include current location
    bounds.extend(loc.coordinates,)
});

map.fitBounds(bounds,{
    padding:{
        top:200,
        bottom:150,
        left:100,
        right:100
    }
})