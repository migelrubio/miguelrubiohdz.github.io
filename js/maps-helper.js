// Google maps
var currentLocation = {lat:24.067718, lng:-110.2937648};
var closestPoint = {
    lat:Math.trunc(currentLocation.lat * 10000) / 10000, 
    lng:Math.trunc(currentLocation.lng * 10000) / 10000
};
var map;
var locationCircleOuter, locationCircleInner;
var zones = {};

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
      //center: {lat:closestPoint.lat,lng:closestPoint.lng},
      center: {lat:0,lng:0},
      zoom: 17,
      maxZoom: 17,
      minZoom: 10,    
      disableDefaultUI: true,
      scrollwheel: true,
      disableDoubleClickZoom: true,
      mapTypeId: 'terrain',
      rotateControl: false,
      zoomControl: false,
      titl:45,
      styles: [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#523735"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#c9b2a6"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#dcd2be"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#ae9e90"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#93817c"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#a5b076"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#447530"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f5f1e6"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.icon",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#fdfcf8"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#f8c967"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#e9bc62"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#e98d58"
            }
          ]
        },
        {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#db8555"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#806b63"
            }
          ]
        },
        {
          "featureType": "transit",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8f7d77"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#ebe3cd"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#dfd2ae"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#b9d3c2"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#92998d"
            }
          ]
        }
      ]
  });
  map.addListener('zoom_changed', zoomChangedHandler);
  //map.addListener('bounds_changed', boundsChangedHandler);
  map.addListener('dragend', dragendHandler);
}

function drawLocationCircle(center, size){
    if (locationCircleOuter) locationCircleOuter.setMap(null);
    locationCircleOuter = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 0.25,
        strokeWeight: 0,
        fillColor: '#00FFFF',
        fillOpacity: 0.1,
        map: map,
        center: center,
        radius: size,
        zIndex: 1
    });
    if (locationCircleInner) locationCircleInner.setMap(null);
    locationCircleInner = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 0.25,
        strokeWeight: 0,
        fillColor: '#000000',
        fillOpacity: .5,
        map: map,
        center: center,
        radius: 5,
        zIndex: 1
    });
}

function drawSquare(lat, lng, strokeColor, strokeOpacity, fillColor){
    return rectangle = new google.maps.Rectangle({
      strokeColor: strokeColor,
      strokeOpacity: strokeOpacity,
      strokeWeight: 1,
      fillColor: fillColor,
      fillOpacity: 0.1,
      clikable: true,
      zIndex: 10,
      map: map,
      bounds: {
        north: lat + .001,
        west: lng,
        south: lat,
        east: lng + .001
      }
    });
}

function parseCoord(coord){
    coordString = coord.toString();
    point = coordString.indexOf(".");
    return parseInt(coordString.substr(0, point) + coordString.substr(point + 1, 3) + '0');
}

function intToCoord(integer){
    intString = integer.toString();
    if (intString.indexOf(".") > -1){
      decimals = intString.length - intString.indexOf(".") - 1;
    } else {
      decimals = 0;
      intString += ".";
    }
    if (decimals < 4){
      for (var x = decimals; x < 4; x++){
        intString += "0";
      }
    }
    return intString;
}
/*
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (window.navigator.geolocation) {
        log("navigator.geolocation: true");
        window.navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(16);
            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            
        }, function(error) {
            log(error.code + ": " + error.message);
            handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        log("Browser doesn't support Geolocation");
        handleLocationError(false, infoWindow, map.getCenter());
    }
*/