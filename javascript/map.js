document.addEventListener("DOMContentLoaded", function () {
    var map = L.map('map', { zoomControl: false }).setView([0, 0], 2); // Set initial view
    const markers = []; // Array to store markers
    var geojson = {
        "type": "FeatureCollection",
        "features": [] // Initialize empty array for features
    };

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Disable dragging and zooming
    map.dragging.disable();
    map.touchZoom.disable();
    map.doubleClickZoom.disable();
    map.scrollWheelZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();

    var voronoiLayer; // Variable to store Voronoi layer

    // Function to add marker on click
    function addMarker(e) {
        var marker = new L.Marker(e.latlng);
        marker.addTo(map); // Add marker to the map
        markers.push(marker); // Store reference to the marker

        // Create GeoJSON feature for the marker
        var markerFeature = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [e.latlng.lng, e.latlng.lat] // GeoJSON coordinates are [longitude, latitude]
            },
            "properties": {
                "name": "New Marker" // You can add additional properties if needed
            }
        };

        // Add marker feature to GeoJSON feature collection
        geojson.features.push(markerFeature);

        // Update the Voronoi diagram whenever a new marker is added
        updateVoronoi();
    }

    // Function to update the Voronoi diagram
    function updateVoronoi() {
        try {
            // Calculate Voronoi polygons
            var voronoiPolygons = turf.voronoi(geojson.features);

            // Debug: Log Voronoi polygons to the console
            console.log('Voronoi Polygons:', voronoiPolygons);

            // Clear existing Voronoi layer from the map
            if (voronoiLayer) {
                map.removeLayer(voronoiLayer);
            }

            // Add Voronoi polygons to the map
            voronoiLayer = L.geoJSON(voronoiPolygons, {
                style: function (feature) {
                    return {
                        color: 'red', // Change color as desired
                        weight: 1,
                        opacity: 0.6
                    };
                }
            }).addTo(map);
        } catch (error) {
            console.error('Error updating Voronoi:', error);
        }
    }

    // Function to clear all markers
    function clearMarkers() {
        markers.forEach(function(marker) {
            map.removeLayer(marker); // Remove marker from the map
        });
        markers.length = 0; // Clear the array by removing all elements

        // Clear GeoJSON feature collection
        geojson.features = [];

        // Update the Voronoi diagram whenever markers are cleared
        updateVoronoi();
    }

    // Add click event to the map
    map.on('click', addMarker);

    // Add click event to the reset button
    document.getElementById('reset-btn').addEventListener('click', clearMarkers);
});
