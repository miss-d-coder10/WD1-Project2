  let giggity = giggity || {};
  let markers = [];
  let currentlatLng;
  let lat;
  let lng;
  let $info = $('.eventObects');

  giggity.init = function() {
    this.map = null;
    this.currentLat = null;
    this.currentLng = null;
    this.currentEvent = null;
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

  giggity.initEventListeners = function() {
    this.$formContainer.on("submit", '#event-selector', giggity.formHandler);
    this.$formContainer.on("click", '#newSearchButton', giggity.newSearchFunction);
    this.$formContainer.on("click", '#saveEventButton', giggity.saveEventFunction);
    this.$formContainer.on("click", '#removeEventButton', giggity.removeEventObject);
    this.$formContainer.on("click", '.locationButton', giggity.getLocation);
    this.$header.on("click", ".signUpButton", giggity.signUp);
    this.$header.on("click", ".accountButton", giggity.toggleAccountMenu);
    this.$header.on("click", ".profileButton", giggity.showProfilePage);
    this.$body.on("submit", ".authform", giggity.handleUserForm);
  };

  giggity.checkLoginStatus = function(){
    if (giggity.isLoggedIn()){
      $('.accountButton').show();
    } else {
      $('.signUpButton').show();
    }
  };

  //BUILDING THE MAP IN THE MAP
  giggity.mapSetup = function() {
    giggity.getLocation();
    let $mapDiv = $('#map');
    let mapOptions = {
      zoom: 12,
      styles: giggity.mapSettings
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.createFormContainer();
    this.createHeader();
  };



  giggity.formHandler = function(e) {
      giggity.deleteMarkers();
      let $form = $(this);
      event.preventDefault();
      let data = $form.serializeArray();
      let unformattedDate = data[0];
      let date = giggity.dateFormat(unformattedDate);
      let lat = giggity.currentLat;
      let lng = giggity.currentLng;
      let radius = data[2].value;
      let eventcode = data[3].value;
      giggity.getEvents(date, lat, lng, radius, eventcode);
  };

  giggity.dateFormat = function(date){
    let today = moment();
    let maxDate;

    if (date.value === 'Today') {
      maxDate = moment(today).format("YYYY-MM-DD");
    } else if (date.value === 'Next 7 days') {
        let week = today.add(7, 'days');
        maxDate = moment(week).format("YYYY-MM-DD");
    } else if (date.value === 'Tomorrow') {
        let tomorrow = today.add(1, 'days');
        maxDate = moment(tomorrow).format("YYYY-MM-DD");
    } else if (date.value === 'Next 14 days'){
        let twoWeeks = today.add(14, 'days');
        maxDate = moment(twoWeeks).format("YYYY-MM-DD");
    } else if (date.value === 'Next 1 Month'){
        let month = today.add(30, 'days');
        maxDate = moment(month).format("YYYY-MM-DD");
    }
    return maxDate;
  };

  giggity.newSearchFunction = function(){
    giggity.deleteMarkers();
    giggity.createFormContainer();
  };

  giggity.createFormContainer = function(){
    $('.formContainer').html(giggity.formContainerObject);
    this.autoComplete();
  };

  giggity.createHeader = function(){
    $('header').html(giggity.headerObject);
  };


  giggity.getEvents = function(date, lat, lng, radius, eventcode) {
    $.ajax({
      url: '/api/events',
      method: "GET",
      data: {
        date: date,
        lat:lat,
        lng:lng,
        radius:radius,
        eventcode:eventcode,
        limit:100
      }
    })
    .done(this.loopThroughEvents.bind(giggity));
  };

  giggity.removeEventObject = function(){
    $('.eventObects').remove();
    giggity.createFormContainer();
  };

  giggity.loopThroughEvents = function(data) {
    $.each(data, (index, eventObject) => {
      this.createMarker(eventObject, "pin");
    });


    //RESTAURANTS
    giggity.$formContainer.on("click", '#nearbyRestaurantsButton', function() {
      $info = $('.eventObects');
      lat = $info.data('lat');
      lng = $info.data('lng');

      let latLng = { lat: lat, lng: lng };

      let service = new google.maps.places.PlacesService(giggity.map);
      service.nearbySearch({
        location: latLng,
        radius: 500,
        types: ['restaurant']
      }, giggity.callback);
    });
    //PUBS AND BARS
    giggity.$formContainer.on("click", '#nearbyPubsButton', function() {
      let methodOfTravel;
      $info = $('.eventObects');
      lat = $info.data('lat');
      lng = $info.data('lng');
      let latLng = { lat: lat, lng: lng };
      let service = new google.maps.places.PlacesService(giggity.map);
      service.nearbySearch({
        location: latLng,
        radius: 500,
        types: ['pub']
      }, giggity.callback);
    });
    //DIRECTIONS
    giggity.$formContainer.on("click", '#getDirectionsButton', function() {

      let $methodOfTravel = ($('#methodofTravel').val());
      navigator.geolocation.getCurrentPosition((position) => {
        currentlatLng = {     lat: position.coords.latitude,
                              lng: position.coords.longitude
                        };
        $info = $('.eventObects');
        lat = $info.data('lat');
        lng = $info.data('lng');
        let latLng = { lat: lat, lng: lng };
        directionsService = new google.maps.DirectionsService();
         let directionsRequest = {
           origin: currentlatLng,
           destination: latLng,
           travelMode: google.maps.DirectionsTravelMode[$methodOfTravel],
           unitSystem: google.maps.UnitSystem.METRIC
         };

        directionsService.route(directionsRequest, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay = new google.maps.DirectionsRenderer({
            map: giggity.map,
            directions: response
          });
        }
          else
            $("#error").append("Unable to retrieve your route<br />");
        });
      });

    });
  };



  giggity.callback = function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        giggity.restaurantMarkerFunction(results[i]);
      }
    }
  };

  giggity.restaurantMarkerFunction = function(place) {
    let placeLoc = place.geometry.location;
    let marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location
    });

    let infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(this.map, this);
    });// Shows small window for restuarant
  };

  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  giggity.createMarker = function (markerObject, markerType) {
    let latLng;
    if (markerObject.venue){
      latLng = new google.maps.LatLng(markerObject.venue.latitude, markerObject.venue.longitude);
    } else if (markerObject.coords){
      latLng = new google.maps.LatLng(markerObject.coords.latitude, markerObject.coords.longitude);
    }

    let marker = new google.maps.Marker({
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


giggity.autoComplete = function(){
  var input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);

  giggity.map.addListener('bounds_changed', function(){

    searchBox.setBounds(giggity.map.getBounds());
  });


  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();
    if (places.length === 0) {
      return;
    }
    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();

    places.forEach(function(place) {
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
  giggity.clearMarkers = function() {
    giggity.setMapOnAll(null);
  };

  // Shows any markers currently in the array.
  giggity.showMarkers = function() {
    giggity.setMapOnAll(map);
  };

  // Deletes all markers in the array by removing references to them.
  giggity.deleteMarkers = function() {
    giggity.clearMarkers();
    markers = [];
  };

  giggity.eventInformation = function(eventObject, marker) {
    google.maps.event.addListener(marker, "click", () => {
      giggity.currentEvent = eventObject.id;
      giggity.$formContainer.html(
        `<div class="eventObects" data-lat=${eventObject.venue.latitude} data-lng=${eventObject.venue.longitude}>
          <h2>${eventObject.eventname}</h2>
          <p>${eventObject.venue.name}</p>
          <p>${eventObject.venue.address}</p>
          <p>${eventObject.date}</p>
          <p>${eventObject.entryprice}</p>
          <img src='${eventObject.imageurl}'>
          <button id="removeEventButton">Remove</button>
          <button id="nearbyRestaurantsButton">Nearby Restaurant</button>
          <button id="nearbyPubsButton">Nearby Pubs and Bars</button>
          <button id="getDirectionsButton">Get Directions</button>
          <select id="methodofTravel">
          <option disabled="disabled">How are you travelling?</option>
            <option value="DRIVING">DRIVING</option>
            <option value="WALKING">WALKING</option>
            <option value="BICYCLING">BICYCLING</option>
            <option value="TRANSIT">TRANSIT</option>
          </select>
          <button id="saveEventButton">Save Event</button>
          <button id="newSearchButton">New Search</button>
        </div>`
      );
    });
  };


// Current Location
giggity.getLocation = function(){
  markers.forEach(function(marker){
    if (marker.metadata.id == "location"){
      let index = markers.indexOf(marker);
      markers[index].setMap(null);
    }
  });

navigator.geolocation.getCurrentPosition((position) => {
  let latLng = {lat: position.coords.latitude,
                lng: position.coords.longitude
              };
    giggity.createMarker(position, "location");
    giggity.map.panTo(latLng);
    giggity.map.setZoom(16);
  });
  return;
};


giggity.openTab = function(evt, tabName) {
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


giggity.saveEventFunction = function(){
  if(!giggity.isLoggedIn()){
    giggity.signUp();
    return;
  }
  let token = localStorage.getItem("token");
  let currentUser = localStorage.getItem("userId");

  $.ajax({
    contentType: 'application/json',
    url:"/api/saveEvents",
    method: "POST",
    data: JSON.stringify({
      "skiddleId": giggity.currentEvent,
      "userId": currentUser
    }),
    dataType: 'json',
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    console.log(data);
  })
  .fail((data) => {console.log("failed to save Event");});
};

giggity.isEventSaved = function(){

};








document.addEventListener('DOMContentLoaded', function() {
    giggity.init();
});
