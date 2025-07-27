// index.js
const API_KEY = 'AIzaSyAgScPnzBI-6vKoL7Cn1_1mkhvCI54chDg';

function initMap() {
  const center = { lat: -25.7479, lng: 28.2293 };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: center,
  });
  new google.maps.Marker({
    position: center,
    map: map,
    title: "Pretoria",
  });
}

function loadGoogleMapsScript() {
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

// Make initMap globally accessible for Google Maps callback
window.initMap = initMap;

window.onload = loadGoogleMapsScript;
