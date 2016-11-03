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

  giggity.toggleAccountMenu = function(){
    $('.accountMenu').toggle();
  };

  giggity.showProfilePage = function(){
    event.preventDefault();
    giggity.$main.html('');
  };

  giggity.showEventsPage = function(){
    event.preventDefault();
    console.log('CLICK');
    giggity.$main.html('<div class="cardContainer"></div>');
    giggity.getUserEvents(false);
  };
