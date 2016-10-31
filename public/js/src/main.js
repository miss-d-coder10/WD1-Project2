  let $main = $('main');

  var googleMap = googleMap || {};

  googleMap.getEvents = function() {
    $.ajax({
      url: '/api/events',
      method: "GET",
      data: {
        lat:51.489915,
        lng:-0.137818,
        radius:15,
        eventcode:"LIVE",
        limit:100
      }
    })
    .done(this.loopThroughEvents);
  };

  googleMap.loopThroughEvents = (data) => {
    console.log(data);
    $.each(data, (index, eventObject) => {
      googleMap.createMarker(eventObject);
    });
  };


  //BUILDING THE MAP IN THE MAP


  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  googleMap.createMarker = (eventObject) => {
    let latLng = new google.maps.LatLng(eventObject.venue.latitude, eventObject.venue.longitude);
    let marker = new google.maps.Marker({
      position: latLng,
      map: googleMap.map
    });
  };


  googleMap.mapSetup = function() {
    let $mapDiv = $('#map');

    let mapOptions = {
      center: { lat: 51.5074, lng: -0.1278 },
      zoom: 12
    };
    this.map =new google.maps.Map($mapDiv[0], mapOptions);
    this.getEvents();
  };

$(googleMap.mapSetup.bind(googleMap));
