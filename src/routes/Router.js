import React from "react";
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
import Detail from "routes/Detail";
import Leftbar from "routes/Leftbar";
import Login from "routes/Login";
import Popular from "routes/Popular";
import Profile from "routes/Profile";
import Rightbar from "routes/Rightbar";

const AppRouter = (props) => {
	const loginToken = useSelector((state) => state.user.loginToken);
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<Router>
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
							<Route exact path="/" component={Home} />
							<Route exact path="/bookmark" component={Bookmark} />
							<Route exact path="/explore/:type" component={Explore} />

							<Route exact path="/popular" component={Popular} />
							<Route exact path="/home" component={Home} />
							<Route exact path="/jweet/:id" component={Detail} />
							<Route path="/profile/:type/:id" component={Profile} />
							<Redirect from="*" to="/" />
						</>
					) : (
						<>
							<Route exact path="/" component={Login} />
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
