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
    zoom: 12
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.createPartial('formContainer', 'formContainer');
  setTimeout(function () {
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
  giggity.eventInformation(eventObject, marker);
  // markers.push(marker);
};

//   //ADDING INFO WINDOW
//   giggity.addInfoWindow = function (eventObject, marker) {
//     google.maps.event.addListener(marker, "click", () => {
//       if(this.infoWindow) {
//         this.infoWindow.close();
//       }
//       this.infoWindow = new google.maps.InfoWindow({
//       content: `<h2>${eventObject.eventname}</h2>
//                 <p>${eventObject.venue.name}</p>
//                 <p>${eventObject.venue.address}</p>
//                 <p>${eventObject.date}</p>
//                 <p>${eventObject.entryprice}</p>
//                 <img src='${eventObject.imageurl}'</>
//                 <button>Select</button>`
//     });
//     this.infoWindow.open(this.map, marker);
//   });
// };

$(giggity.mapSetup.bind(giggity));

giggity.createPartial = function (partial, toGoIn) {
  var load_from = '/partials/_' + partial + '.html';
  var data = "";
  $.get(load_from, data, function (data) {
    $('.' + toGoIn).html(data);
  });
  setTimeout(function () {
    if (partial === "formContainer") {
      giggity.autoComplete();
    }
  }, 500);
  return;
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

giggity.dateFormat = function (date) {
  var today = moment();
  var maxDate = void 0;

  if (date.value === 'Today') {
    maxDate = moment(today).format("YYYY-MM-DD");
  } else if (date.value === 'Next 7 days') {
    var week = today.add(7, 'days');
    maxDate = moment(week).format("YYYY-MM-DD");
  } else if (date.value === 'Tomorrow') {
    var tomorrow = today.add(1, 'days');
    maxDate = moment(tomorrow).format("YYYY-MM-DD");
  } else if (date.value === 'Next 14 days') {
    var twoWeeks = today.add(14, 'days');
    maxDate = moment(twoWeeks).format("YYYY-MM-DD");
  } else if (date.value === 'Next 1 Month') {
    var month = today.add(30, 'days');
    maxDate = moment(month).format("YYYY-MM-DD");
  }
  return maxDate;
};

giggity.formHandler = function () {
  var $formContainer = $('.formContainer');
  var $newSearchButton = $('#newSearchButton');
  $formContainer.on("submit", '#event-selector', function (e) {
    giggity.deleteMarkers();
    var $form = $(this);
    e.preventDefault();
    var data = $form.serializeArray();
    console.log(data);
    var unformattedDate = data[0];
    var date = giggity.dateFormat(unformattedDate);
    var lat = giggity.currentLat;
    var lng = giggity.currentLng;
    var radius = data[2].value;
    var eventcode = data[3].value;
    giggity.getEvents(date, lat, lng, radius, eventcode);
    giggity.createPartial('submittedFormContainer', 'formContainer');
    setTimeout(function () {
      $formContainer.on("click", '#newSearchButton', function () {
        giggity.createPartial('formContainer', 'formContainer');
      });
    }, 500);
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

//   //ADDING INFO WINDOW
//   giggity.addInfoWindow = function (eventObject, marker) {
//     google.maps.event.addListener(marker, "click", () => {
//       if(this.infoWindow) {
//         this.infoWindow.close();
//       }
//       this.infoWindow = new google.maps.InfoWindow({
//       content: `<h2>${eventObject.eventname}</h2>
//                 <p>${eventObject.venue.name}</p>
//                 <p>${eventObject.venue.address}</p>
//                 <p>${eventObject.date}</p>
//                 <p>${eventObject.entryprice}</p>
//                 <img src='${eventObject.imageurl}'</>
//                 <button>Select</button>`
//     });
//     this.infoWindow.open(this.map, marker);
//   });
// };

giggity.eventInformation = function (eventObject, marker) {
  var $removeEventButton = $('#removeEventButton');
  var $formContainer = $('.formContainer');
  google.maps.event.addListener(marker, "click", function () {
    $formContainer.append('<div>\n                            <h2>' + eventObject.eventname + '</h2>\n                            <p>' + eventObject.venue.name + '</p>\n                            <p>' + eventObject.venue.address + '</p>\n                            <p>' + eventObject.date + '</p>\n                            <p>' + eventObject.entryprice + '</p>\n                            <img src=\'' + eventObject.imageurl + '\'</>\n                            <button>Save</button><button id="removeEventButton">Remove</button>\n                            </div>');
  });
  $formContainer.on("click", '#removeEventButton', function () {
    console.log("In the remove section");
    $removeEventButton.parent.html('');
  });
};