let $userFirstName;
let $userLastName;

gigcity.isLoggedIn = function(){
  return !!localStorage.getItem('token');
};

//create user and log in
gigcity.signUp = function () {
  if(!($(".signUpForm").length)){
    $("body").prepend(gigcity.signUpFormObject);
  } else {
    $('.signUpForm').show();
  }
};

//handle form
gigcity.handleUserForm = function() {
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
    if(data.user._id) localStorage.setItem('userId' ,data.user._id);
    if(data.token) localStorage.setItem('token', data.token);
    $('.signUpForm').remove();
    $('.accountButton').show();
    $('.signUpButton').hide();
  })
  .fail(() => {console.log("failed to log in");});
};

  gigcity.toggleAccountMenu = function(){
    $('.accountMenu').toggle();
  };
// ----------------------------------------------------------------------------------------------------------------
  gigcity.getUserData = function() {
    $('.accountMenu').toggle();
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
      gigcity.showProfilePage(data.user);
    });
  };

  gigcity.showProfilePage = function(user){
    let token = localStorage.getItem('token');
    console.log("In the edit user form");
    let userId = localStorage.getItem('userId');
    $(".popUp").html(`
                      <div class="accountSettings">
                        <img class="closePageImage" src='../../assets/images/close.svg'>
                        <h3>Account Settings</h3>
                        <form class="accountSettingsForm" method="put" action="/api/users/${user._id}">
                          <input type="text" name="user[firstName]" value="${user.firstName}" placeholder="First name">
                          <input type="text" name="user[lastName]" value="${user.lastName}" placeholder="Last name">
                          <input type="text" name="user[email]" value="${user.email}" placeholder="Email">
                          <textarea class="u-full-width" name="user[bio]" placeholder="Bio …" id="exampleMessage">${user.bio}</textarea>
                          <button class="btn btn-primary u-full-width">Update details</button>
                          <button class="deleteProfileButton u-full-width">Delete Profile</button>
                        </form>
                      </div>`);
                    $(".popUp").show();

    $(".closePageImage").on("click", () => {
      $(".popUp").hide();
    });
  };

  gigcity.updateUserForm = function() {
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

  gigcity.deleteUser = function () {
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
        gigcity.refreshPage();
      });
  };

  gigcity.showEventsPage = function(){
    event.preventDefault();
    console.log('CLICK');
    gigcity.$main.html('<div class="cardContainer"></div>');
    gigcity.getUserEvents(false);
  };
