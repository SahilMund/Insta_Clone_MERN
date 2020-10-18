import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./../../App";
import M from "materialize-css";
import { Link } from "react-router-dom";

const Home = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    fetch("/getallPost", {
      headers: {
        "auth-token": localStorage.getItem("jwtToken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  // for liking
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  // for disliking
  const dislikePost = (id) => {
    fetch("/dislike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  // commenting
  const makeComments = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

   //  for deleting post
   const deletePost = (postId) => {
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        "auth-token": localStorage.getItem("jwtToken"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result.response._id;
        });
        setData(newData);
        M.toast({ html: result.message, classes: " #c62828 red darken-2" });
      })
      .catch((err) => console.log(err));
  };

  
  // for liking
  const lovePost = (id) => {
    fetch("/love", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  // for disliking
  const hatePost = (id) => {
    fetch("/hate", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("jwtToken"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  

  return (
    <div className="home">
      {data.map((items) => {
        return (
          <div className="card home-card" key={items._id}>

          <h5 ><Link to={items.postedBy._id != state._id ? `/profile/${items.postedBy._id}` :`/profile`}>{items.postedBy.name}</Link>
            {items.postedBy._id == state._id ? (
                <i
                  style={{ color: "red", cursor: "pointer",float:"right"}}
                  className="material-icons"  
                  onClick={() => deletePost(items._id)}
                >
                  delete
                </i>
              ) : (
                ""
              )}
</h5>
            <div className="card-image">
              <img alt="" src={items.photo} style={{cursor:"pointer"}} onDoubleClick={()=>lovePost(items._id)}/>
            </div>

            <div className="card-content">
             {
                items.loves.includes(state._id) ? ( <i className="material-icons" onClick={()=> hatePost(items._id)} style={{ color: "red" }}>
                favorite
              </i>):(
              <i className="material-icons" >
              favorite_border
              </i>)
             }
              {items.likes.includes(state._id) ? (
                <i
                  className="material-icons"
                  onClick={() => dislikePost(items._id)}
                >
                  thumb_down
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likePost(items._id)}
                >
                  thumb_up
                </i>
              )}
              <h6 style={{ color: "#0650b8" }}>{items.likes.length} likes</h6>
              <h6 style={{ color: "#06b886" }}>{items.title}</h6>
              <p style={{ color: "#06b886" }}>{items.body}</p>

              {items.comments.map((msg) => {
                return (
                  <h6 key={msg._id}>
                    <span style={{ fontWeight: "bolder", color: "#7d34eb" }}>
                      {msg.postedBy.name}
                    </span>
                    <span style={{ color: "black" }}>{"   " + msg.text}</span>
                  </h6>
                );
              })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComments(e.target[0].value, items._id);
                  e.target[0].value=""
                }}
              >
                <input type="text" placeholder="add a comment" />
              </form>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
