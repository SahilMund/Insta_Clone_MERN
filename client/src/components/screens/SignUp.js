import React, { useState ,useEffect} from "react";
import { Link, useHistory } from "react-router-dom";

import M from "materialize-css";

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [picture, setPicture] = useState("");
  const [url, setURL] = useState(undefined);
  const [passwordShown, setPasswordShown] = useState(false);

  // for showing password
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  useEffect(()=>{
    if(url){
      uploadFields()
    }
  },[url])


  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      ) &&
      email
    ) {
      M.toast({ html: "Invalid email", classes: " #c62828 red darken-2" });
      return;
    } else if (password.length < 4) {
      M.toast({
        html: "Password should be greater than 4 letters",
        classes: " #c62828 red darken-2",
      });
      return;
    }

    fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify({
        name,
        password,
        email,
        pic:url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          console.log(data.error);
          M.toast({ html: data.error, classes: " #c62828 red darken-2" });
        } else {
          M.toast({
            html: data.message,
            classes: "#43a07 green darken-1 rounded",
          });
          history.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const preview = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };

  // uploading user profile image
  const profilePic = () => {
    // if(!image || !body || !title) {
    //   return M.toast({ html: "Please fill all the fields",
    //     classes: " #c62828 red darken-2" });
    // }
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta_Clone");
    data.append("Cloud name", "sahil032");

    fetch("https://api.cloudinary.com/v1_1/sahil032/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setURL(data.url);
        console.log("photo uploaded...");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  
  // requesting to our backend
  const PostData = () => {
    if (image) {
      profilePic();
    } else {
      uploadFields();
    }
  };


  return (
    <div>
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          {picture ? (
            <div>
              <img
                src={picture}
                alt=""
                style={{ borderRadius: "50%", width: "200px", height: "100px" }}
              />
            </div>
          ) : (
            <i className="material-icons">person</i>
          )}
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type={passwordShown ? "text" : "password"}
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn #EA7773 blue lighten-2">
              <span>Image</span>
              <input
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                  preview(e);
                }}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
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
            onClick={() => PostData()}
          >
            SignUp
          </button>
        </div>
      </div>
      <div className="card auth-card footer-card">
        Already have an account ?
        <Link className="link-route" to="/login">
          Sign In
        </Link>
      </div>{" "}
    </div>
  );
};

export default SignUp;
