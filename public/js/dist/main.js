'use strict';

$(function () {
  console.log('JQ working');
  var apiKey = "db7f4c46a760159833430e5dd92e1711";
  var requestRadius = '5';
  var requestLat = "51.5074";
  var requestLon = '0.1278';

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
  var $mapDiv = $('#map');
  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5014, lng: 0.1419 },
    zoom: 14
  });
});