giggity.signUpFormObject = `
      <div class='signupform'>
        <ul class="tab">
          <li><a href="javascript:void(0)" class="tablinks" onclick="giggity.openTab(event, 'signUp')">signUp</a></li>
          <li><a href="javascript:void(0)" class="tablinks" onclick="giggity.openTab(event, 'signIn')">signIn</a></li>
        </ul>

        <div id="signUp" class="tabcontent">
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

        <div id="signIn" class="tabcontent">
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
        </div>
      </div>
`;
