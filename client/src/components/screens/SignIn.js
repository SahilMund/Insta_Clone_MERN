import React, { useState ,useContext} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { Link } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from './../../App';


const SignIn = () => {
  const {state,dispatch} = useContext(UserContext);
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);

  // for showing password
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  // Connecting to Backend
  const postData = () => {

    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: " #c62828 red darken-2" });
      return;
    }
    
    fetch("/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          console.log(data.error);
          M.toast({ html: data.error, classes: " #c62828 red darken-2" });
        } else {
          localStorage.setItem("jwtToken", data.token);
          localStorage.setItem("userData", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "SignedIn Successfully",
            classes: "#43a07 green darken-1 rounded",
          });

          history.push("/");
          
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>

          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={passwordShown ? "text" : "password"}
            value={password}
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <p>
              <label htmlFor="showpwd">
                <input
                  onClick={() => togglePasswordVisiblity()}
                  type="checkbox"
                  id="showpwd"
                />

                <span>Show Password</span>
              </label>
            </p>
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-2"
            type="submit"
            name="action"
            onClick={()=>postData()}
          >
            LogIn
          </button>
        </div>

        <div className="card auth-card footer-card">
          Don't have an account?
          <Link className="link-route" to="/signup">
            Sign up
          </Link>
        </div>
        <div className="flex-container image-app">
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://itunes.apple.com/app/instagram/id389801252?pt=428156&ct=igweb.loginPage.badge&mt=8&vt=lo"
          >
            {" "}
            <img
              alt="apple.png"
              target="_blank"
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_ios_english-en.png/180ae7a0bcf7.png"
            ></img>
          </a>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://play.google.com/store/apps/details?id=com.instagram.android&referrer=utm_source%3Dinstagramweb%26utm_campaign%3DloginPage%26ig_mid%3D3D3BA8B4-C908-40A7-AB4C-E5B7AF2A8F78%26utm_content%3Dlo%26utm_medium%3Dbadge"
          >
            <img
              alt="googleplay.jpg"
              src="https://www.instagram.com/static/images/appstore-install-badges/badge_android_english-en.png/e9cd846dc748.png"
            ></img>
          </a>
        </div>
      </div>
    </>
  );
};

export default SignIn;
