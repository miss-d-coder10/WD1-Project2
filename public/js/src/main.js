  let giggity = giggity || {};
  let $main = $('main');
  let markers = [];
  let currentlatLng;
  let lat;
  let lng;
  let $info = $('.eventObects');

  giggity.map = null;
  giggity.currentLat = null;
  giggity.currentLng = null;

  //BUILDING THE MAP IN THE MAP
  giggity.mapSetup = function() {
    giggity.getLocation();


    let $mapDiv = $('#map');

    let mapOptions = {
      zoom: 12,
      styles: [
                {
                    "featureType": "administrative",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#6195a0"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#f2f2f2"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#ffffff"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.park",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#e6f3d6"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 45
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#f4d2c5"
                        },
                        {
                            "visibility": "simplified"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "color": "#4e4e4e"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#f4f4f4"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.text.fill",
                    "stylers": [
                        {
                            "color": "#787878"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "color": "#eaf6f8"
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry.fill",
                    "stylers": [
                        {
                            "color": "#eaf6f8"
                        }
                    ]
                }
            ]
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.createPartial('formContainer', '.formContainer');
    this.createPartial('header', 'header');
    setTimeout(function(){
      giggity.formHandler();
    }, 1000);
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

  giggity.loopThroughEvents = function(data) {
    $.each(data, (index, eventObject) => {
      giggity.createMarker(eventObject, "pin");
    });
    let $formContainer = $('.formContainer');
    $formContainer.on("click", '#removeEventButton', function() {
      console.log("In the remove section");
      $('.eventObects').remove();
    });

    //RESTAURANTS
    $formContainer.on("click", '#nearbyRestaurantsButton', function() {
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
    $formContainer.on("click", '#nearbyPubsButton', function() {
      let methodOfTravel;

      console.log("trying to find pub");
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

    $formContainer.on("click", '#getDirectionsButton', function() {
      var directionsDisplay;
      directionsDisplay = new google.maps.DirectionsRenderer({
        map: null
      });
      let $methodOfTravel = ($('#methodofTravel').val());
      navigator.geolocation.getCurrentPosition((position) => {
        currentlatLng = {     lat: position.coords.latitude,
                              lng: position.coords.longitude
                        };
        console.log(currentlatLng);

        $info = $('.eventObects');
        lat = $info.data('lat');
        lng = $info.data('lng');
        console.log(lat);
        console.log(lng);
        let latLng = { lat: lat, lng: lng };
        let directionsService = new google.maps.DirectionsService();
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
      console.log(results);
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
    });
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

  //ADDING INFO WINDOW
  giggity.addInfoWindow = function (eventObject, marker) {
    google.maps.event.addListener(marker, "click", () => {
      if(this.infoWindow) {
        this.infoWindow.close();
      }
      this.infoWindow = new google.maps.InfoWindow({
      content: `<h2>${eventObject.eventname}</h2>
                <p>${eventObject.venue.name}</p>
                <p>${eventObject.venue.address}</p>
                <p>${eventObject.date}</p>
                <p>${eventObject.entryprice}</p>
                <img src='${eventObject.imageurl}'</>`
    });
    this.infoWindow.open(this.map, marker);
  });
};


$(giggity.mapSetup.bind(giggity));

giggity.createPartial = function(partial, toGoIn){
  let load_from = `/partials/_${partial}.html`;
  let data = "";
  $.get(load_from, data, function(data)
  {
      $(`${toGoIn}`).html(data);
  });
  setTimeout(function() {
    if (partial === "formContainer"){
    giggity.autoComplete();
  }
}, 500);
  return;
};

giggity.autoComplete = function(){

  let map = giggity.map;
  var input = document.getElementById('pac-input');
  let searchBox = new google.maps.places.SearchBox(input);

  map.addListener('bounds_changed', function(){
    searchBox.setBounds(map.getBounds());
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
    map.fitBounds(bounds);
  });
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

giggity.formHandler = function() {
  let $formContainer = $('.formContainer');
  let $newSearchButton = $('#newSearchButton');
  $formContainer.on("submit", '#event-selector', function(e) {
    giggity.deleteMarkers();
    let $form = $(this);
    e.preventDefault();
    let data = $form.serializeArray();
    let unformattedDate = data[0];
    let date = giggity.dateFormat(unformattedDate);
    let lat = giggity.currentLat;
    let lng = giggity.currentLng;
    let radius = data[2].value;
    let eventcode = data[3].value;
    giggity.getEvents(date, lat, lng, radius, eventcode);
    giggity.createPartial('submittedFormContainer', '.formContainer');
    setTimeout(function(){
      $formContainer.on("click", '#newSearchButton', function() {
        giggity.deleteMarkers();
        giggity.createPartial('formContainer', '.formContainer');
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
    let $removeEventButton = $('#removeEventButton');
    let $eventContainer = $('.eventContainer');
    google.maps.event.addListener(marker, "click", () => {
    // if (!$eventContainer.contains('.eventObects')) {
    $eventContainer.html(`<div class="eventObects" data-lat=${eventObject.venue.latitude} data-lng=${eventObject.venue.longitude}>
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
    </div>`);
    });
  };


  //current location
  setTimeout(function(){
    $(".locationbutton").on("click", giggity.getLocation);
  }, 500);

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
  };

  //PROFILE PAGE
