import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import bgimg from "image/bgimg.jpg";
import github from "image/github.jpg";
import { auth, db } from "mybase";
import React from "react";
import { useDispatch } from "react-redux";
import { setCurrentUser, setLoginToken } from "reducers/user";
const GithubButton = ({ isLogin }) => {
	const dispatch = useDispatch();

	const onGithubLogin = async (e) => {
		let provider;
		let user;
		provider = new GithubAuthProvider();
		await signInWithPopup(auth, provider)
			.then((result) => {
				const credential = GithubAuthProvider.credentialFromResult(result);
				const token = credential.accessToken;
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
					} else {
						console.log("No such document!");
						dispatch(setLoginToken("login"));
						await dispatch(
							setCurrentUser({
								uid: user.uid,
								photoURL: user.photoURL
									? user.photoURL
									: "https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6",
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
						const usersRef = collection(db, "users");
						await setDoc(doc(usersRef, user.uid), {
							photoURL: user.photoURL
								? user.photoURL
								: "https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6",
							email: user.email,
							displayName: user.displayName,
							bookmark: [],
							follower: [],
							following: [],
							rejweet: [],
							description: "",
							bgURL: user.bgURL ? user.bgURL : bgimg,
						});
					}
				});
			})
			.catch((error) => {
				console.log(error);
				alert("github 로그인 오류입니다.");
			});
	};
	return (
		<button
			name="github"
			onClick={onGithubLogin}
			class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
		>
			<img src={github} class="h-6 object-cover mr-2" alt="github" />{" "}
			{isLogin ? "Github로 로그인하기" : "Github에서 가입하기"}
		</button>
	);
};

export default GithubButton;
