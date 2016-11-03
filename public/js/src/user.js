giggity.isLoggedIn = function(){
  return !!localStorage.getItem('token');
};

//create user and log in
giggity.signUp = function () {
  if(!($(".signUpForm").length)){
    console.log("CLICK");
    $("body").prepend(giggity.signUpFormObject);
  }
};

//handle form

giggity.handleUserForm = function() {
  if(event) event.preventDefault();
  let token = localStorage.getItem("token");
  let $form = $(this);
  let url = $form.attr("action");
  let method = $form.attr("method");
  let data = $form.serialize();

  $.ajax({
    url,
    method,
    data,
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    if(data.user._id) localStorage.setItem('userId' ,data.user._id);
    if(data.token) localStorage.setItem('token', data.token);
    $('.signUpForm').remove();
    $('.accountButton').show();
    $('.signUpButton').hide();
  })
  .fail(() => {console.log("failed to log in");});
};

// //get users
//  giggity.getUsers = function(){
//     if (event) event.preventDefault();
//     let token = localStorage.getItem("token");
//
//     $.ajax({
//       url: "/api/users",
//       method: "GET",
//       beforeSend: function(jqXHR) {
//         if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
//       }
//       })
//     .done((data) => {
//       console.log("success");
//       console.log(data.users);
//     });
//   };

  giggity.toggleAccountMenu = function(){
    console.log('CLICK');
    $('.accountMenu').toggle();
  };

  giggity.showProfilePage = function(){
    giggity.$main.html('');
  };

  giggity.showEventsPage = function(){
    giggity.$main.html('');
  };
