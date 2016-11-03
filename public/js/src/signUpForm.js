gigcity.signUpFormObject = `

      <div class='signUpForm'>
        <img class="closeSignForm" src='../../assets/images/close.svg'>
        <ul class="tab">
          <li><a href="javascript:void(0)" class="tablinks" onclick="gigcity.openTab('signUp')">Sign Up</a></li>
          <li><a href="javascript:void(0)" class="tablinks" onclick="gigcity.openTab('signIn')">Sign In</a></li>
        </ul>

        <div id="signUp">
          <div class="registerContainer">
            <h4>Register</h4>
            <form method="post" action="/api/register" class="authform">
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

        <div id="signIn">
          <div class='loginform'>
            <div class="registerContainer">
              <h4>Log in</h4>
              <form method="post" action="/api/login" class="authform">
              <div>
                <input name="email" placeholder="Email">
              </div>
              <div>
                <input type="password" name="password" placeholder="Password">
              </div>
              <button>Log in</button>
              </form>
            </div>
          </div>
        </div>
      </div>
`;
