var firebase;

//find if we are running inside nativescript app or web
var url = new URL(window.location.href);
var ns_param = url.searchParams.get("nativescript");
console.log(ns_param);
var nativescript = ns_param == 1 ? true : false;

var zones = [];
var selected;

$(document).ready(function(){
    setListeners();
    firebase = initFirebase();
    hideLoading();
    log("Browser CodeName: " + window.navigator.appCodeName);
    log("Browser Name: " + navigator.appName);
    log("Browser Version: " + navigator.appVersion);
    log("Platform: " + navigator.platform);
    log("User Agent:" + window.navigator.userAgent);
    log("Location: " + window.location);
});

function log(msg){
    $("#log").append("<p>"+msg+"</p>");
}

function mapsApiReady(){
    log("maps api ready");
    initMap();
}

function setListeners(){
    //$('.tabs').tabs({swipeable: true, responsiveThreshold: 10});
    $('.tabs').tabs();
    $('#initMap-btn').click(getLocation);
}

function getLocation(){
    showLoading("adquiring location");
    if (nativescript){
        requestLocation();
    } else {
        log("getting location from browser");
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log("current location: " + pos.lat + "," + pos.lng);
                map.setCenter(pos);
                drawLocationCircle(pos,100);
                map.setZoom(17);
                loadZones();
                hideLoading();
            });
        }
    }
}

function removeZones(){
  for (var x=0; x < zones.length; x++){
    zones[x].square.setMap(null);
  }
}

function zoomChangedHandler(){
  if (map.getZoom() == 15){
    removeZones();
  } else {
    loadZones();
  }
}

function boundsChangedHandler(){
  if (map.getZoom() > 15){
    loadZones();
  }
}

function loadZones(){
    removeZones();
    zones = [];
    var gridStartLat = parseCoord(map.getBounds().ma.j) - 10;
    var gridStartLng = parseCoord(map.getBounds().fa.j) - 10;
    var gridEndLat = parseCoord(map.getBounds().ma.l) + 10;
    var gridEndLng = parseCoord(map.getBounds().fa.l) + 10;
    var gridSizeLat = (gridEndLat - gridStartLat) / 10;
    var gridsizeLng = (gridEndLng - gridStartLng) / 10;
    for (var x = 0; x < gridSizeLat; x++) {
        for (var y = 0; y < gridsizeLng; y++){
            var zone = {}
            zone.latitude = intToCoord((gridStartLat + x * 10) / 10000);
            zone.longitude = intToCoord((gridStartLng + y * 10) / 10000);
            zone.id = zone.latitude + "," + zone.longitude;
            if (selected == zone.id){
              var square = drawSquare((gridStartLat + x * 10) / 10000, (gridStartLng + y * 10) / 10000, '#000', '1', 'transparent');
            } else {
              var square = drawSquare((gridStartLat + x * 10) / 10000, (gridStartLng + y * 10) / 10000, '#DDD', '.25', 'transparent');
            }
            //square.square_id = zone.latitude + "," + zone.longitude;
            square.addListener('click', function() {
                selectZone(this);
            });
            zone.square = square;
            //TODO check firebase for zone info (color)
            zones.push(zone);
        }
    }
}

function selectZone(square){
  for (var x = 0; x < zones.length; x++) {
    //zones[x].square.setMap(null);
    if (zones[x].square == square) {
        zones[x].selected = true;
        zones[x].square.setOptions({strokeColor:'#000', strokeOpacity:'1'});
        selected = zones[x].id;
    } else {
        zones[x].selected = false;
        zones[x].square.setOptions({strokeColor:'#DDD', strokeOpacity:'.25'});
    }
    //zones[x].square.setMap(map);
  }
  $("#selected_lat").html(selected.latitude);
  $("#selected_lng").html(selected.longitude);
}

function hideLoading(){
    $("#loading-mask").removeClass("scale-in");
    $("#loading-mask").addClass("scale-out");
}

function showLoading(msg){
    $("#loading-message").html(msg + "...");
    $("#loading-mask").removeClass("scale-out");
    $("#loading-mask").addClass("scale-in");
    //$("#loading-mask").show();
}