import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { db, auth } from "mybase";
import { doc, getDoc, addDoc, collection, setDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";

function App() {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);

	const [init, setInit] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);
	const [userObj, setUserObj] = useState(null);

	// useEffect(() => {
	// 	auth.onAuthStateChanged(async (user) => {
	// 		console.log("user", user);
	// 		if (user) {
	// 			setIsLoggedIn(true);
	// 			console.log(user);
	// 			const docRef = doc(db, "users", user.uid);

	// 			await getDoc(docRef).then((snap) => {
	// 				if (snap.exists()) {
	// 					console.log("Document data:", snap.data());
	// 					dispatch(
	// 						setCurrentUser({
	// 							photoURL: snap.data().photoURL,
	// 							displayName: snap.data().displayName,
	// 							uid: user.uid,
	// 						})
	// 					);
	// 				} else {
	// 					console.log("No such document!");
	// 				}
	// 			});
	// 		} else {
	// 			setUserObj({});
	// 			setIsLoggedIn(false);
	// 		}
	// 		setInit(true);
	// 	});
	// }, []);

	return (
		<>
			{" "}
			<AppRouter />{" "}
		</>
	);
}

export default App;
