'use strict';

$(function () {

  var $main = $('main');

  $('.register').on('click', showRegisterForm);
  $('.login').on('click', showLoginForm);
  $('.gameIndex').on('click', getGames);
  $('.newGame').on('click', newGame);
  $('.logout').on('click', logout);
  $main.on('click', '.card', displayGame);
  $main.on('submit', 'form', handleForm);
  $main.on('click', 'button.delete', deleteGame);
  $main.on('click', 'button.edit', getGame);

  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  if (isLoggedIn()) {
    getGames();
  } else {
    showLoginForm();
  }

  function newGame() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>New Game</h2>\n      <form method="post" action="/api/games">\n        <div class="form-group">\n          <input class="form-control" name="name" placeholder="name">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="embed" placeholder="embed">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="image" placeholder="image">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="description" placeholder="description">\n        </div>\n        <button class="btn btn-primary">Create Game</button>\n      </form>\n    ');
  }

  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Register</h2>\n      <form method="post" action="/api/register">\n        <div class="form-group">\n          <input class="form-control" name="username" placeholder="Username">\n        </div>\n        <div class="form-group">\n          <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="passwordConfirmation" placeholder="Password Confirmation">\n        </div>\n        <button class="btn btn-primary">Register</button>\n      </form>\n    ');
  }

  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Login</h2>\n      <form method="post" action="/api/login">\n        <div class="form-group">\n          <input class="form-control" name="email" placeholder="Email">\n        </div>\n        <div class="form-group">\n          <input class="form-control" type="password" name="password" placeholder="Password">\n        </div>\n        <button class="btn btn-primary">Login</button>\n      </form>\n    ');
  }

  function showGame(game) {
    if (event) event.preventDefault();
    $main.html('\n      <div>\n        ' + game.embed + '\n      </div>\n      <button class="btn btn-danger delete" data-id="' + game._id + '">Delete</button>\n      <button class="btn btn-primary edit" data-id="' + game._id + '">Edit</button>\n    ');
  }

  function showEditForm(game) {
    if (event) event.preventDefault();
    $main.html('\n      <h2>Edit Game</h2>\n      <form method="put" action="/api/users/' + game._id + '">\n        <div class="form-group">\n          <input class="form-control" name="name" placeholder="name" value="' + game.name + '">\n          <input class="form-control" name="description" placeholder="description" value="' + game.description + '">\n        </div>\n        <button class="btn btn-primary">Update</button>\n      </form>\n    ');
  }

  function handleForm() {
    if (event) event.preventDefault();
    var token = localStorage.getItem('token');
    var $form = $(this);

    var url = $form.attr('action');
    var method = $form.attr('method');
    var data = $form.serialize();

    $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(function (data) {
      if (data.token) localStorage.setItem('token', data.token);
      getGames();
    }).fail(showLoginForm);
  }

  function getGames() {
    if (event) event.preventDefault();

    var token = localStorage.getItem('token');
    $.ajax({
      url: '/api/games',
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showGames).fail(showLoginForm);
  }

  function showGames(games) {
    var $row = $('<div class="row"></div>');
    games.forEach(function (game) {
      $row.append('\n        <div class="col-md-4">\n          <div class="card" data-id="' + game._id + '">\n            <img class="card-img-top" src="' + game.image + '" alt="Card image cap">\n            <div class="card-block">\n              <h4 class="card-title">' + game.name + '</h4>\n            </div>\n          </div>\n        </div>\n      ');
    });

    $main.html($row);
  }

  function deleteGame() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');

    $.ajax({
      url: '/api/games/' + id,
      method: "DELETE",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(getGames).fail(showLoginForm);
  }

  function displayGame() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');

    $.ajax({
      url: '/api/games/' + id,
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showGame).fail(showLoginForm);
  }

  function getGame() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');

    $.ajax({
      url: '/api/games/' + id,
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', 'Bearer ' + token);
      }
    }).done(showEditForm).fail(showLoginForm);
  }

  function logout() {
    if (event) event.preventDefault();
    localStorage.removeItem('token');
    showLoginForm();
  }
});