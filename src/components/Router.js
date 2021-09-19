import React, { useState } from "react";
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import Auth from "routes/Auth";
import Main from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";
import Login from "routes/Login";
import Leftbar from "routes/Leftbar";
import Rightbar from "routes/Rightbar";

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = (props) => {
	const isLoggedIn = props.isLoggedIn;
	const userObj = props.userObj;
	const refreshUser = props.refreshUser;

	return (
		<Router>
			{/* {isLoggedIn && <Navigation userObj={userObj} />} */}
			<div
				class={
					"w-full h-full " + (isLoggedIn ? "flex flex-row px-0 lg:px-36" : "")
				}
			>
				{isLoggedIn && <Leftbar refreshUser={refreshUser} userObj={userObj} />}
				<Switch>
					{isLoggedIn ? (
						<>
							<Route exact path="/">
								<Main userObj={userObj} />
							</Route>
							<Route exact path="/profile">
								<Profile refreshUser={refreshUser} userObj={userObj} />
							</Route>
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
				{isLoggedIn && <Rightbar />}
			</div>
		</Router>
	);
};

export default AppRouter;
