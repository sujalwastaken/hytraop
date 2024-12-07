// Initialize the map (centered on India)
var map = L.map('map').setView([22.5937, 78.9629], 5);  // India centered at (22.5937, 78.9629)

// Add OpenStreetMap tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Variable to keep track of the selected point (start or end)
var selectingStart = true;
var startLatLng = null;
var endLatLng = null;
var currentRoute = null;  // Store the current route instance

// Fetch hydrogen plant data from data.json
fetch('./data.json')  // Replace '/plants' with the path to your JSON file
    .then(response => response.json())
    .then(data => {
        if (data && data.length > 0) {
            data.forEach(plant => {
                // Handle NaN for coordinates
                let lat = isNaN(plant.Latitude) ? 0 : parseFloat(plant.Latitude);
                let lon = isNaN(plant.Longitude) ? 0 : parseFloat(plant.Longitude);

                // Add marker to map with popup
                var marker = L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup(`<b>${plant['Project name']}</b><br>Status: ${plant.Status}<br>Technology: ${plant.Technology}<br>Capacity: ${plant.Capacity_MWel} MW`);

                // Add click event listener to each marker
                marker.on('click', function() {
                    if (selectingStart) {
                        // Set the start location from the clicked marker
                        startLatLng = L.latLng(lat, lon);
                        document.getElementById("start").value = plant['Project name'];
                        selectingStart = false;  // Switch to selecting end point next
                    } else {
                        // Set the end location from the clicked marker
                        endLatLng = L.latLng(lat, lon);
                        document.getElementById("end").value = plant['Project name'];
                        selectingStart = true;  // Switch to selecting start point again
                    }
                });
            });
        } else {
            console.log("No plant data available.");
        }
    })
    .catch(error => console.error('Error loading data:', error));

// Define emission factors for different vehicle types (grams of CO2 per km)
const emissionFactors = {
    electric: 0.2 * 0.8 * 1000,  // kWh per km * 0.8 kg CO2/kWh = 160g CO2/km (Electric vehicle)
    petrol: 192,                 // Petrol vehicle: 192g CO2/km
    cng: 128,                    // CNG vehicle: 128g CO2/km
    diesel: 181                  // Diesel vehicle: 181g CO2/km
};

// Function to calculate the route using coordinates directly
function calculateRoute() {
    if (!startLatLng || !endLatLng) {
        alert("Please select both start and end points by clicking on the markers.");
        return;
    }

    // Remove the previous route if it exists
    if (currentRoute) {
        map.removeControl(currentRoute);  // Remove the previous route from the map
    }

    // Add the new route
    currentRoute = L.Routing.control({
        waypoints: [
            startLatLng,
            endLatLng
        ]
    }).addTo(map);

    // Optionally, center the map to show the route
    map.fitBounds([startLatLng, endLatLng]);

    // Calculate emissions based on the selected vehicle type
    calculateEmissions(startLatLng, endLatLng);
}

// Function to calculate and display emissions
function calculateEmissions(start, end) {
    // Example: assume the distance between start and end is 100 km (replace this with actual route distance calculation)
    var distanceInKm = map.distance(start, end) / 1000;  // Convert meters to kilometers

    // Get the selected vehicle type
    var vehicleType = document.getElementById("vehicleType").value;

    // Calculate the emissions for the selected vehicle
    var emissions = emissionFactors[vehicleType] * distanceInKm;

    // Convert emissions to kg and update the display
    var emissionsInKg = emissions / 1000;

    // Display the emissions value on the page
    document.getElementById("emissionValue").textContent = emissionsInKg.toFixed(2) + " kg of CO2";
}
