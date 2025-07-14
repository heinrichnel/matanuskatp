const functions = require('firebase-functions');
const driverBehaviorUrl = functions.config().webbook.driver_behavior_url;
const tripsUrl = functions.config().webbook.trips_url;
const wialonToken = functions.config().wialon.token;
const googleMapsApiKey = functions.config().googlemaps.api_key;

exports.someFunction = functions.https.onRequest((req, res) => {
  // Gebruik die veranderlikes hier
  res.send(`Gebruik Google Maps API sleutel: ${googleMapsApiKey}`);
});
