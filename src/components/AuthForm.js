import React, { useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
	updateProfile,
} from "firebase/auth";
import { app, auth } from "mybase";

const AuthForm = ({ isLogin }) => {
	const [info, setInfo] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState("");

	const onChange = (e, type) => {
		const cp = { ...info };
		cp[type] = e.target.value;
		setInfo(cp);
		setError("");
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		console.log("haha");
		try {
			let data;
			if (isLogin) {
				alert("로그인합니다!");
				console.log(auth, info.email, info.password);
				// Log In
				data = await signInWithEmailAndPassword(
					auth,
					info.email,
					info.password
				).then(() => {
					console.log("currentUser", auth.currentUser);
					if (auth.currentUser.displayName === null) {
						let displayName = auth.currentUser.email.split("@");
						console.log("displayName", displayName);

						updateProfile(auth.currentUser, {
							displayName: displayName[0],
							photoURL:
								"https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6",
						})
							.then(() => {})
							.catch((error) => {});
					}
				});
			} else {
				alert("회원가입합니다!");
				// create account
				data = await createUserWithEmailAndPassword(
					auth,
					info.email,
					info.password
				).then(() => {
					console.log("currentUser", auth.currentUser);
					if (auth.currentUser.displayName === null) {
						let displayName = auth.currentUser.email.split("@");
						console.log("displayName", displayName);

						updateProfile(auth.currentUser, {
							displayName: displayName[0],
							photoURL:
								"https://firebasestorage.googleapis.com/v0/b/jwitter-e0584.appspot.com/o/default-profile-pic-e1513291410505.jpg?alt=media&token=824bfe06-5db1-4f18-9e7e-d2b11e3303a6",
						})
							.then(() => {})
							.catch((error) => {});
					}
				});
			}
		} catch (error) {
			console.log(error.message);
			setError(error.message);
		}
	};

	return (
		<>
			<form onSubmit={onSubmit} class="w-full flex flex-col py-3">
				<div class="w-full mb-4">
					<input
						type="text"
						placeholder="Email"
						required
						value={info.email}
						class="w-full rounded-lg border border-gray-300 outline-none px-4 py-3 text-lg"
						onChange={(e) => onChange(e, "email")}
					/>
				</div>
				<div class="w-full mb-4">
					<input
						type="password"
						placeholder="Password"
						required
						value={info.password}
						class="w-full rounded-lg border border-gray-300 outline-none px-4 py-3 text-lg"
						onChange={(e) => onChange(e, "password")}
					/>
				</div>
				<input
					class="cursor-pointer w-full rounded-xl bg-purple-300 py-2 font-bold"
					type="submit"
					value={isLogin ? "Log In" : "Create Account"}
				/>
				{error ? "올바른 이메일과 패스워드를 입력해주세요." : ""}
			</form>
		</>
	);
};

export default AuthForm;
