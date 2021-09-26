import React, { useState } from "react";
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import Login from "routes/Login";
import Leftbar from "routes/Leftbar";
import Rightbar from "routes/Rightbar";
import Bookmark from "routes/Bookmark";
import Popular from "routes/Popular";
import Explore from "routes/Explore";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";
import JweetDetail from "routes/JweetDetail";
// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = (props) => {
	const isLoggedIn = props.isLoggedIn;
	const loginToken = useSelector((state) => state.user.loginToken);
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<Router>
			{/* {isLoggedIn && <Navigation userObj={userObj} />} */}
			<div
				class={
					"w-full h-full " +
					(loginToken === "login" && currentUser
						? "flex flex-row px-0 lg:px-36"
						: "")
				}
			>
				{loginToken === "login" && currentUser && <Leftbar />}
				<Switch>
					{loginToken === "login" && currentUser ? (
						<>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/bookmark">
								<Bookmark />
							</Route>
							<Route exact path="/explore">
								<Explore />
							</Route>
							<Route exact path="/popular">
								<Popular />
							</Route>
							<Route exact path="/home">
								<Home />
							</Route>
							<Route exact path="/jweet/:id" component={JweetDetail} />
							<Route path="/profile/:type/:id" component={Profile} />
							<Redirect from="*" to="/" />
						</>
					) : (
						<>
							<Route exact path="/">
								<Login />
								{/* <Auth /> */}
							</Route>
							<Redirect from="*" to="/" />
						</>
					)}
				</Switch>
				{loginToken === "login" && currentUser && <Rightbar />}
			</div>
		</Router>
	);
};

export default AppRouter;
