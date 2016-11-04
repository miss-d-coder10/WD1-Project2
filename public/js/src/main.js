  let gigcity = gigcity || {};
  let markers = [];
  let currentlatLng;
  let lat;
  let lng;
  let $info = $('.eventObjects');
  let gigClicked = false;
  let directionsDisplay = null;

  gigcity.init = function() {
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

  gigcity.initEventListeners = function() {
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
    this.$body.on("click", ".binIcon", function(){
      let eventId = event.srcElement.id;
      gigcity.deleteEventFunction(eventId, false);
    });
  };

  gigcity.checkLoginStatus = function(){
    if (gigcity.isLoggedIn()){
      $('.accountButton').show();
    } else {
      $('.signUpButton').show();
    }
  };

  //BUILDING THE MAP IN THE MAP
  gigcity.mapSetup = function() {
    gigcity.getLocation();
    let $mapDiv = $('#map');
    let mapOptions = {
      zoom: 12,
      styles: gigcity.mapSettings
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.createFormContainer();
    this.createHeader();
  };



  gigcity.formHandler = function(e) {
      gigcity.deleteMarkers();
      let $form = $(this);
      event.preventDefault();
      let data = $form.serializeArray();
      let unformattedDate = data[0];
      let date = gigcity.dateFormat(unformattedDate);
      let lat = gigcity.currentLat;
      let lng = gigcity.currentLng;
      let radius = data[2].value;
      let eventcode = data[3].value;
      gigcity.getEvents(date, lat, lng, radius, eventcode);
  };

  gigcity.dateFormat = function(date){
    let today = moment();
    let maxDate;

    if (date.value === 'Today') {
      maxDate = moment(today).format("YYYY-MM-DD");
    } else if (date.value === 'Anytime') {
        let anytime = today.add(30, 'days');
        maxDate = moment(anytime).format("YYYY-MM-DD");
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

  gigcity.newSearchFunction = function(){
    gigcity.deleteMarkers();
    gigcity.createFormContainer();
  };

  gigcity.createFormContainer = function(){
    $('.formContainer').html(gigcity.formContainerObject);
    this.autoComplete();
  };

  gigcity.createHeader = function(){
    $('header').html(gigcity.headerObject);
  };


  gigcity.getEvents = function(date, lat, lng, radius, eventcode) {
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
    .done(this.loopThroughEvents.bind(gigcity));
  };

  gigcity.getIndividualEvent = function(eventId, elementId) {
    $.ajax({
      contentType: 'application/json',
      url: `/api/events/${eventId}`,
      method: "GET",
      dataType: 'json'
    })
    .done((data) => {
      gigcity.createEventCard(data, elementId);
    });
  };

  gigcity.removeEventObject = function(){
    $('.eventObjects').remove();
    gigcity.createFormContainer();

  };

  gigcity.loopThroughEvents = function(data) {
    $.each(data, (index, eventObject) => {
      this.createMarker(eventObject, "pin");
    });


    //RESTAURANTS
  gigcity.$formContainer.on("click", '#nearbyRestaurantsButton', function() {
    $info = $('.eventObjects');
    lat = $info.data('lat');
    lng = $info.data('lng');

    let latLng = { lat: lat, lng: lng };

    let service = new google.maps.places.PlacesService(gigcity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      type: ['restaurant'],
      zagatselected:true,
      rankby: "prominence"
    }, gigcity.callback);
  });

  //PUBS AND BARS
  gigcity.$formContainer.on("click", '#nearbyPubsButton', function() {
    let methodOfTravel;
    $info = $('.eventObjects');
    lat = $info.data('lat');
    lng = $info.data('lng');
    let latLng = { lat: lat, lng: lng };
    let service = new google.maps.places.PlacesService(gigcity.map);
    service.nearbySearch({
      location: latLng,
      radius: 500,
      type: ['bar'],
      zagatselected:true,
      rankby: "prominence"
    }, gigcity.callback);
  });




    //DIRECTIONS
    gigcity.$formContainer.on("click", '#getDirectionsButton', function() {
      gigClicked = true;
      let directionsService;
      if(directionsDisplay) directionsDisplay.setMap(null);
      let $methodOfTravel = $('#methodofTravel').val();
      navigator.geolocation.getCurrentPosition((position) => {
        currentlatLng = {     lat: position.coords.latitude,
                              lng: position.coords.longitude
                        };
        $info = $('.eventObjects');
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
              map: gigcity.map,
              directions: response
            });
          }
        });
      });
    });
  };


  gigcity.callback = function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        let type = results[i].types['0'];
        gigcity.restaurantMarkerFunction(results[i], type);
      }
    }
  };

  gigcity.restaurantMarkerFunction = function(place, type) {
    let placeLoc = place.geometry.location;
    let markerIcon;
    if (type == 'bar'){
      markerIcon = gigcity.icons.bar.icon;
    } else {
      markerIcon = gigcity.icons.restuarant.icon;
    }
    let marker = new google.maps.Marker({
      map: this.map,
      position: place.geometry.location,
      icon: markerIcon,
      animation: google.maps.Animation.DROP,
    });

    let infowindow = new google.maps.InfoWindow();

    google.maps.event.addListener(marker, 'click', function() {
      infowindow.setContent(place.name);
      infowindow.open(this.map, this);
    });// Shows small window for restuarant
  };

  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  gigcity.createMarker = function (markerObject, markerType) {
    let latLng;
    if (markerObject.venue){
      latLng = new google.maps.LatLng(markerObject.venue.latitude, markerObject.venue.longitude);
    } else if (markerObject.coords){
      latLng = new google.maps.LatLng(markerObject.coords.latitude, markerObject.coords.longitude);
    }

    let marker = new google.maps.Marker({
      position: latLng,
      icon: gigcity.icons[markerType].icon,
      map: this.map,
      animation: google.maps.Animation.DROP,
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
      icon: "../../assets/images/restaurant.png"
    },
    bar: {
      icon: "../../assets/images/beer.png"
    }
  };


gigcity.autoComplete = function(){
  var input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);

  gigcity.map.addListener('bounds_changed', function(){

    searchBox.setBounds(gigcity.map.getBounds());
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
  gigcity.clearMarkers = function() {
    gigcity.setMapOnAll(null);
  };

  // Shows any markers currently in the array.
  gigcity.showMarkers = function() {
    gigcity.setMapOnAll(map);
  };

  // Deletes all markers in the array by removing references to them.
  gigcity.deleteMarkers = function() {
    gigcity.clearMarkers();
    markers = [];
  };

  gigcity.eventInformation = function(eventObject, marker) {
    google.maps.event.addListener(marker, "click", () => {
      gigcity.getUserEvents(true);
      gigcity.currentEvent = eventObject.id;
      gigcity.$formContainer.html(
        `<div class="eventObjects" data-lat=${eventObject.venue.latitude} data-lng=${eventObject.venue.longitude}>
          <div class="column--one">
            <div class="column--one--one">
              <img src='${eventObject.imageurl}'>
              <h2>${eventObject.eventname}</h2>
              <p>Price: ${eventObject.entryprice}</p>
            </div>
            <div class="column--one--two">
              <p>When: ${eventObject.date}</p>
              <p>${eventObject.venue.name} - ${eventObject.venue.address}</p>
            </div>
          </div>
          <div class="column--two">
            <div class="nearby">
              <button id="nearbyRestaurantsButton">Restaurant</button>
              <button id="nearbyPubsButton">Pubs and Bars</button>
            </div>
            <div class="directions">
              <select id="methodofTravel">
                <option disabled="disabled">How are you travelling?</option>
                <option value="DRIVING">DRIVING</option>
                <option value="WALKING">WALKING</option>
                <option value="BICYCLING">BICYCLING</option>
                <option value="TRANSIT">TRANSIT</option>
              </select>
              <button id="getDirectionsButton">Get Directions</button>
            </div>
            <div class="controlButtons">
              <button id="newSearchButton">New Search</button>
            </div>
          </div>
        </div>`
      );
      if (!gigcity.isLoggedIn()){
        $('.controlButtons').append('<button id="saveEventButton">Save Event</button>');
      }
    });
  };


// Current Location
gigcity.getLocation = function(){
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
      gigcity.currentLat = position.coords.latitude;
      gigcity.currentLng = position.coords.longitude;

    gigcity.createMarker(position, "location");
    gigcity.map.panTo(latLng);
    gigcity.map.setZoom(12);
  });
  return;
};


gigcity.openTab = function(tabName) {
  if(tabName == 'signUp'){
    $('#signUp').show();
    $('#signIn').hide();
  } else if (tabName == 'signIn') {
    $('#signUp').hide();
    $('#signIn').show();
  }
};


gigcity.saveEventFunction = function(){
  if(!gigcity.isLoggedIn()){
    gigcity.signUp();
    return;
  }
  let token = localStorage.getItem("token");
  let currentUser = localStorage.getItem("userId");

  $.ajax({
    contentType: 'application/json',
    url:"/api/saveEvents",
    method: "POST",
    data: JSON.stringify({
      "skiddleId": gigcity.currentEvent,
      "userId": currentUser
    }),
    dataType: 'json',
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    $('#saveEventButton').remove();
    $('.controlButtons').append('<button id="savedEventButton">Saved</button>');
  })
  .fail((data) => {console.log("failed to save Event");});
};



gigcity.individualEventFunction = function(){
  let token = localStorage.getItem("token");
  let currentUser = localStorage.getItem("userId");

  $.ajax({
    url:`/api/users/${currentUser}/events/${gigcity.currentEvent}`,
    method: "GET",
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    gigcity.deleteEventFunction(data[0]._id, true);
  })
  .fail((data) => {console.log("failed to get event");});
};




gigcity.deleteEventFunction = function(eventId, removeControls){
  let token = localStorage.getItem("token");
  let currentUser = localStorage.getItem("userId");

  $.ajax({
    url:`/api/saveEvents/${eventId}`,
    method: "DELETE",
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    if (removeControls){
      $('#savedEventButton').remove();
      $('.controlButtons').append('<button id="saveEventButton">Save Event</button>');
    } else if (!removeControls){
      gigcity.showEventsPage();
    }
  })
  .fail((data) => {console.log("failed to delete Event", event);});
};


gigcity.getUserEvents = function(checking){
  let token = localStorage.getItem("token");
  let currentUser = localStorage.getItem("userId");

  $.ajax({
    url:`/api/users/${currentUser}/events`,
    method: "GET",
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    if(checking){
      gigcity.isSavedEvent(data);
    } else {
      gigcity.eventPageIndex(data);
    }
  })
  .fail((data) => {console.log("failed to get events");});
};


gigcity.isSavedEvent = function(data){
  var item = $.grep(data, function(item) {
    return item.skiddleId == gigcity.currentEvent;
  });

  if (item.length) {
      $('.controlButtons').append('<button id="savedEventButton">Saved</button>');
  } else {
      $('.controlButtons').append('<button id="saveEventButton">Save Event</button>');
  }
};


gigcity.eventPageIndex = function(data){
  data.forEach(function(element) {
    gigcity.getIndividualEvent(element.skiddleId, element._id);
});
};

gigcity.createEventCard = function(data, elementId){
  $('.cardContainer').append(`
      <div class="eventcard">
        <div class="column--one">
          <img src='${data.results.largeimageurl}'/>
          <div class="socialIconContainer">
          <a href="${data.results.venue.link}" class="btn"><img src="../../assets/images/info.svg"/ class="icons" alt="more information"></a>
          <a href="https://en-gb.facebook.com/"><img src="../../assets/images/facebook.svg"/ class="icons" alt="facebook"></a>
          <a href="https://twitter.com/intent/tweet?button_hashtag=LoveGigCity" data-show-count="false"><script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script><img src="../../assets/images/twitter.svg"/ class="icons" alt="twitter"></a>
          <img src="../../assets/images/trash.svg"/ class="icons binIcon" id="${elementId}" alt="delete"></a>
          </div>
        </div>
        <div class="column--two">
          <div><h3>${data.results.eventname}</h3></div>
          <div><div>Venue: ${data.results.venue.name}</div><div>Price: ${data.results.entryprice}</div></div>
          <div><div>Location: ${data.results.venue.address}, ${data.results.venue.town}, ${data.results.venue.postcode}</div></div>
          <div><p> ${data.results.description}.</p></div>
          <div>When: ${data.results.date}<strong>Doors open</strong> at ${data.results.openingtimes.doorsopen}.</div>
        </div>
      </div>
    </div>
  `);
};

gigcity.refreshPage = function(){
  localStorage.removeItem('token');
  localStorage.removeItem('userId');
  location.reload();
};

gigcity.liteRefreshPage = function(){
  location.reload();
};

gigcity.closeSignForm = function(){
  $('.signUpForm').hide();
};


document.addEventListener('DOMContentLoaded', function() {
    gigcity.init();
});
