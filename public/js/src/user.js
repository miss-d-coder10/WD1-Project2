let user = user || {};

setTimeout(function(){
  $(".signupbutton").on("click", user.signUp);
}, 500);

//create user
user.signUp = function () {
  if(!($(".signupform").length)){
    $("body").prepend(`
      <div class='signupform'>
        <div class="registercontainer">
          <h2>Register</h2>
          <form method="post" action="/api/register">
          <div>
            <input name="user[firstName]" placeholder="First Name">
          </div>
          <div>
            <input name="user[lastName]" placeholder="Last Name">
          </div>
          <div>
            <input name="user[email]" placeholder="Email">
          </div>
          <div>
            <input type="password" name="user[password]" placeholder="Password">
          </div>
          <div>
            <input type="password" name="user[passwordConfirmation]" placeholder="Password Confirmation">
          </div>
          <button>Register</button>
          </form>
        </div>
      </div>
    `);
  }
  $(".signupform").on("submit", "form", handleForm);
};

//handle form

function handleForm() {
  if(event) event.preventDefault();

  // let token = localStorage.getItem("token");

  let $form = $(this);
  let url = $form.attr("action");
  let method = $form.attr("method");
  let data = $form.serialize();

  $.ajax({
    url,
    method,
    data
    // beforeSend: function(jqXHR) {
    //   if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
    // }
  })
  .done((data) =>{
    console.log(data);
    // if(data.token) localStorage.setItem('token', data.token);
    getUsers();
  });
}

//get users
function getUsers (){
    if (event) event.preventDefault();
    // let token = localStorage.getItem("token");

    $.ajax({
      url: "/api/users",
      method: "GET"
      // beforeSend: function(jqXHR) {
      //   if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      })
    .done(() => {
      console.log("test");
      console.log(data);
    });
  }

//show users

//show log in form
user.login = function () {
  if(!($(".loginform").length)){
    $("body").prepend(`
      <div class='loginform'>
        <div class="logincontainer">
          <h2>Log in</h2>
          <form method="post" action="/api/login">
          <div>
            <input name="user[firstName]" placeholder="First Name">
          </div>
          <div>
            <input name="user[lastName]" placeholder="Last Name">
          </div>
          <div>
            <input name="user[email]" placeholder="Email">
          </div>
          <button>Log in</button>
          </form>
        </div>
      </div>
    `);
  }
  $(".loginform").on("submit", "form", handleForm);
};
