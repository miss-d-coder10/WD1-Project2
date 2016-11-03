"use strict";

var $userFirstName = void 0;
var $userLastName = void 0;

giggity.isLoggedIn = function () {
  return !!localStorage.getItem('token');
};

//create user and log in
giggity.signUp = function () {
  if (!$(".signUpForm").length) {
    console.log("CLICK");
    $("body").prepend(giggity.signUpFormObject);
  }
};

//handle form
giggity.handleUserForm = function () {
  if (event) event.preventDefault();
  var token = localStorage.getItem("token");
  var $form = $(this);
  var url = $form.attr("action");
  var method = $form.attr("method");
  var data = $form.serialize();
  console.log(data);
  $.ajax({
    url: url,
    method: method,
    data: data,
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
    }
  }).done(function (data) {
    if (data.user._id) localStorage.setItem('userId', data.user._id);
    if (data.token) localStorage.setItem('token', data.token);
    $('.signUpForm').remove();
    $('.accountButton').show();
    $('.signUpButton').hide();
  }).fail(function () {
    console.log("failed to log in");
  });
};

giggity.toggleAccountMenu = function () {
  $('.accountMenu').toggle();
};
// ----------------------------------------------------------------------------------------------------------------
giggity.getUserData = function () {
  $('.accountMenu').toggle();
  console.log("In get User Data");
  var token = localStorage.getItem('token');
  var userId = localStorage.getItem('userId');
  $.ajax({
    url: "/api/users/" + userId,
    method: "GET",
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader('Authorization', "Bearer " + token);
    }
  }).done(function (data) {
    console.log("Weve got the data");
    console.log(data.user);
    giggity.showProfilePage(data.user);
  });
};

giggity.showProfilePage = function (user) {
  var token = localStorage.getItem('token');
  console.log("In the edit user form");
  var userId = localStorage.getItem('userId');
  $(".popUp").html("\n                      <div class=\"accountSettings\">\n                        <img src='../../assets/images/noun.png'>\n                        <h3>Account Settings</h3>\n                        <form class=\"accountSettingsForm\" method=\"put\" action=\"/api/users/" + user._id + "\">\n                          <input type=\"text\" name=\"user[firstName]\" value=\"" + user.firstName + "\" placeholder=\"First name\">\n                          <input type=\"text\" name=\"user[lastName]\" value=\"" + user.lastName + "\" placeholder=\"Last name\">\n                          <input type=\"text\" name=\"user[email]\" value=\"" + user.email + "\" placeholder=\"Email\">\n                          <textarea class=\"u-full-width\" placeholder=\"Bio \u2026\" id=\"exampleMessage\"></textarea>\n                          <button class=\"btn btn-primary u-full-width\">Update details</button>\n                          <button class=\"deleteProfileButton u-full-width\">Delete Profile</button>\n                        </form>\n                      </div>");
  $(".popUp").show();
};

giggity.updateUserForm = function () {
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
    console.log(data);
  });
};

giggity.deleteUser = function () {
  var token = localStorage.getItem('token');
  var userId = localStorage.getItem('userId');

  console.log("in delete user");
  $.ajax({
    url: "/api/users/" + userId,
    method: 'DELETE',
    beforeSend: function beforeSend(jqXHR) {
      if (token) return jqXHR.setRequestHeader("Authorization", "Bearer " + token);
    }
  }).done(function (data) {
    console.log("User profile deleted");
    giggity.refreshPage();
  });
};

giggity.showEventsPage = function () {
  event.preventDefault();
  console.log('CLICK');
  giggity.$main.html('<div class="cardContainer"></div>');
  giggity.getUserEvents(false);
};