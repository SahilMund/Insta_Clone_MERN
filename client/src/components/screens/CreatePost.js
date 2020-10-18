import React, { useState ,useEffect } from "react";
import M from "materialize-css";
import { useHistory } from "react-router-dom";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");

  const preview = (e) => {
    setPicture(URL.createObjectURL(e.target.files[0]));
  };


  useEffect(() => {
    if (url ) {
      fetch("/createPost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("jwtToken"),
        },

        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
        
          if (data.error) {
            setLoading(false);
            console.log(data.error);
            M.toast({ html: data.error, classes: " #c62828 red darken-2" });

            setPicture("");
          } else {
            setLoading(false);
            M.toast({
              html: "Image Posted Successfully",
              classes: "#43a07 green darken-1 rounded",
            });
            history.push("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [url]);



  const addPostDetails = () => {
    if(!image || !body || !title) {
      return M.toast({ html: "Please fill all the fields", 
        classes: " #c62828 red darken-2" });
    }
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "Insta_Clone");
    data.append("Cloud name", "sahil032");
    setLoading(true);

    fetch("https://api.cloudinary.com/v1_1/sahil032/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setUrl(data.url);
        console.log("photo uploaded...");
      })
      .catch((err) => {
        console.log(err);
      });
   
  };
  return (
    <div className="card input-field new-card" style={{position:"relative"}}>{
      !picture && !loading ?<i className="material-icons right" style={{position:"absolute",left:"50%",right:"50%"}
    }>photo</i> :""
    }
      {loading ? (
       <div className="preloader-wrapper big active">
      <div className="spinner-layer spinner-blue">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-red">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-yellow">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>

      <div className="spinner-layer spinner-green">
        <div className="circle-clipper left">
          <div className="circle"></div>
        </div><div className="gap-patch">
          <div className="circle"></div>
        </div><div className="circle-clipper right">
          <div className="circle"></div>
        </div>
      </div>
    </div>
      ) : (
        <div className={loading ? "card geeks" : ""}>
          <img
            src={picture}
            alt=""
            style={{ borderRadius: "50%", width: "200px" }}
          />
        </div>
      )}
      <input
        type="text"
        value={title}
        placeholder="title"
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={body}
        placeholder="body"
        onChange={(e) => setBody(e.target.value)}
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

      <button
        className="btn  waves-effect waves-light #64b5f6 blue darken-2"
        type="submit"
        name="action"
        onClick={() => addPostDetails()}
      >
        Submit
        <i className="material-icons right">send</i>
      </button>
    </div>
  );
};

export default CreatePost;
