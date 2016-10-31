'use strict';

var giggity = giggity || {};
var $main = $('main');
var markers = void 0;

giggity.map = null;
giggity.currentLat = null;
giggity.currentLng = null;

//BUILDING THE MAP IN THE MAP
giggity.mapSetup = function () {
  var $mapDiv = $('#map');

  var mapOptions = {
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 12
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.createPartial('formContainer');
  setTimeout(function () {
    giggity.autoComplete();
    giggity.formHandler();
  }, 1000);
};

giggity.getEvents = function (lat, lng, radius, eventcode) {
  $.ajax({
    url: '/api/events',
    method: "GET",
    data: {
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

  var markerId = Math.floor(Math.random() * 1000000);

  var marker = new google.maps.Marker({
    position: latLng,
    map: this.map
  });
  markers.push(marker);
  giggity.addInfoWindow(eventObject, marker);
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

  markers = [];
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
    deleteMarkers();
    var $form = $(this);
    e.preventDefault();
    var data = $form.serializeArray();
    var lat = giggity.currentLat;
    var lng = giggity.currentLng;
    var radius = data[2].value;
    var eventcode = data[3].value;
    giggity.getEvents(lat, lng, radius, eventcode);
  });
};

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}