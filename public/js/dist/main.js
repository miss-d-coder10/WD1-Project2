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
    giggity.createMarker(eventObject, "pin");
  });
  var $formContainer = $('.formContainer');
  $formContainer.on("click", '#removeEventButton', function () {
    console.log("In the remove section");
    $('.eventObects').remove();
  });

  //RESTAURANTS
  $formContainer.on("click", '#nearbyRestaurantsButton', function () {
    var $info = $('.eventObects');
    var lat = $info.data('lat');
    var lng = $info.data('lng');
    var latLng = { lat: lat, lng: lng };

    var service = new google.maps.places.PlacesService(giggity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['restaurant']
    }, giggity.callback);
  });
  //PUBS AND BARS
  $formContainer.on("click", '#nearbyPubsButton', function () {
    console.log("trying to find pub");
    var $info = $('.eventObects');
    var lat = $info.data('lat');
    var lng = $info.data('lng');
    var latLng = { lat: lat, lng: lng };

    var service = new google.maps.places.PlacesService(giggity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['pub']
    }, giggity.callback);
  });
};

giggity.callback = function (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    console.log(results);
    for (var i = 0; i < results.length; i++) {
      giggity.restaurantMarkerFunction(results[i]);
    }
  }
};

giggity.restaurantMarkerFunction = function (place) {
  var placeLoc = place.geometry.location;
  var marker = new google.maps.Marker({
    map: this.map,
    position: place.geometry.location
  });

  var infowindow = new google.maps.InfoWindow();
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(this.map, this);
  });
};

//ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
giggity.createMarker = function (markerObject, markerType) {
  var latLng = void 0;
  if (markerObject.venue) {
    latLng = new google.maps.LatLng(markerObject.venue.latitude, markerObject.venue.longitude);
  } else if (markerObject.coords) {
    latLng = new google.maps.LatLng(markerObject.coords.latitude, markerObject.coords.longitude);
  }

  var marker = new google.maps.Marker({
    position: latLng,
    icon: giggity.icons[markerType].icon,
    map: this.map,
    metadata: {
      id: markerType
    }
  });
  markers.push(marker);
  giggity.eventInformation(markerObject, marker);
  markers.push(marker);
};

giggity.icons = {
  pin: {
    icon: "../../assets/images/pin.png"
  },
  location: {
    icon: "../../assets/images/location.png"
  },
  restuarant: {
    icon: "../../assets/images/location.png"
  }
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

giggity.eventInformation = function (eventObject, marker) {
  // console.log(eventObject);
  var $removeEventButton = $('#removeEventButton');
  var $formContainer = $('.formContainer');
  google.maps.event.addListener(marker, "click", function () {
    $formContainer.append('<div class="eventObects" data-lat=' + eventObject.venue.latitude + ' data-lng=' + eventObject.venue.longitude + '>\n        <h2>' + eventObject.eventname + '</h2>\n        <p>' + eventObject.venue.name + '</p>\n        <p>' + eventObject.venue.address + '</p>\n        <p>' + eventObject.date + '</p>\n        <p>' + eventObject.entryprice + '</p>\n        <img src=\'' + eventObject.imageurl + '\'>\n        <button id="removeEventButton">Remove</button>\n        <button id="nearbyRestaurantsButton">Nearby Restaurant</button>\n        <button id="nearbyPubsButton">Nearby Pubs and Bars</button>\n        <button id="getDirectionsButton">Get Directions</button>\n      </div>');
  });
};

//current location
setTimeout(function () {
  $(".locationbutton").on("click", giggity.getLocation);
}, 500);

giggity.getLocation = function () {
  markers.forEach(function (marker) {
    if (marker.metadata.id == "location") {
      var index = markers.indexOf(marker);
      markers[index].setMap(null);
    }
  });

  navigator.geolocation.getCurrentPosition(function (position) {
    var latLng = { lat: position.coords.latitude,
      lng: position.coords.longitude
    };

    giggity.createMarker(position, "location");
    giggity.map.panTo(latLng);
    giggity.map.setZoom(16);
  });
};