$(() =>{
  let $main = $("main");

  $(".register").on("click", showRegisterForm);
  $(".login").on("click", showLoginForm);
  $(".pizzas").on("click", getPizzas);
  $(".logout").on("click", logout);
  $main.on("submit", "form", handleForm);
  $main.on("click", "button.delete", deletePizza);
  $main.on("click", "button.edit", getPizza);

  function isLoggedIn(){
    return !!localStorage.getItem('token');
  }

  if (isLoggedIn()) {
    getPizzas();
  } else {
    showLoginForm();
  }

  function showRegisterForm(){
    if(event) event.preventDefault();
    $main.html(`
      <h2>Register</h2>
      <form method="post" action="/api/register">
      <div>
        <input name="user[username]" placeholder="Username">
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
    `);
  }

  function showLoginForm(){
    if(event) event.preventDefault();
    $main.html(`
      <h2>Login</h2>
      <form method="post" action="/api/login">
      <div>
      <input name="email" placeholder="Email">
      </div>
      <div>
        <input type="password" name="password" placeholder="Password">
      </div>
      <button>Login</button>
      </form>
    `);
  }

  function handleForm() {
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
    }).done((data) =>{
      if(data.token) localStorage.setItem('token', data.token);
      getPizzas();
    });
  }

  function getPizzas (){
    if (event) event.preventDefault();
    let token = localStorage.getItem("token");

    $.ajax({
      url: "/api/pizzas",
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    }).done(showPizzas);
  }

  function showPizzas(pizzas){
    let $row = $(
      `<div class='row'>
        <div>
          <h2>Add pizza</h2>
          <form method="post" action="/api/pizzas">
            <label for="name">
            <input name="name" placeholder="Name">
            <label for="toppings">
            <input name="toppings[]" placeholder="Toppings">
            <label for="isVegetarian">
            <input name="isVegetarian" placeholder="Is it vegetarian? true/false">
            <label for="img">
            <input name="img" placeholder="Image url">
            <button class="createPizza">Add pizza</button>
          </form>
        </div>
      </div>`);

    pizzas.forEach((pizza) =>{
      if(pizza.isVegetarian){
      $row.append(`
        <div>
          <h2>${pizza.name}</h2>
          <p>${pizza.toppings}</p>
          <p>Vegetarian </p>
          <img src="${pizza.img}">
          <button class="delete" data-id="${pizza._id}">Delete</button>
          <button class="edit" data-id="${pizza._id}">Edit</button>
        </div>
        `);
      }else{
        $row.append(`
          <div>
            <h2>${pizza.name}</h2>
            <p>${pizza.toppings}</p>
            <img src="${pizza.img}">
            <button class="delete" data-id="${pizza._id}">Delete</button>
            <button class="edit" data-id="${pizza._id}">Edit</button>
          </div>
          `);
      }
    });
    $main.html($row);
  }

  function logout(){
    if (event) event.preventDefault();

    localStorage.removeItem('token');
    showLoginForm();
  }

  function deletePizza() {
   let id = $(this).data('id');
   let token = localStorage.getItem('token');

   $.ajax({
     url: `/api/pizzas/${id}`,
     method: "DELETE",
     beforeSend: function(jqXHR) {
       if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
     }
   })
   .done(getPizzas)
   .fail(showLoginForm);
  }

  function getPizza(){
    let id = $(this).data('id');
    let token = localStorage.getItem('token');

    $.ajax({
      url: `/api/pizzas/${id}`,
      method: "GET",
      beforeSend: function(jqXHR) {
        if(token) return jqXHR.setRequestHeader('Authorization', `Bearer ${token}`);
      }
    })
    .done(showEditForm)
    .fail(showLoginForm);
  }

  function showEditForm(pizza){

  if(event) event.preventDefault();
   $main.html(`
    <form method="put" action="/api/pizzas/${pizza._id}">
       <label for="name">
       <input name="name" value="${pizza.name}">
       <label for="toppings">
       <input name="toppings[]" value="${pizza.toppings}">
       <label for="isVegetarian">
       <input name="isVegetarian" value="${pizza.isVegetarian}">
       <label for="img">
       <input name="img" value="${pizza.img}">
       <button>Update pizza</button>
    </form>
   `);
}

});
