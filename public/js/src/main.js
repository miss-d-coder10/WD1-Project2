  var googleMap = googleMap || {};

  let $main = $('main');



  googleMap.getEvents = function() {
    $.ajax({
      url: '/api/events',
      method: "GET",
      data: {
        lat:51.489915,
        lng:-0.137818,
        radius:5,
        eventcode:"LIVE"
      }
    })
    .done(this.loopThroughEvents.bind(googleMap));
  };

  googleMap.loopThroughEvents = function (data) {
    console.log(this);
    $.each(data, (index, eventObject) => {
      googleMap.createMarker(eventObject);
    });
  };

  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  googleMap.createMarker = function (eventObject) {

    let latLng = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
    let marker = new google.maps.Marker({
      position: latLng,
      map: googleMap.map
    });
    googleMap.addInfoWindow(eventObject, marker);
  };

  //BUILDING THE MAP IN THE MAP
  googleMap.mapSetup = function() {
    let $mapDiv = $('#map');

    let mapOptions = {
      center: { lat: 51.5014, lng: 0.1419 },
      zoom: 14
    };

    this.map = new google.maps.Map($mapDiv[0], mapOptions);
    this.getEvents();
  };

  //ADDING INFO WINDOW
  googleMap.addInfoWindow = function (eventObject, marker) {

    console.log("In add info window");

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



$(googleMap.mapSetup.bind(googleMap));
