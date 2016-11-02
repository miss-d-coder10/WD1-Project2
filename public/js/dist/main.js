'use strict';

var giggity = giggity || {};
var markers = [];
var currentlatLng = void 0;
var lat = void 0;
var lng = void 0;
var $info = $('.eventObects');

giggity.init = function () {
  this.map = null;
  this.currentLat = null;
  this.currentLng = null;
  this.$main = $('main');
  this.$header = $('header');
  this.$formContainer = $('.formContainer');
  this.$newSearchButton = $('#newSearchButton');
  this.$removeEventButton = $('#removeEventButton');
  this.$locationButton = $(".locationbutton");
  this.$body = $("body");
  this.initEventListeners();
  this.mapSetup();
  this.checkLoginStatus();
  this.autoComplete();
};

giggity.initEventListeners = function () {
  this.$formContainer.on("submit", '#event-selector', giggity.formHandler);
  this.$formContainer.on("click", '#newSearchButton', giggity.newSearchFunction);
  this.$formContainer.on("click", '#removeEventButton', giggity.removeEventObject);
  this.$formContainer.on("click", '.locationButton', giggity.getLocation);
  this.$header.on("click", ".signUpButton", giggity.signUp);
  this.$body.on("submit", ".authform", giggity.handleUserForm);
};

giggity.checkLoginStatus = function () {
  if (giggity.isLoggedIn()) {
    $('.accountButton').show();
  } else {
    $('.signUpButton').show();
  }
};

//BUILDING THE MAP IN THE MAP
giggity.mapSetup = function () {
  giggity.getLocation();
  var $mapDiv = $('#map');
  var mapOptions = {
    zoom: 12,
    styles: giggity.mapSettings
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.createFormContainer();
  this.createHeader();
};

giggity.formHandler = function (e) {
  giggity.deleteMarkers();
  var $form = $(this);
  event.preventDefault();
  var data = $form.serializeArray();
  var unformattedDate = data[0];
  var date = giggity.dateFormat(unformattedDate);
  var lat = giggity.currentLat;
  var lng = giggity.currentLng;
  var radius = data[2].value;
  var eventcode = data[3].value;
  giggity.getEvents(date, lat, lng, radius, eventcode);
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

giggity.newSearchFunction = function () {
  giggity.deleteMarkers();
  giggity.createFormContainer();
};

giggity.createFormContainer = function () {
  $('.formContainer').html(giggity.formContainerObject);
  this.autoComplete();
};

giggity.createHeader = function () {
  $('header').html(giggity.headerObject);
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

giggity.removeEventObject = function () {
  $('.eventObects').remove();
  giggity.createFormContainer();
};

giggity.loopThroughEvents = function (data) {
  var _this = this;

  $.each(data, function (index, eventObject) {
    _this.createMarker(eventObject, "pin");
  });

  //RESTAURANTS
  giggity.$formContainer.on("click", '#nearbyRestaurantsButton', function () {
    $info = $('.eventObects');
    lat = $info.data('lat');
    lng = $info.data('lng');

    var latLng = { lat: lat, lng: lng };

    var service = new google.maps.places.PlacesService(giggity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['restaurant']
    }, giggity.callback);
  });
  //PUBS AND BARS
  giggity.$formContainer.on("click", '#nearbyPubsButton', function () {
    var methodOfTravel = void 0;
    $info = $('.eventObects');
    lat = $info.data('lat');
    lng = $info.data('lng');
    var latLng = { lat: lat, lng: lng };
    var service = new google.maps.places.PlacesService(giggity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['pub']
    }, giggity.callback);
  });
  //DIRECTIONS

  giggity.$formContainer.on("click", '#getDirectionsButton', function () {
    var directionsDisplay;
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: null
    });
    var $methodOfTravel = $('#methodofTravel').val();
    navigator.geolocation.getCurrentPosition(function (position) {
      currentlatLng = { lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      $info = $('.eventObects');
      lat = $info.data('lat');
      lng = $info.data('lng');
      var latLng = { lat: lat, lng: lng };
      var directionsService = new google.maps.DirectionsService();
      var directionsRequest = {
        origin: currentlatLng,
        destination: latLng,
        travelMode: google.maps.DirectionsTravelMode[$methodOfTravel],
        unitSystem: google.maps.UnitSystem.METRIC
      };

      directionsService.route(directionsRequest, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay = new google.maps.DirectionsRenderer({
            map: giggity.map,
            directions: response
          });
        } else $("#error").append("Unable to retrieve your route<br />");
      });
    });
  });
};

giggity.callback = function (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
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
  }); // Shows small window for restuarant
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

giggity.autoComplete = function () {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  giggity.map.addListener('bounds_changed', function () {

    searchBox.setBounds(giggity.map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();
    if (places.length === 0) {
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
    giggity.map.fitBounds(bounds);
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
  google.maps.event.addListener(marker, "click", function () {
    // if (!$eventContainer.contains('.eventObects')) {
    giggity.$formContainer.html('<div class="eventObects" data-lat=' + eventObject.venue.latitude + ' data-lng=' + eventObject.venue.longitude + '>\n          <h2>' + eventObject.eventname + '</h2>\n          <p>' + eventObject.venue.name + '</p>\n          <p>' + eventObject.venue.address + '</p>\n          <p>' + eventObject.date + '</p>\n          <p>' + eventObject.entryprice + '</p>\n          <img src=\'' + eventObject.imageurl + '\'>\n          <button id="removeEventButton">Remove</button>\n          <button id="nearbyRestaurantsButton">Nearby Restaurant</button>\n          <button id="nearbyPubsButton">Nearby Pubs and Bars</button>\n          <button id="getDirectionsButton">Get Directions</button>\n          <select id="methodofTravel">\n          <option disabled="disabled">How are you travelling?</option>\n            <option value="DRIVING">DRIVING</option>\n            <option value="WALKING">WALKING</option>\n            <option value="BICYCLING">BICYCLING</option>\n            <option value="TRANSIT">TRANSIT</option>\n          </select>\n          <button id="newSearchButton">New Search</button>\n        </div>');
  });
};

// Current Location
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
  return;
};

giggity.openTab = function (evt, tabName) {
  var i, tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
};

document.addEventListener('DOMContentLoaded', function () {
  giggity.init();
});