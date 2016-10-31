'use strict';

$(function () {
  console.log('JQ working');
  var apiKey = "db7f4c46a760159833430e5dd92e1711";
  var requestRadius = '5';
  var requestLat = "51.5074";
  var requestLon = '0.1278';

  var $main = $('main');

  var googleMap = googleMap || {};

  googleMap.getEvents = function () {
    $.get('http://www.skiddle.com/api/v1/events/?latitude=' + requestLat + '&longitude=' + requestLon + '&radius=' + requestRadius + '&eventcode=LIVE&api_key=' + apiKey);
  };

  // $('.register').on('click', showRegisterForm);
  // $('.login').on('click', showLoginForm);
  // $('.gameIndex').on('click', getGames);
  // $('.newGame').on('click', newGame);
  // $('.logout').on('click', logout);
  // $main.on('click', '.card', displayGame);
  // $main.on('submit', 'form', handleForm);
  // $main.on('click', 'button.delete', deleteGame);
  // $main.on('click', 'button.edit', getGame);
  //
  //
  // function isLoggedIn() {
  //   return !!localStorage.getItem('token');
  // }
  //
  // if(isLoggedIn()) {
  //   getGames();
  // } else {
  //   showLoginForm();
  // }
  //
  // function newGame() {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>New Game</h2>
  //     <form method="post" action="/api/games">
  //       <div class="form-group">
  //         <input class="form-control" name="name" placeholder="name">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="embed" placeholder="embed">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="image" placeholder="image">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="description" placeholder="description">
  //       </div>
  //       <button class="btn btn-primary">Create Game</button>
  //     </form>
  //   `);
  // }
  //
  // function showRegisterForm() {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Register</h2>
  //     <form method="post" action="/api/register">
  //       <div class="form-group">
  //         <input class="form-control" name="username" placeholder="Username">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" name="email" placeholder="Email">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="password" placeholder="Password">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">
  //       </div>
  //       <button class="btn btn-primary">Register</button>
  //     </form>
  //   `);
  // }
  //
  // function showLoginForm() {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Login</h2>
  //     <form method="post" action="/api/login">
  //       <div class="form-group">
  //         <input class="form-control" name="email" placeholder="Email">
  //       </div>
  //       <div class="form-group">
  //         <input class="form-control" type="password" name="password" placeholder="Password">
  //       </div>
  //       <button class="btn btn-primary">Login</button>
  //     </form>
  //   `);
  // }
  //
  // function showGame(game){
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <div>
  //       ${game.embed}
  //     </div>
  //     <button class="btn btn-danger delete" data-id="${game._id}">Delete</button>
  //     <button class="btn btn-primary edit" data-id="${game._id}">Edit</button>
  //   `);
  // }
  //
  // function showEditForm(game) {
  //   if(event) event.preventDefault();
  //   $main.html(`
  //     <h2>Edit Game</h2>
  //     <form method="put" action="/api/users/${game._id}">
  //       <div class="form-group">
  //         <input class="form-control" name="name" placeholder="name" value="${game.name}">
  //         <input class="form-control" name="description" placeholder="description" value="${game.description}">
  //       </div>
  //       <button class="btn btn-primary">Update</button>
  //     </form>
  //   `);
  // }
  //
  // function handleForm() {
  //   if(event) event.preventDefault();
  //   let token = localStorage.getItem('token');
  //   let $form = $(this);
  //
  //   let url = $form.attr('action');
  //   let method = $form.attr('method');
  //   let data = $form.serialize();
  //
  //   $.ajax({
  //     url,
  //     method,
  //     data,
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   }).done((data) => {
  //     if(data.token) localStorage.setItem('token', data.token);
  //     getGames();
  //   }).fail(showLoginForm);
  // }
  //
  // function getGames() {
  //   if(event) event.preventDefault();
  //
  //   let token = localStorage.getItem('token');
  //   $.ajax({
  //     url: '/api/games',
  //     method: "GET",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(showGames)
  //   .fail(showLoginForm);
  // }
  //
  // function showGames(games) {
  //   let $row = $('<div class="row"></div>');
  //   games.forEach((game) => {
  //     $row.append(`
  //       <div class="col-md-4">
  //         <div class="card" data-id="${game._id}">
  //           <img class="card-img-top" src="${game.image}" alt="Card image cap">
  //           <div class="card-block">
  //             <h4 class="card-title">${game.name}</h4>
  //           </div>
  //         </div>
  //       </div>
  //     `);
  //   });
  //
  //   $main.html($row);
  // }
  //
  // function deleteGame() {
  //   let id = $(this).data('id');
  //   let token = localStorage.getItem('token');
  //
  //   $.ajax({
  //     url: `/api/games/${id}`,
  //     method: "DELETE",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(getGames)
  //   .fail(showLoginForm);
  // }
  //
  // function displayGame() {
  //   let id = $(this).data('id');
  //   let token = localStorage.getItem('token');
  //
  //   $.ajax({
  //     url: `/api/games/${id}`,
  //     method: "GET",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(showGame)
  //   .fail(showLoginForm);
  // }
  //
  // function getGame() {
  //   let id = $(this).data('id');
  //   let token = localStorage.getItem('token');
  //
  //   $.ajax({
  //     url: `/api/games/${id}`,
  //     method: "GET",
  //     beforeSend: function(jqXHR) {
  //       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  //     }
  //   })
  //   .done(showEditForm)
  //   .fail(showLoginForm);
  // }
  //
  // function logout() {
  //   if(event) event.preventDefault();
  //   localStorage.removeItem('token');
  //   showLoginForm();
  // }

  //BUILDING THE MAP IN THE MAP
  var $mapDiv = $('#map');
  var map = new google.maps.Map($mapDiv[0], {
    center: { lat: 51.5014, lng: 0.1419 },
    zoom: 14
  });
});