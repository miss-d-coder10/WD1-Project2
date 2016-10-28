"use strict";

$(function () {
  var $main = $("main");

  $(".register").on("click", showRegisterForm);
  $(".login").on("click", showLoginForm);
  $(".pizzas").on("click", getPizzas);
  $(".logout").on("click", logout);
  $main.on("submit", "form", handleForm);
  $main.on("click", "button.delete", deletePizza);
  $main.on("click", "button.edit", getPizza);

  function isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  if (isLoggedIn()) {
    getPizzas();
  } else {
    showLoginForm();
  }

  function showRegisterForm() {
    if (event) event.preventDefault();
    $main.html("\n      <h2>Register</h2>\n      <form method=\"post\" action=\"/api/register\">\n      <div>\n        <input name=\"user[username]\" placeholder=\"Username\">\n      </div>\n      <div>\n      <input name=\"user[email]\" placeholder=\"Email\">\n      </div>\n      <div>\n        <input type=\"password\" name=\"user[password]\" placeholder=\"Password\">\n      </div>\n      <div>\n        <input type=\"password\" name=\"user[passwordConfirmation]\" placeholder=\"Password Confirmation\">\n      </div>\n      <button>Register</button>\n      </form>\n    ");
  }

  function showLoginForm() {
    if (event) event.preventDefault();
    $main.html("\n      <h2>Login</h2>\n      <form method=\"post\" action=\"/api/login\">\n      <div>\n      <input name=\"email\" placeholder=\"Email\">\n      </div>\n      <div>\n        <input type=\"password\" name=\"password\" placeholder=\"Password\">\n      </div>\n      <button>Login</button>\n      </form>\n    ");
  }

  function handleForm() {
    if (event) event.preventDefault();

    var token = localStorage.getItem("token");

    var $form = $(this);
    var url = $form.attr("action");
    var method = $form.attr("method");
    var data = $form.serialize();

    $.ajax({
      url: url,
      method: method,
      data: data,
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(function (data) {
      if (data.token) localStorage.setItem('token', data.token);
      getPizzas();
    });
  }

  function getPizzas() {
    if (event) event.preventDefault();
    var token = localStorage.getItem("token");

    $.ajax({
      url: "/api/pizzas",
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(showPizzas);
  }

  function showPizzas(pizzas) {
    var $row = $("<div class='row'>\n        <div>\n          <h2>Add pizza</h2>\n          <form method=\"post\" action=\"/api/pizzas\">\n            <label for=\"name\">\n            <input name=\"name\" placeholder=\"Name\">\n            <label for=\"toppings\">\n            <input name=\"toppings[]\" placeholder=\"Toppings\">\n            <label for=\"isVegetarian\">\n            <input name=\"isVegetarian\" placeholder=\"Is it vegetarian? true/false\">\n            <label for=\"img\">\n            <input name=\"img\" placeholder=\"Image url\">\n            <button class=\"createPizza\">Add pizza</button>\n          </form>\n        </div>\n      </div>");

    pizzas.forEach(function (pizza) {
      if (pizza.isVegetarian) {
        $row.append("\n        <div>\n          <h2>" + pizza.name + "</h2>\n          <p>" + pizza.toppings + "</p>\n          <p>Vegetarian</p>\n          <img src=\"" + pizza.img + "\">\n          <button class=\"delete\" data-id=\"" + pizza._id + "\">Delete</button>\n          <button class=\"edit\" data-id=\"" + pizza._id + "\">Edit</button>\n        </div>\n        ");
      } else {
        $row.append("\n          <div>\n            <h2>" + pizza.name + "</h2>\n            <p>" + pizza.toppings + "</p>\n            <img src=\"" + pizza.img + "\">\n            <button class=\"delete\" data-id=\"" + pizza._id + "\">Delete</button>\n            <button class=\"edit\" data-id=\"" + pizza._id + "\">Edit</button>\n          </div>\n          ");
      }
    });
    $main.html($row);
  }

  function logout() {
    if (event) event.preventDefault();

    localStorage.removeItem('token');
    showLoginForm();
  }

  function deletePizza() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');

    $.ajax({
      url: "/api/pizzas/" + id,
      method: "DELETE",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(getPizzas).fail(showLoginForm);
  }

  function getPizza() {
    var id = $(this).data('id');
    var token = localStorage.getItem('token');

    $.ajax({
      url: "/api/pizzas/" + id,
      method: "GET",
      beforeSend: function beforeSend(jqXHR) {
        if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
      }
    }).done(showEditForm).fail(showLoginForm);
  }

  function showEditForm(pizza) {

    if (event) event.preventDefault();
    $main.html("\n    <form method=\"put\" action=\"/api/pizzas/" + pizza._id + "\">\n       <label for=\"name\">\n       <input name=\"name\" value=\"" + pizza.name + "\">\n       <label for=\"toppings\">\n       <input name=\"toppings[]\" value=\"" + pizza.toppings + "\">\n       <label for=\"isVegetarian\">\n       <input name=\"isVegetarian\" value=\"" + pizza.isVegetarian + "\">\n       <label for=\"img\">\n       <input name=\"img\" value=\"" + pizza.img + "\">\n       <button>Update pizza</button>\n    </form>\n   ");
  }
});