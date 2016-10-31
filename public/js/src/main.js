  const giggity = giggity || {};
  let $main = $('main');
  let markers;

  giggity.map = null;
  giggity.currentLat = null;
  giggity.currentLng = null;

  //BUILDING THE MAP IN THE MAP
  giggity.mapSetup = function() {
    let $mapDiv = $('#map');

    let mapOptions = {
      center: { lat: 51.5074, lng: -0.1278 },
      zoom: 12
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.createPartial('formContainer');
    setTimeout(function(){
      giggity.autoComplete();
      giggity.formHandler();
    }, 1000);
  };

  giggity.getEvents = function(lat, lng, radius, eventcode) {
    $.ajax({
      url: '/api/events',
      method: "GET",
      data: {
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

    var markerId = Math.floor(Math.random() * 1000000);

    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map
    });
    giggity.addInfoWindow(eventObject, marker);
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

  markers = [];
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


giggity.formHandler = function() {
  let $formContainer = $('.formContainer');
  $formContainer.on("submit", '#event-selector', function(e) {
    emptyMarkerArray();
    let $form = $(this);
    e.preventDefault();
    let data = $form.serializeArray();
    let lat = giggity.currentLat;
    let lng = giggity.currentLng;
    let radius = data[2].value;
    let eventcode = data[3].value;
    giggity.getEvents(lat, lng, radius, eventcode);
  });
};

function emptyMarkerArray(){
  if(markers !== null) {
    markers = [];
  }
}

// function setMapOnAll(map) {
//         for (var i = 0; i < markers.length; i++) {
//           console.log(markers[i]);
//           markers[i].setMap(map);
//         }
//       }

function deleteMarkers(){
  setMapOnAll(null);
  markers = [];
}
