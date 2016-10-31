$(() =>{
  console.log('JQ working');
  const apiKey = "db7f4c46a760159833430e5dd92e1711";
  const requestRadius = '5';
  const requestLat = "51.5074";
  const requestLon = '0.1278';

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
  let $mapDiv = $('#map');
  let map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5014, lng: 0.1419 },
    zoom: 14
  });

});
