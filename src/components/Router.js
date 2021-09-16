import React, { useState } from "react";
import {
	HashRouter as Router,
	Route,
	Switch,
	Redirect,
} from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

// eslint-disable-next-line import/no-anonymous-default-export
const AppRouter = (props) => {
	const isLoggedIn = props.isLoggedIn;
	const userObj = props.userObj;
	const refreshUser = props.refreshUser;

	return (
		<Router>
			{isLoggedIn && <Navigation userObj={userObj} />}
			<Switch>
				{isLoggedIn ? (
					<>
						<Route exact path="/">
							<Home userObj={userObj} />
						</Route>
						<Route exact path="/profile">
							<Profile refreshUser={refreshUser} userObj={userObj} />
						</Route>
						<Redirect from="*" to="/" />
					</>
				) : (
					<>
						<Route exact path="/">
							<Auth />
						</Route>
						<Redirect from="*" to="/" />
					</>
				)}
			</Switch>
		</Router>
	);
};

export default AppRouter;