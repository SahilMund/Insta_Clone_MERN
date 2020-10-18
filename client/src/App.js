import React, { createContext, useReducer, useContext, useEffect } from "react";
import {
  BrowserRouter as Br,
  Route,
  Switch,
  Redirect,
  useHistory,
} from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import SignIn from "./components/screens/SignIn";
import SignUp from "./components/screens/SignUp";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from './components/screens/UserProfile';
import FollowerPosts from './components/screens/FollowerPosts';

import { initialState, reducer } from "./context/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    //JSON.parse helps to convert string  to object
    const user = JSON.parse(localStorage.getItem("userData"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/login");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/login" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/create-post" component={CreatePost} />
      <Route exact path="/profile/:userid" component={UserProfile} />
      <Route  path="/mytimeline" component={FollowerPosts} />
      <Redirect to="/" />
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <Br>
        <Navbar />
        <Routing />
      </Br>
    </UserContext.Provider>
  );
}

export default App;
