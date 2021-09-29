import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import bgimg from "image/bgimg.jpg";
import google from "image/google.png";
import { auth, db } from "mybase";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "reducers/user";
const GoogleButton = ({ isLogin }) => {
	const dispatch = useDispatch();

	const onGoogleLogin = async (e) => {
		let provider;
		let user;
		provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider)
			.then((result) => {
				GoogleAuthProvider.credentialFromResult(result);
				user = result.user;

				const docRef = doc(db, "users", user.uid);
				getDoc(docRef).then(async (snap) => {
					if (snap.exists()) {
						await dispatch(setLoginToken("login"));
						await dispatch(
							setCurrentUser({
								...snap.data(),
								uid: user.uid,
								rejweet: user.rejweet ? user.rejweet : [],
								follower: user.follower ? user.follower : [],
								follwing: user.following ? user.following : [],
							})
						);
						sessionStorage.setItem("loginToken", true);
					} else {
						console.log("No such document!");
						dispatch(setLoginToken("login"));
						await dispatch(
							setCurrentUser({
								uid: user.uid,
								photoURL: user.photoURL,
								email: user.email,
								displayName: user.displayName,
								description: "",
								bookmark: [],
								follower: [],
								following: [],
								rejweet: [],
								bgURL: user.bgURL ? user.bgURL : bgimg,
							})
						);
						const usersRef = await collection(db, "users");
						await setDoc(doc(usersRef, user.uid), {
							photoURL: user.photoURL,
							email: user.email,
							displayName:
								user.displayName === ""
									? user.email.split("@")[0]
									: user.displayName,
							bookmark: [],
							follower: [],
							following: [],
							rejweet: [],
							description: "",
							bgURL: user.bgURL ? user.bgURL : bgimg,
						});
						sessionStorage.setItem("loginToken", true);
					}
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};
	return (
		<button
			name="google"
			onClick={onGoogleLogin}
			class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
		>
			<img src={google} class="h-6 object-cover mr-2" alt="google" />
			{isLogin ? "Google로 로그인하기" : "Google에서 가입하기"}
		</button>
	);
};

export default GoogleButton;
