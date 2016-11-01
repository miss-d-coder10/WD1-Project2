'use strict';

var giggity = giggity || {};
var $main = $('main');
var markers = [];

giggity.map = null;
giggity.currentLat = null;
giggity.currentLng = null;

//BUILDING THE MAP IN THE MAP
giggity.mapSetup = function () {
    var $mapDiv = $('#map');

    var mapOptions = {
        center: { lat: 51.5074, lng: -0.1278 },
        zoom: 12,
        styles: [{
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#6195a0"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "color": "#f2f2f2"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#ffffff"
            }]
        }, {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#e6f3d6"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "road",
            "elementType": "all",
            "stylers": [{
                "saturation": -100
            }, {
                "lightness": 45
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "all",
            "stylers": [{
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#f4d2c5"
            }, {
                "visibility": "simplified"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels.text",
            "stylers": [{
                "color": "#4e4e4e"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#f4f4f4"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [{
                "color": "#787878"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "water",
            "elementType": "all",
            "stylers": [{
                "color": "#eaf6f8"
            }, {
                "visibility": "on"
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#eaf6f8"
            }]
        }]
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.createPartial('formContainer');
    setTimeout(function () {
        giggity.autoComplete();
        giggity.formHandler();
    }, 1000);
};

giggity.getEvents = function (date, lat, lng, radius, eventcode) {
    $.ajax({
        url: '/api/events',
        method: "GET",
        data: {
            date: date,
            lat: lat,
            lng: lng,
            radius: radius,
            eventcode: eventcode,
            limit: 100
        }
    }).done(this.loopThroughEvents.bind(giggity));
};

giggity.loopThroughEvents = function (data) {
    $.each(data, function (index, eventObject) {
        giggity.createMarker(eventObject);
    });
};

//ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
giggity.createMarker = function (eventObject) {
    var latLng = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
    var marker = new google.maps.Marker({
        position: latLng,
        map: this.map
    });
    markers.push(marker);
    giggity.addInfoWindow(eventObject, marker);
    markers.push(marker);
};

//ADDING INFO WINDOW
giggity.addInfoWindow = function (eventObject, marker) {
    var _this = this;

    google.maps.event.addListener(marker, "click", function () {
        if (_this.infoWindow) {
            _this.infoWindow.close();
        }
        _this.infoWindow = new google.maps.InfoWindow({
            content: '<h2>' + eventObject.eventname + '</h2>\n                <p>' + eventObject.venue.name + '</p>\n                <p>' + eventObject.venue.address + '</p>\n                <p>' + eventObject.date + '</p>\n                <p>' + eventObject.entryprice + '</p>\n                <img src=\'' + eventObject.imageurl + '\'</>'
        });
        _this.infoWindow.open(_this.map, marker);
    });
};

$(giggity.mapSetup.bind(giggity));

giggity.createPartial = function (partial) {
    var load_from = '/partials/_' + partial + '.html';
    var data = "";
    $.get(load_from, data, function (data) {
        $('.' + partial).html(data);
    });
};

giggity.autoComplete = function () {

    var map = giggity.map;
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input);

    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length == 0) {
            return;
        }
        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();

        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            giggity.currentLat = place.geometry.location.lat();
            giggity.currentLng = place.geometry.location.lng();
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
};

giggity.formHandler = function () {
    var $formContainer = $('.formContainer');
    $formContainer.on("submit", '#event-selector', function (e) {
        giggity.deleteMarkers();
        var $form = $(this);
        e.preventDefault();
        var data = $form.serializeArray();
        console.log(data);
        var date = data[0];
        var lat = giggity.currentLat;
        var lng = giggity.currentLng;
        var radius = data[2].value;
        var eventcode = data[3].value;
        giggity.getEvents(date, lat, lng, radius, eventcode);
    });
};

// Sets the map on all markers in the array.
giggity.setMapOnAll = function (map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
};

// Removes the markers from the map, but keeps them in the array.
giggity.clearMarkers = function () {
    giggity.setMapOnAll(null);
};

// Shows any markers currently in the array.
giggity.showMarkers = function () {
    giggity.setMapOnAll(map);
};

// Deletes all markers in the array by removing references to them.
giggity.deleteMarkers = function () {
    giggity.clearMarkers();
    markers = [];
};