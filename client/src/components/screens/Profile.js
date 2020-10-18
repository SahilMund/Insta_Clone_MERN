import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "./../../App";

const Profile = () => {
  const [mypostpic, setMypostpic] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");

  useEffect(() => {
    fetch("/myPost", {
      headers: { "auth-token": localStorage.getItem("jwtToken") },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result.data);
        setMypostpic(result.data);
      });
  }, []);

  useEffect(() => {
    if (image) {
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

          fetch("/updateProfilepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("jwtToken"),
            },
            body: JSON.stringify({
              pic: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              localStorage.setItem(
                "userData",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            })
            .catch((err) => console.log(err));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const updatePhoto = (updatefile) => {
    setImage(updatefile);
  };
  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div className="profile-page">
        {/* image profile */}
        <div>
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              display: "block",
            }}
            alt="a.png"
            src={state ? state.pic : ""}
            // src="https://images.unsplash.com/photo-1513721032312-6a18a42c8763?w=152&h=152&fit=crop&crop=faces"
          />
        </div>
        {/* details profile */}
        <div className="details">
          <h4>{state ? state.name : " "}</h4>
          <h6>{state ? state.email : " "}</h6>

          <div
            className="follow"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <h6 style={{ color: "blue", cursor: "pointer" }}>
              {mypostpic.length} posts
            </h6>
            <h6 style={{ color: "blue", opacity: "2px", cursor: "pointer" }}>
              {state ? state.followers.length : "_"} followers
            </h6>
            <h6 style={{ color: "blue", opacity: "2px", cursor: "pointer" }}>
              {state ? state.following.length : "_"} followings
            </h6>
          </div>
          <p> I am a art enthaestic. I born in new delhi</p>
        </div>
      </div>
      <div className="file-field input-field">
        <div className="btn #EA7773 blue lighten-2">
          <span>Update Profile Pic</span>
          <input
            type="file"
            onChange={(e) => {
              updatePhoto(e.target.files[0]);
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div className="profile-gallery">
        {mypostpic.map((item) => {
          return (
            <img
              key={item._id}
              className="item-image materialsebox "
              alt=""
              src={item.photo}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;
