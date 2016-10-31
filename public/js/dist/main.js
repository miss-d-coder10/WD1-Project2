'use strict';

var giggity = giggity || {};
var $main = $('main');

giggity.getEvents = function () {
  $.ajax({
    url: '/api/events',
    method: "GET",
    data: {
      lat: 51.489915,
      lng: -0.137818,
      radius: 5,
      eventcode: "COMEDY",
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
    map: giggity.map
  });
  giggity.addInfoWindow(eventObject, marker);
};

//BUILDING THE MAP IN THE MAP
giggity.mapSetup = function () {
  var $mapDiv = $('#map');

  var mapOptions = {
    center: { lat: 51.5074, lng: -0.1278 },
    zoom: 12
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.getEvents();
  this.createPartial('formContainer');
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