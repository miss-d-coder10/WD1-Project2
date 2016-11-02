"use strict";

var user = user || {};

setTimeout(function () {
  $(".signupbutton").on("click", user.signUp);
}, 500);

//create user
user.signUp = function () {
  if (!$(".signupform").length) {
    $("body").prepend("\n      <div class='signupform'>\n        <div class=\"registercontainer\">\n          <h2>Register</h2>\n          <form method=\"post\" action=\"/api/register\">\n          <div>\n            <input name=\"user[firstName]\" placeholder=\"First Name\">\n          </div>\n          <div>\n            <input name=\"user[lastName]\" placeholder=\"Last Name\">\n          </div>\n          <div>\n            <input name=\"user[email]\" placeholder=\"Email\">\n          </div>\n          <div>\n            <input type=\"password\" name=\"user[password]\" placeholder=\"Password\">\n          </div>\n          <div>\n            <input type=\"password\" name=\"user[passwordConfirmation]\" placeholder=\"Password Confirmation\">\n          </div>\n          <button>Register</button>\n          </form>\n        </div>\n      </div>\n    ");
  }
  $(".signupform").on("submit", "form", handleForm);
};

//handle form

function handleForm() {
  if (event) event.preventDefault();

  // let token = localStorage.getItem("token");

  var $form = $(this);
  var url = $form.attr("action");
  var method = $form.attr("method");
  var data = $form.serialize();

  $.ajax({
    url: url,
    method: method,
    data: data
    // beforeSend: function(jqXHR) {
    //   if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    // }
  }).done(function (data) {
    console.log(data);
    // if(data.token) localStorage.setItem('token', data.token);
    getUsers();
  });
}

//get users
function getUsers() {
  if (event) event.preventDefault();
  // let token = localStorage.getItem("token");

  $.ajax({
    url: "/api/users",
    method: "GET"
    // beforeSend: function(jqXHR) {
    //   if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
  }).done(function () {
    console.log("test");
    console.log(data);
  });
}

//show users

//show log in form
user.login = function () {
  if (!$(".loginform").length) {
    $("body").prepend("\n      <div class='loginform'>\n        <div class=\"logincontainer\">\n          <h2>Log in</h2>\n          <form method=\"post\" action=\"/api/login\">\n          <div>\n            <input name=\"user[firstName]\" placeholder=\"First Name\">\n          </div>\n          <div>\n            <input name=\"user[lastName]\" placeholder=\"Last Name\">\n          </div>\n          <div>\n            <input name=\"user[email]\" placeholder=\"Email\">\n          </div>\n          <button>Log in</button>\n          </form>\n        </div>\n      </div>\n    ");
  }
  $(".loginform").on("submit", "form", handleForm);
};