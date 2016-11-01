let user = user || {};

setTimeout(function(){
  $(".signupbutton").on("click", user.signUp);
}, 500);

user.signUp = function () {
  $("body").append("<div class='signupform'></div>");
};
