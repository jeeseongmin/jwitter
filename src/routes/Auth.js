import React, { useState } from "react";
import { app, auth } from "mybase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";

const Auth = () => {
	const [info, setInfo] = useState({
		email: "",
		password: "",
	});
	const [newAccount, setNewAccount] = useState(true);
	const [error, setError] = useState("");
	const onChange = (e, type) => {
		const cp = { ...info };
		cp[type] = e.target.value;
		setInfo(cp);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			let data;
			if (newAccount) {
				// create account
				data = await createUserWithEmailAndPassword(
					auth,
					info.email,
					info.password
				);
			} else {
				// Log In
				data = await signInWithEmailAndPassword(
					auth,
					info.email,
					info.password
				);
			}
			console.log(data);
		} catch (error) {
			console.log(error.message);
			setError(error.message);
		}
	};

	const toggleAccount = () => setNewAccount((prev) => !prev);
	const onSocialClick = async (e) => {
		const name = e.target.name;
		let provider;
		let user;
		console.log(name);
		if (name === "google") {
			provider = new GoogleAuthProvider();
			// provider = new Github.
			signInWithPopup(auth, provider)
				.then((result) => {
					const credential = GoogleAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;

					user = result.user;
				})
				.catch((error) => {
					const errorCode = error.code;
					const errorMessage = error.message;

					const email = error.email;
					const credential = GoogleAuthProvider.credentialFromError;
				});
		} else if (name === "github") {
			provider = new GithubAuthProvider();
			signInWithPopup(auth, provider)
				.then((result) => {
					const credential = GithubAuthProvider.credentialFromResult(result);
					const token = credential.accessToken;

					user = result.user;
				})
				.catch((error) => {
					const errorCode = error.errorCode;
					const errorMessage = error.message;

					const email = error.email;
					const credential = GithubAuthProvider.credentialFromError(error);
				});
		}
	};
	return (
		<div>
			<form onSubmit={onSubmit}>
				<input
					type="text"
					placeholder="Email"
					required
					value={info.email}
					onChange={(e) => onChange(e, "email")}
				/>
				<input
					type="password"
					placeholder="Password"
					required
					value={info.password}
					onChange={(e) => onChange(e, "password")}
				/>
				<input type="submit" value={newAccount ? "Create Account" : "Log In"} />
				{error}
			</form>
			<span onClick={toggleAccount}>
				{newAccount ? "Log in" : "Create Account"}
			</span>
			<div>
				<button onClick={onSocialClick} name="google">
					Continue with Google
				</button>
				<button onClick={onSocialClick} name="github">
					Continue with Github
				</button>
			</div>
		</div>
	);
};

export default Auth;
