// Create the map
var map = L.map('map').setView([20, 0], 2);

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Function to determine marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 3;
}

// Function to determine marker color based on depth
function markerColor(depth) {
    return depth > 100 ? '#08306b' :
        depth > 70  ? '#08519c' :
        depth > 50  ? '#2171b5' :
        depth > 30  ? '#4292c6' :
        depth > 10  ? '#6baed6' :
                        '#9ecae1';
}

// Fetch earthquake data
axios.get('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson')
    .then(function (response) {
        var data = response.data;

        // Add earthquake markers to the map
        L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                return L.circleMarker(latlng, {
                    radius: markerSize(feature.properties.mag),
                    fillColor: markerColor(feature.geometry.coordinates[2]),
                    color: "#000",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: 0.8
                });
            },
            onEachFeature: function (feature, layer) {
                layer.bindPopup(
                    `<b>Location:</b> ${feature.properties.place}<br>
                    <b>Magnitude:</b> ${feature.properties.mag}<br>
                    <b>Depth:</b> ${feature.geometry.coordinates[2]} km<br>
                    <b>Date:</b> ${new Date(feature.properties.time)}`
                );
            }
        }).addTo(map);
    });