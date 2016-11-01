  const giggity = giggity || {};
  let $main = $('main');
  let markers = [];

  giggity.map = null;
  giggity.currentLat = null;
  giggity.currentLng = null;

  //BUILDING THE MAP IN THE MAP
  giggity.mapSetup = function() {
    let $mapDiv = $('#map');

    let mapOptions = {
      center: { lat: 51.5074, lng: -0.1278 },
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
    this.createPartial('formContainer');
    setTimeout(function(){
      giggity.autoComplete();
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
      giggity.createMarker(eventObject);
    });
  };

  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  giggity.createMarker = function (eventObject) {
    let latLng = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });
    markers.push(marker);
    giggity.addInfoWindow(eventObject, marker);
    markers.push(marker);
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

giggity.createPartial = function(partial){
  let load_from = `/partials/_${partial}.html`;
  let data = "";
  $.get(load_from, data, function(data)
  {
      $(`.${partial}`).html(data);
  });
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
    if (places.length == 0) {
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
    // console.log(maxDate);
  } else if (date.value === 'Next 7 days') {
      let week = today.add(7, 'days');
      maxDate = moment(week).format("YYYY-MM-DD");
      // return console.log(maxDate);
  } else if (date.value === 'Tomorrow') {
      let tomorrow = today.add(1, 'days');
      maxDate = moment(tomorrow).format("YYYY-MM-DD");
      // return console.log(maxDate);
  } else if (date.value === 'Next 14 days'){
      let twoWeeks = today.add(14, 'days');
      maxDate = moment(twoWeeks).format("YYYY-MM-DD");
      // return console.log(maxDate);
  } else if (date.value === 'Next 1 Month'){
      let month = today.add(30, 'days');
      maxDate = moment(month).format("YYYY-MM-DD");
      // return console.log(maxDate);
  }
  return maxDate;
};

giggity.formHandler = function() {
  let $formContainer = $('.formContainer');
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

//current location


setTimeout(function(){
  $(".locationbutton").on("click", giggity.getLocation);
}, 500);

// let clicked = false;

giggity.getLocation = function(){
  console.log("click");
  // if(clicked === false){
  //   // this.infoWindow.close();
  // }
  navigator.geolocation.getCurrentPosition((position) => {

    let latLng = {lat: position.coords.latitude,
                  lng: position.coords.longitude
                };
                console.log(position.coords.latitude, position.coords.longitude);

    giggity.map.panTo(latLng);
    giggity.map.setZoom(16);
    let marker = new google.maps.Marker({
        position: latLng,
        map: giggity.map
    });
    var circle = new google.maps.Circle({
        center: latLng,
        radius: position.coords.accuracy,
        map: giggity.map,
        fillColor: '#0000FF',
        fillOpacity: 0.1,
        strokeColor: '#0000FF',
        strokeOpacity: 0.2
      });
      giggity.map.fitBounds(circle.getBounds());
  });
};
