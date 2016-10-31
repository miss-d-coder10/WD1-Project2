// $(() =>{

  let $main = $('main');

  var googleMap = googleMap || {};

  googleMap.getEvents = function() {
    $.ajax({
      url: '/api/events',
      method: "GET",
      data: {
        lat:51.5074,
        lng:0.1278,
        radius:5,
        eventcode:"LIVE"
      }
    })
    // .done((data) => {
    //   console.log("data", data);
    //
    // });
    .done(this.loopThroughEvents);
  };

  googleMap.loopThroughEvents = (data) => {
    $.each(data.Object, (index, eventObject) => {
      googleMap.createMarker(eventObject);
    });
  };


  //BUILDING THE MAP IN THE MAP


  //ADD FUNCTION WHICH DROPS THE MARKER ONTO THE MAP
  googleMap.createMarker = (eventObject) => {
    let latLng = new google.maps.LatLng(eventObject.lat, eventObject.lng);
    let marker = new google.maps.Marker({
      position: latLng,
      map: googleMap.map
    });
  };


  googleMap.mapSetup = function() {
    let $mapDiv = $('#map');

    let mapOptions = {
      center: { lat: 51.5014, lng: 0.1419 },
      zoom: 14
    };
    this.map =new google.maps.Map($mapDiv[0], mapOptions);
    this.getEvents();
  };


// });

$(googleMap.mapSetup.bind(googleMap));
