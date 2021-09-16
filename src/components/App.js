import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { auth } from "mybase";

function App() {
	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
	const [userObj, setUserObj] = useState(null);

	const refreshUser = () => {
		const user = auth.currentUser;
		setUserObj({
			displayName: user.displayName,
			uid: user.uid,
			updateProfile: (args) => user.updateProfile(args),
		});
	};

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				setIsLoggedIn(true);
				setUserObj({
					displayName: user.displayName,
					uid: user.uid,
				});
			} else {
				setIsLoggedIn(false);
			}
			setInit(true);
		});
	}, []);

	return (
		<>
			{init ? (
				<AppRouter
					refreshUser={refreshUser}
					isLoggedIn={isLoggedIn}
					userObj={userObj}
				/>
			) : (
				"Initializing..."
			)}
		</>
	);
}

export default App;
