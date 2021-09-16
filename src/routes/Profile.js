import React, { useState, useEffect } from "react";
import { auth, db } from "mybase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import { getDocs, query, collection, where } from "firebase/firestore";

const Profile = ({ userObj, refreshUser }) => {
	const history = useHistory();
	const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

	const onLogOutClick = () => {
		auth.signOut();
		history.push("/");
	};
	const onChange = (e) => {
		setNewDisplayName(e.target.value);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		if (userObj.displayName !== newDisplayName) {
			console.log(userObj.updateProfile);

			await updateProfile(await auth.currentUser, {
				displayName: newDisplayName,
			});
			refreshUser();
		}
	};

	const getMyJweets = async () => {
		const q = query(
			collection(db, "jweets"),
			where("creatorId", "==", userObj.uid)
		);
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			console.log(doc.id, " => ", doc.data());
		});
	};
	useEffect(() => {
		getMyJweets();
	}, []);

	return (
		<>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					value={newDisplayName}
					onChange={onChange}
					placeholder="Display name"
				/>
				<input type="submit" value="Update Profile" />
			</form>
			<button onClick={onLogOutClick}>Log Out</button>
		</>
	);
};

export default Profile;
