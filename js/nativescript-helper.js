var oWebViewInterface = window.nsWebViewInterface;

/**
* Registers handlers for native events.
*/
function addNativeMsgListener() {
    oWebViewInterface.on('locationReceived', function (location) {
        log("locationReceived: " + location.latitude + ", " + location.longitude);
        map.setCenter({lat: location.latitude, lng: location.longitude});
        hideLoading();
    });
}

function requestLocation(){
    console.log("requestingLocation button pressed.");
    log("requesting location to native app")
    oWebViewInterface.emit('locationRequest');
}

function init() {
    addNativeMsgListener();
    //defineNativeInterfaceFunctions();

    document.body.onload = function(){
        oWebViewInterface.emit('onload');
    }
}

init();