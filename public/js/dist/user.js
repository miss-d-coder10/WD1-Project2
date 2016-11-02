"use strict";

giggity.isLoggedIn = function () {
  return !!localStorage.getItem('token');
};

//create user
giggity.signUp = function () {
  if (!$(".signupform").length) {
    console.log("CLICK");
    $("body").prepend(giggity.signUpFormObject);
  }
};

//handle form

giggity.handleUserForm = function () {
  if (event) event.preventDefault();
  console.log("test");
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
    $('.signupform').remove();
    $('.accountButton').show();
    $('.signUpButton').hide();
  }).fail(console.log("failed to log in"));
};

//get users
giggity.getUsers = function () {
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
};