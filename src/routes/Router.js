import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
	HashRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import Bookmark from "routes/Bookmark";
import Explore from "routes/Explore";
import Home from "routes/Home";
import JweetDetail from "routes/JweetDetail";
import Leftbar from "routes/Leftbar";
import Login from "routes/Login";
import Popular from "routes/Popular";
import Profile from "routes/Profile";
import Rightbar from "routes/Rightbar";

const AppRouter = (props) => {
	const isLoggedIn = props.isLoggedIn;
	const loginToken = useSelector((state) => state.user.loginToken);
	const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		// console.log("localStorage Mode", window.localStorage.getItem("theme"));
		// if (window.localStorage.getItem("theme") === null) {
		// 	window.localStorage.setItem("theme", "light");
		// }
		// window.localStorage.setItem("count", JSON.stringify(count));
	}, []);
	return (
		<Router>
			{/* {isLoggedIn && <Navigation userObj={userObj} />} */}
			<div
				class={
					"w-full h-full bg-white transition delay-75 duration-300 dark:bg-black " +
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
							<Route exact path="/explore/:type">
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
