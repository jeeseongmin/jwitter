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
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = (props) => {
	const isLoggedIn = props.isLoggedIn;
	const loginToken = useSelector((state) => state.user.loginToken);

	return (
		<Router>
			{/* {isLoggedIn && <Navigation userObj={userObj} />} */}
			<div
				class={
					"w-full h-full " +
					(loginToken === "login" ? "flex flex-row px-0 lg:px-36" : "")
				}
			>
				{loginToken === "login" && <Leftbar />}
				<Switch>
					{loginToken === "login" ? (
						<>
							<Route exact path="/">
								<Home />
							</Route>
							<Route exact path="/bookmark">
								<Bookmark />
							</Route>
							<Route exact path="/home">
								<Home />
							</Route>
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
				{loginToken === "login" && <Rightbar />}
			</div>
		</Router>
	);
};

export default AppRouter;
