'use strict';

var googleMap = googleMap || {};

var $main = $('main');

googleMap.getEvents = function () {
  $.ajax({
    url: '/api/events',
    method: "GET",
    data: {
      lat: 51.489915,
      lng: -0.137818,
      radius: 15,
      eventcode: "LIVE",
      limit: 100
    }
  }).done(this.loopThroughEvents.bind(googleMap));
};

googleMap.loopThroughEvents = function (data) {
  console.log(data);
  $.each(data, function (index, eventObject) {
    googleMap.createMarker(eventObject);
  });
};

//ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
googleMap.createMarker = function (eventObject) {

  var latLng = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
  var marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map
  });
  googleMap.addInfoWindow(eventObject, marker);
};

//BUILDING THE MAP IN THE MAP
googleMap.mapSetup = function () {
  var $mapDiv = $('#map');

  var mapOptions = {
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 12
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.getEvents();
};

//ADDING INFO WINDOW
googleMap.addInfoWindow = function (eventObject, marker) {
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

$(googleMap.mapSetup.bind(googleMap));