import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "./../App";
import M from "materialize-css/dist/js/materialize.min.js";

const Navbar = () => {
  const history = useHistory();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const { state, dispatch } = useContext(UserContext);

  // rendering navbar lists
  const renderList = () => {
    if (state) {
      return [
        <li key={Math.random()}>
          <i
            data-target="modal1"
            className="material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key={Math.random()}>
          <Link to="/profile">MyProfile</Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/create-post">CreatePost</Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/mytimeline">My Timeline</Link>
        </li>,
        <li key={Math.random()}>
          <span>
            <i
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
              className="medium material-icons logout__icon"
            >
              exit_to_app
            </i>
          </span>
        </li>,
      ];
    } else {
      return [
        <li key={Math.random()}>
          <Link to="/login">SignIn</Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/signup">SignUp</Link>
        </li>,
      ];
    }
  };

  // rendering sidenav lists
  const sideNavLits = () => {
    if (state) {
      return [
        <li key={Math.random()}>
          <i
            data-target="modal1"
            className="material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key={Math.random()}>
          <Link to="/profile" className=" waves-effect waves-teal">
            MyProfile
          </Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/create-post" className=" waves-effect waves-teal">
            CreatePost
          </Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/mytimeline">My Timeline</Link>
        </li>,
        <li key={Math.random()}>
          <span>
            <i
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/login");
              }}
              className="material-icons logout__icon"
            >
              exit_to_app
            </i>
          </span>
        </li>,
      ];
    } else {
      return [
        <li key={Math.random()}>
          <Link to="/login" className=" waves-effect waves-teal">
            SignIn
          </Link>
        </li>,
        <li key={Math.random()}>
          <Link to="/signup" className=" waves-effect waves-teal">
            SignUp
          </Link>
        </li>,
      ];
    }
  };

  useEffect(() => {
    let sidenav = document.querySelector("#mobile-demo");
    M.Sidenav.init(sidenav, {});
    M.Modal.init(searchModal.current, {});
  }, []);

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((results) => {
        console.log(results.user);
        setUserDetails(results.user);
      });
  };

  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to={state ? "/" : "/login"} className="brand-logo">
            Instagram
          </Link>
          <Link to="#" data-target="mobile-demo" className="sidenav-trigger">
            <i className="material-icons">menu</i>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
      </nav>
      <ul className="sidenav" id="mobile-demo">
        {sideNavLits()}
      </ul>

      <div id="modal1" className="modal" ref={searchModal}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search Profile"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />

          <ul className="collection">
            {userDetails && state ? 
            (userDetails.map((item) => {
              return (
                <Link key={item._id}
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li key={Math.random()} className="collection-item">{item.email}</li>
                </Link>
              );
            })):""

            }
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
