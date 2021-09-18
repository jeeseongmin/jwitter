import React, { useState } from "react";
import { app, auth } from "mybase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import AuthForm from "components/AuthForm";
import background from "image/background.jpg";
import logo from "image/logo.png";

const Auth = () => {
	const onSocialClick = async (e) => {
		const name = e.target.name;
		let provider;
		let user;
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
					console.log(error);
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
					console.log(error);
				});
		}
	};
	return (
		<div class="h-full w-full flex flex-row-reverse">
			<div class="h-full w-1/2 px-8 py-16 flex flex-col">
				<div class="w-full h-auto">
					<div class="h-16">
						<img src={logo} alt="logo" class="h-full" />
					</div>
					<h1 class="text-5xl font-bold">지금 일어나고 있는 일</h1>
				</div>
				<AuthForm />
				<div>
					<button onClick={onSocialClick} name="google">
						Continue with Google
					</button>
					<button onClick={onSocialClick} name="github">
						Continue with Github
					</button>
				</div>
			</div>
			<div class="h-full w-1/2 ">
				<img src={background} alt="bg" class="h-full w-full object-cover" />
			</div>
		</div>
	);
};

export default Auth;
