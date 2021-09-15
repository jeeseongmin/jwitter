import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "mybase";
import Navgiation from "components/Navigation";

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
	const [userObj, setUserObj] = useState(null);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				setUserObj(user);
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	return (
		<>
			{init ? (
				<AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
			) : (
				"Initializing..."
			)}
			<footer>&copy; {new Date().getFullYear()} Jwitter</footer>
		</>
	);
}

export default App;
