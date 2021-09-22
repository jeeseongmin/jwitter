import React, { useState, useEffect } from "react";
import { auth, db } from "mybase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
	getDocs,
	query,
	collection,
	where,
	doc,
	getDoc,
} from "firebase/firestore";

const Profile = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [info, setInfo] = useState({});
	const [myJweets, setMyJweets] = useState([]);

	// const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

	// const onLogOutClick = () => {
	// 	auth.signOut();
	// 	history.push("/");
	// };
	// const onChange = (e) => {
	// 	setNewDisplayName(e.target.value);
	// };
	// const onSubmit = async (e) => {
	// 	e.preventDefault();
	// 	if (userObj.displayName !== newDisplayName) {
	// 		console.log(userObj.updateProfile);

	// 		await updateProfile(await auth.currentUser, {
	// 			displayName: newDisplayName,
	// 		});
	// 		refreshUser();
	// 	}
	// };

	const getMyJweets = async () => {
		const q = query(collection(db, "jweets"), where("creatorId", "==", uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const cp = myJweets;
			cp.push(doc.data());
			setMyJweets(cp);
		});
	};

	const getMyInfo = async () => {
		const docRef = doc(db, "users", uid);
		getDoc(docRef).then((snap) => {
			if (snap.exists()) {
				setInfo(snap.data());
				setLoading(true);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
	};
	useEffect(() => {
		getMyJweets();
		getMyInfo();
		console.log(myJweets);
		console.log(info);
	}, []);

	return (
		<>
			{/* <form onSubmit={onSubmit}>
				<input
					type="text"
					value={newDisplayName}
					onChange={onChange}
					placeholder="Display name"
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button> */}
			<div></div>
		</>
	);
};

export default Profile;
