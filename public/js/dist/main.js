'use strict';

// $(() =>{

var $main = $('main');

var googleMap = googleMap || {};

googleMap.getEvents = function () {
  $.ajax({
    url: '/api/events',
    method: "GET",
    data: {
      lat: 51.5074,
      lng: 0.1278,
      radius: 5,
      eventcode: "LIVE"
    }
  })
  // .done((data) => {
  //   console.log("data", data);
  //
  // });
  .done(this.loopThroughEvents);
};

googleMap.loopThroughEvents = function (data) {
  $.each(data.Object, function (index, eventObject) {
    googleMap.createMarker(eventObject);
  });
};

//BUILDING THE MAP IN THE MAP


//ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
googleMap.createMarker = function (eventObject) {
  var latLng = new google.maps.LatLng(eventObject.lat, eventObject.lng);
  var marker = new google.maps.Marker({
    position: latLng,
    map: googleMap.map
  });
};

googleMap.mapSetup = function () {
  var $mapDiv = $('#map');

  var mapOptions = {
    center: { lat: 51.5014, lng: 0.1419 },
    zoom: 14
  };
  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.getEvents();
};

// });

$(googleMap.mapSetup.bind(googleMap));