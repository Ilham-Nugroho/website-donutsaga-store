

function initMap() {
  // Google map Your Location
  const location = {
    lat: -5.181757,
    lng: 119.426664
  };
  // The map, centered at Your Location
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 18,
    center: location,
  });
  // The marker, positioned at Your Location
  const marker = new google.maps.Marker({
    position: location,
    map: map,
  });
}
