'use strict';

var gigcity = gigcity || {};
var markers = [];
var currentlatLng = void 0;
var lat = void 0;
var lng = void 0;
var $info = $('.eventObjects');

gigcity.init = function () {
  this.map = null;
  this.currentLat = null;
  this.currentLng = null;
  this.currentEvent = null;
  this.currentUserEvents = null;
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

gigcity.initEventListeners = function () {
  this.$formContainer.on("submit", '#event-selector', gigcity.formHandler);
  this.$formContainer.on("click", '#newSearchButton', gigcity.newSearchFunction);
  this.$formContainer.on("click", '#saveEventButton', gigcity.saveEventFunction);
  this.$formContainer.on("click", '#savedEventButton', gigcity.individualEventFunction);
  this.$formContainer.on("click", '#removeEventButton', gigcity.removeEventObject);
  this.$formContainer.on("click", '.locationButton', gigcity.getLocation);
  this.$header.on("click", ".signUpButton", gigcity.signUp);
  this.$header.on("click", ".accountButton", gigcity.toggleAccountMenu);
  this.$header.on("click", ".profileButton", gigcity.getUserData);
  this.$header.on("click", ".home", gigcity.liteRefreshPage);
  this.$body.on("click", ".deleteProfileButton", gigcity.deleteUser);
  this.$body.on("click", ".logoutButton", gigcity.refreshPage);
  this.$header.on("click", ".eventsButton", gigcity.showEventsPage);
  this.$body.on("submit", ".authform", gigcity.handleUserForm);
  this.$body.on("submit", ".accountSettingsForm", gigcity.updateUserForm);
  this.$body.on("click", ".closeSignForm", gigcity.closeSignForm);
  this.$body.on("click", ".binIcon", function () {
    var eventId = event.srcElement.id;
    gigcity.deleteEventFunction(eventId, false);
  });
};

gigcity.checkLoginStatus = function () {
  if (gigcity.isLoggedIn()) {
    $('.accountButton').show();
  } else {
    $('.signUpButton').show();
  }
};

//BUILDING THE MAP IN THE MAP
gigcity.mapSetup = function () {
  gigcity.getLocation();
  var $mapDiv = $('#map');
  var mapOptions = {
    zoom: 12,
    styles: gigcity.mapSettings
  };

  this.map = new google.maps.Map($mapDiv[0], mapOptions);
  this.createFormContainer();
  this.createHeader();
};

gigcity.formHandler = function (e) {
  gigcity.deleteMarkers();
  var $form = $(this);
  event.preventDefault();
  var data = $form.serializeArray();
  var unformattedDate = data[0];
  var date = gigcity.dateFormat(unformattedDate);
  var lat = gigcity.currentLat;
  var lng = gigcity.currentLng;
  var radius = data[2].value;
  var eventcode = data[3].value;
  gigcity.getEvents(date, lat, lng, radius, eventcode);
};

gigcity.dateFormat = function (date) {
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

gigcity.newSearchFunction = function () {
  gigcity.deleteMarkers();
  gigcity.createFormContainer();
};

gigcity.createFormContainer = function () {
  $('.formContainer').html(gigcity.formContainerObject);
  this.autoComplete();
};

gigcity.createHeader = function () {
  $('header').html(gigcity.headerObject);
};

gigcity.getEvents = function (date, lat, lng, radius, eventcode) {
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
  }).done(this.loopThroughEvents.bind(gigcity));
};

gigcity.getIndividualEvent = function (eventId, elementId) {
  $.ajax({
    contentType: 'application/json',
    url: '/api/events/' + eventId,
    method: "GET",
    dataType: 'json'
  }).done(function (data) {
    console.log(elementId);
    gigcity.createEventCard(data, elementId);
  });
};

gigcity.removeEventObject = function () {
  $('.eventObjects').remove();
  gigcity.createFormContainer();
};

gigcity.loopThroughEvents = function (data) {
  var _this = this;

  $.each(data, function (index, eventObject) {
    _this.createMarker(eventObject, "pin");
  });

  //RESTAURANTS
  gigcity.$formContainer.on("click", '#nearbyRestaurantsButton', function () {
    $info = $('.eventObjects');
    lat = $info.data('lat');
    lng = $info.data('lng');

    var latLng = { lat: lat, lng: lng };

    var service = new google.maps.places.PlacesService(gigcity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['restaurant']
    }, gigcity.callback);
  });
  //PUBS AND BARS
  gigcity.$formContainer.on("click", '#nearbyPubsButton', function () {
    var methodOfTravel = void 0;
    $info = $('.eventObjects');
    lat = $info.data('lat');
    lng = $info.data('lng');
    var latLng = { lat: lat, lng: lng };
    var service = new google.maps.places.PlacesService(gigcity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      types: ['pub']
    }, gigcity.callback);
  });
  //DIRECTIONS
  gigcity.$formContainer.on("click", '#getDirectionsButton', function () {

    var $methodOfTravel = $('#methodofTravel').val();
    navigator.geolocation.getCurrentPosition(function (position) {
      currentlatLng = { lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      $info = $('.eventObjects');
      lat = $info.data('lat');
      lng = $info.data('lng');
      var latLng = { lat: lat, lng: lng };
      directionsService = new google.maps.DirectionsService();
      var directionsRequest = {
        origin: currentlatLng,
        destination: latLng,
        travelMode: google.maps.DirectionsTravelMode[$methodOfTravel],
        unitSystem: google.maps.UnitSystem.METRIC
      };

      directionsService.route(directionsRequest, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          directionsDisplay = new google.maps.DirectionsRenderer({
            map: gigcity.map,
            directions: response
          });
        } else $("#error").append("Unable to retrieve your route<br />");
      });
    });
  });
};

gigcity.callback = function (results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      gigcity.restaurantMarkerFunction(results[i]);
    }
  }
};

gigcity.restaurantMarkerFunction = function (place) {
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
gigcity.createMarker = function (markerObject, markerType) {
  var latLng = void 0;
  if (markerObject.venue) {
    latLng = new google.maps.LatLng(markerObject.venue.latitude, markerObject.venue.longitude);
  } else if (markerObject.coords) {
    latLng = new google.maps.LatLng(markerObject.coords.latitude, markerObject.coords.longitude);
  }

  var marker = new google.maps.Marker({
    position: latLng,
    icon: gigcity.icons[markerType].icon,
    map: this.map,
    metadata: {
      id: markerType
    }
  });
  markers.push(marker);
  gigcity.eventInformation(markerObject, marker);
  markers.push(marker);
};

gigcity.icons = {
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

gigcity.autoComplete = function () {
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  gigcity.map.addListener('bounds_changed', function () {

    searchBox.setBounds(gigcity.map.getBounds());
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
      gigcity.currentLat = place.geometry.location.lat();
      gigcity.currentLng = place.geometry.location.lng();
      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    gigcity.map.fitBounds(bounds);
  });
};

// Sets the map on all markers in the array.
gigcity.setMapOnAll = function (map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
};

// Removes the markers from the map, but keeps them in the array.
gigcity.clearMarkers = function () {
  gigcity.setMapOnAll(null);
};

// Shows any markers currently in the array.
gigcity.showMarkers = function () {
  gigcity.setMapOnAll(map);
};

// Deletes all markers in the array by removing references to them.
gigcity.deleteMarkers = function () {
  gigcity.clearMarkers();
  markers = [];
};

gigcity.eventInformation = function (eventObject, marker) {
  google.maps.event.addListener(marker, "click", function () {
    gigcity.getUserEvents(true);
    gigcity.currentEvent = eventObject.id;
    gigcity.$formContainer.html('<div class="eventObjects" data-lat=' + eventObject.venue.latitude + ' data-lng=' + eventObject.venue.longitude + '>\n          <div class="column--one">\n            <div class="column--one--one">\n              <img src=\'' + eventObject.imageurl + '\'>\n              <h2>' + eventObject.eventname + '</h2>\n              <p>Price: ' + eventObject.entryprice + '</p>\n            </div>\n            <div class="column--one--two">\n              <p>When: ' + eventObject.date + '</p>\n              <p>' + eventObject.venue.name + ' - ' + eventObject.venue.address + '</p>\n            </div>\n          </div>\n          <div class="column--two">\n            <div class="nearby">\n              <button id="nearbyRestaurantsButton">Restaurant</button>\n              <button id="nearbyPubsButton">Pubs and Bars</button>\n            </div>\n            <div class="directions">\n              <select id="methodofTravel">\n                <option disabled="disabled">How are you travelling?</option>\n                <option value="DRIVING">DRIVING</option>\n                <option value="WALKING">WALKING</option>\n                <option value="BICYCLING">BICYCLING</option>\n                <option value="TRANSIT">TRANSIT</option>\n              </select>\n              <button id="getDirectionsButton">Get Directions</button>\n            </div>\n            <div class="controlButtons">\n              <button id="newSearchButton">New Search</button>\n            </div>\n          </div>\n        </div>');
  });
};

// Current Location
gigcity.getLocation = function () {
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
    gigcity.createMarker(position, "location");
    gigcity.map.panTo(latLng);
    gigcity.map.setZoom(16);
  });
  return;
};

gigcity.openTab = function (tabName) {
  if (tabName == 'signUp') {
    $('#signUp').show();
    $('#signIn').hide();
  } else if (tabName == 'signIn') {
    $('#signUp').hide();
    $('#signIn').show();
  }
};

gigcity.saveEventFunction = function () {
  if (!gigcity.isLoggedIn()) {
    gigcity.signUp();
    return;
  }
  var token = localStorage.getItem("token");
  var currentUser = localStorage.getItem("userId");

  $.ajax({
    contentType: 'application/json',
    url: "/api/saveEvents",
    method: "POST",
    data: JSON.stringify({
      "skiddleId": gigcity.currentEvent,
      "userId": currentUser
    }),
    dataType: 'json',
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }).done(function (data) {
    $('#saveEventButton').remove();
    $('.controlButtons').append('<button id="savedEventButton">Saved</button>');
  }).fail(function (data) {
    console.log("failed to save Event");
  });
};

gigcity.individualEventFunction = function () {
  var token = localStorage.getItem("token");
  var currentUser = localStorage.getItem("userId");

  $.ajax({
    url: '/api/users/' + currentUser + '/events/' + gigcity.currentEvent,
    method: "GET",
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }).done(function (data) {
    gigcity.deleteEventFunction(data[0]._id, true);
  }).fail(function (data) {
    console.log("failed to get event");
  });
};

gigcity.deleteEventFunction = function (eventId, removeControls) {
  var token = localStorage.getItem("token");
  var currentUser = localStorage.getItem("userId");

  $.ajax({
    url: '/api/saveEvents/' + eventId,
    method: "DELETE",
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }).done(function (data) {
    if (removeControls) {
      $('#savedEventButton').remove();
      $('.controlButtons').append('<button id="saveEventButton">Save Event</button>');
    } else if (!removeControls) {
      gigcity.showEventsPage();
    }
  }).fail(function (data) {
    console.log("failed to delete Event", event);
  });
};

gigcity.getUserEvents = function (checking) {
  var token = localStorage.getItem("token");
  var currentUser = localStorage.getItem("userId");

  $.ajax({
    url: '/api/users/' + currentUser + '/events',
    method: "GET",
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
    }
  }).done(function (data) {
    if (checking) {
      gigcity.isSavedEvent(data);
    } else {
      gigcity.eventPageIndex(data);
    }
  }).fail(function (data) {
    console.log("failed to get events");
  });
};

gigcity.isSavedEvent = function (data) {
  var item = $.grep(data, function (item) {
    return item.skiddleId == gigcity.currentEvent;
  });

  if (item.length) {
    $('.controlButtons').append('<button id="savedEventButton">Saved</button>');
  } else {
    $('.controlButtons').append('<button id="saveEventButton">Save Event</button>');
  }
};

gigcity.eventPageIndex = function (data) {
  data.forEach(function (element) {
    gigcity.getIndividualEvent(element.skiddleId, element._id);
  });
};

gigcity.createEventCard = function (data, elementId) {
  console.log(elementId);
  console.log(data);
  $('.cardContainer').append('\n      <div class="eventcard">\n        <div class="column--one">\n          <img src=\'' + data.results.largeimageurl + '\'/>\n          <div class="socialIconContainer">\n          <a href="' + data.results.venue.link + '" class="btn"><img src="../../assets/images/info.svg"/ class="icons" alt="more information"></a>\n          <a href="https://en-gb.facebook.com/"><img src="../../assets/images/facebook.svg"/ class="icons" alt="facebook"></a>\n          <a href="https://twitter.com/intent/tweet?button_hashtag=LoveGigCity" data-show-count="false"><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script><img src="../../assets/images/twitter.svg"/ class="icons" alt="twitter"></a>\n          <img src="../../assets/images/trash.svg"/ class="icons binIcon" id="' + elementId + '" alt="delete"></a>\n          </div>\n        </div>\n        <div class="column--two">\n          <div><h3>' + data.results.eventname + '</h3></div>\n          <div><div>Venue: ' + data.results.venue.name + '</div><div>Price: ' + data.results.entryprice + '</div></div>\n          <div><div>Location: ' + data.results.venue.address + ', ' + data.results.venue.town + ', ' + data.results.venue.postcode + '</div></div>\n          <div><p> ' + data.results.description + '.</p></div>\n          <div>When: ' + data.results.date + '<strong>Doors open</strong> at ' + data.results.openingtimes.doorsopen + '.</div>\n        </div>\n      </div>\n    ');
};

gigcity.refreshPage = function () {
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  location.reload();
};

gigcity.liteRefreshPage = function () {
  location.reload();
};

gigcity.closeSignForm = function () {
  $('.signUpForm').hide();
};

document.addEventListener('DOMContentLoaded', function () {
  gigcity.init();
});