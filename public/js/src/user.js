let $userFirstName;
let $userLastName;

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
  console.log(data);
  $.ajax({
    url,
    method,
    data,
    beforeSend: function(jqXHR) {
      if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    }
  })
  .done((data) => {
    console.log(data);
    if(data.token) localStorage.setItem('token', data.token);
    if(data.user) localStorage.setItem('userId', data.user._id);
    $('.signUpForm').remove();
    $('.accountButton').show();
    $('.signUpButton').hide();
  })
  .fail(() => {console.log("failed to log in");});
};

//get users
 giggity.getUsers = function(){
   console.log("in get users");
    if (event) event.preventDefault();
    let token = localStorage.getItem("token");

    $.ajax({
      url: "/api/users",
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done((data) => {
      console.log("success");
      // console.log(data);
    });
  };

  giggity.toggleAccountMenu = function(){
    console.log('CLICK');
    $('.accountMenu').toggle();
  };
// ----------------------------------------------------------------------------------------------------------------
  giggity.getUserData = function() {
    console.log("In get User Data");
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    $.ajax({
      url: `/api/users/${userId}`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    }).done((data) => {
      console.log("Weve got the data");
      console.log(data.user);
      giggity.showProfilePage(data.user);
    });
  };

  giggity.showProfilePage = function(user){
    let token = localStorage.getItem('token');
    console.log("In the edit user form");
    let userId = localStorage.getItem('userId');
    giggity.$main.html(`<h1>Hi ${user.firstName}</h1>
                          <h2>Account Settings</h2>
                          <form class="accountSettingsForm" method="put" action="/api/users/${user._id}">
                            <input type="text" name="user[firstName]" value="${user.firstName}" placeholder="First name">
                            <input type="text" name="user[lastName]" value="${user.lastName}" placeholder="Last name">
                            <input type="text" name="user[email]" value="${user.email}" placeholder="Email">

                            <button class="btn btn-primary">Update details</button>
                          </form>
                          <button class="deleteProfileButton">Delete Profile</button>`);

                        };

  giggity.updateUserForm = function() {

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
      console.log(data);
    });
  };

  giggity.deleteUser = function () {
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');

    console.log("in delete user");
    $.ajax({
      url: `/api/users/${userId}`,
      method: 'DELETE',
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader("Authorization", `Bearer ${token}`);
      }
    })
      .done((data) => {
        console.log("User profile deleted");
        giggity.refreshPage();
      });
  };
