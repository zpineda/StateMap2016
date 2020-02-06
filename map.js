//this code controls the map
//include mapbox accessToken and style
//Here, first, you setup your access token and then you create a map variable that creates the map and sets its basic characteristics:
    //What div it is in
    //The style to use
    //The starting zoom level
    //And the starting coordinates.

mapboxgl.accessToken = 'pk.eyJ1IjoienBpbmVkYSIsImEiOiJjazVkMnd6NTQxc2NlM2RvM2E3cHI3OGZuIn0.V4UovUJneRqHb7f4AS_hoA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/zpineda/ck6711kqj0q0h1iqf9ee1yq5m',
    zoom: 3,
    maxZoom: 9,
    minZoom: 3.5,
    center: [-99, 38],
    maxBounds: [[-180, 15], [-30, 72]]
});

map.on('load', function(){
    var layers = map.getStyle().layers;
    var firstSymbolId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol') {
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': 'us_states_elections',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/StateElectionData.geojson'
        },
        'paint': {
            'fill-color': [
                'match', ['get', 'Winner'],
                'Trump', '#cf635d',
                'Clinton', '#6193c7',
                'Other', '#91b66e',
                '#ffffff'
            ],
            'fill-outline-color': '#000000',
            'fill-opacity': [
                'step', ['get', 'WnrPerc'],
                0.3, 0.4,
                0.5, 0.5,
                0.7, 0.6,
                0.9
            ]
        },
        'maxzoom': 6
    }, firstSymbolId);
    map.addLayer({
        'id': 'us_states_elections_outline',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': 'data/StateElectionData.geojson'
        },
        'paint':{
            'line-color': '#ffffff',
            'line-width': ['interpolate', ['exponential', 2], ['zoom'], 3, 0.5, 7, 3]
        }
    }, firstSymbolId);
    map.addLayer({
        'id': 'us_counties_elections',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'large/CountyElectionData.geojson'
        },
        'paint': {
            'fill-color': [
                'match', ['get', 'Winner'],
                'Trump', '#cf635d',
                'Clinton', '#6193c7',
                'Other', '#91b66e',
                '#ffffff'
            ],
            'fill-outline-color': '#000000',
            'fill-opacity': [
                'step', ['get', 'WnrPerc'],
                0.3, 0.4,
                0.5, 0.5,
                0.7, 0.6,
                0.9
            ]
        },
        'minzoom': 6
    }, 'us_states_elections');
    map.addLayer({
        'id': 'us_counties_elections_outline',
        'type': 'line',
        'source': {
            'type': 'geojson',
            'data': 'large/CountyElectionData.geojson'
        },
        'paint': {
            'line-color': '#ffffff',
            'line-width': ['interpolate', ['exponential', 2], ['zoom'], 6, 0.5, 9, 1]
        },
        'minzoom': 6
    }, 'us_states_elections');
});

// Create the popup
map.on('click', 'us_states_elections', function (e) {
    var stateName = e.features[0].properties.NAME;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>'+stateName+'</h4>'
            +'<h2>'+winner+'</h2>'
            + '<p>'+wnrPerc+'% - ('+totalVotes+' votes)</p>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the us_states_elections layer.
map.on('mouseenter', 'us_states_elections', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'us_states_elections', function () {
    map.getCanvas().style.cursor = '';
});

map.on('click', 'us_counties_elections', function (e) {
    var stateName = e.features[0].properties.State;
    var countyName = e.features[0].properties.NAMELSAD;
    var winner = e.features[0].properties.Winner;
    var wnrPerc = e.features[0].properties.WnrPerc;
    var totalVotes = e.features[0].properties.Total;
    wnrPerc = (wnrPerc * 100).toFixed(0);
    totalVotes = totalVotes.toLocaleString();
    stateName = stateName.toUpperCase();
    countyName = countyName.toUpperCase();
    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + countyName + ' - ' + stateName + '</h4>'
            + '<h2>' + winner + '</h2>'
            + '<p>' + wnrPerc + '% - (' + totalVotes + ' votes)</p>')
        .addTo(map);
});
map.on('mouseenter', 'us_counties_elections', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'us_counties_elections', function () {
    map.getCanvas().style.cursor = '';
});
//make map full screen
map.addControl(new mapboxgl.FullscreenControl({container: document.querySelector('body')}));

