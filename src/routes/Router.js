import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	HashRouter as Router,
	Redirect,
	Route,
	Switch,
} from "react-router-dom";
import { setCurrentUser, setLoginToken } from "reducers/user";
import Bookmark from "routes/Bookmark";
import Detail from "routes/Detail";
import Explore from "routes/Explore";
import Home from "routes/Home";
import Leftbar from "routes/Leftbar";
import Login from "routes/Login";
import Popular from "routes/Popular";
import Profile from "routes/Profile";
import Rightbar from "routes/Rightbar";

const AppRouter = () => {
	const dispatch = useDispatch();
	const loginToken = useSelector((state) => state.user.loginToken);
	const currentUser = useSelector((state) => state.user.currentUser);

	useEffect(() => {
		let loginToken = sessionStorage.getItem("loginToken");
		if (loginToken === null || !loginToken) {
			dispatch(setLoginToken("logout"));
			dispatch(
				setCurrentUser({
					photoURL: "",
					uid: "",
					displayName: "",
					email: "",
					description: "",
					bookmark: [],
					follower: [],
					following: [],
					rejweet: [],
					bgURL: "",
				})
			);
			console.log("정보 없음!");
		} else console.log("정보 있음!");
	}, []);
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
