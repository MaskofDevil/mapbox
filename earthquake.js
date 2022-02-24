mapboxgl.accessToken = 'pk.eyJ1Ijoidm9ybWlyIiwiYSI6ImNrem81OGVtZTBhaWQydnFtdnZ1cGh2NnUifQ.nUvum4Lnw_0dQp60KQiWXQ';
const map = new mapboxgl.Map({
    container: 'map', // Specify the container ID
    style: 'mapbox://styles/vormir/ckzo5g2rg002l15r0jsz86gsz', // Specify which map style to use
    center: [-122.44121, 37.76132], // Specify the starting position [lng, lat]
    zoom: 3.5 // Specify the starting zoom
});

const magDisplay = document.getElementById('mag');
const locDisplay = document.getElementById('loc');
const dateDisplay = document.getElementById('date');

const today = new Date();
// Use JavaScript to get the date a week ago
const priorDate = new Date().setDate(today.getDate() - 7);
// Set that to an ISO8601 timestamp as required by the USGS earthquake API
const priorDateTs = new Date(priorDate);
const sevenDaysAgo = priorDateTs.toISOString();

map.on('load', () => {
    map.addSource('earthquakes', {
        type: 'geojson',
        data: `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&eventtype=earthquake&minmagnitude=1&starttime=${sevenDaysAgo}`,
        generateId: true // This ensures that all features have unique IDs
    });
    map.addLayer({
        id: 'earthquakes-viz',
        type: 'circle',
        source: 'earthquakes',
        paint: {
            // The feature-state dependent circle-radius expression will render
            // the radius size according to its magnitude when
            // a feature's hover state is set to true
            'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    1,
                    8,
                    1.5,
                    10,
                    2,
                    12,
                    2.5,
                    14,
                    3,
                    16,
                    3.5,
                    18,
                    4.5,
                    20,
                    6.5,
                    22,
                    8.5,
                    24,
                    10.5,
                    26
                ],
                5
            ],
            // The feature-state dependent circle-color expression will render
            // the color according to its magnitude when
            // a feature's hover state is set to true
            'circle-color': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                [
                    'interpolate',
                    ['linear'],
                    ['get', 'mag'],
                    1,
                    '#fff7ec',
                    1.5,
                    '#fee8c8',
                    2,
                    '#fdd49e',
                    2.5,
                    '#fdbb84',
                    3,
                    '#fc8d59',
                    3.5,
                    '#ef6548',
                    4.5,
                    '#d7301f',
                    6.5,
                    '#b30000',
                    8.5,
                    '#7f0000',
                    10.5,
                    '#000'
                ],
                '#fc691d'
            ]
        }
    });
});

let quakeID = null;

map.on('mousemove', 'earthquakes-viz', (event) => {
    map.getCanvas().style.cursor = 'pointer';
    // Set constants equal to the current feature's magnitude, location, and time
    const quakeMagnitude = event.features[0].properties.mag;
    const quakeLocation = event.features[0].properties.place;
    const quakeDate = new Date(event.features[0].properties.time);

    // Check whether features exist
    if (event.features.length === 0) return;
    // Display the magnitude, location, and time in the sidebar
    magDisplay.textContent = quakeMagnitude;
    locDisplay.textContent = quakeLocation;
    dateDisplay.textContent = quakeDate;

    // If quakeID for the hovered feature is not null,
    // use removeFeatureState to reset to the default behavior
    if (quakeID) {
        map.removeFeatureState({
            source: 'earthquakes',
            id: quakeID
        });
    }

    quakeID = event.features[0].id;

    // When the mouse moves over the earthquakes-viz layer, update the
    // feature state for the feature under the mouse
    map.setFeatureState(
        {
            source: 'earthquakes',
            id: quakeID
        },
        {
            hover: true
        }
    );
});

map.on('mouseleave', 'earthquakes-viz', () => {
    if (quakeID) {
        map.setFeatureState(
            {
                source: 'earthquakes',
                id: quakeID
            },
            {
                hover: false
            }
        );
    }

    quakeID = null;
    // Remove the information from the previously hovered feature from the sidebar
    magDisplay.textContent = '';
    locDisplay.textContent = '';
    dateDisplay.textContent = '';
    // Reset the cursor style
    map.getCanvas().style.cursor = '';
});