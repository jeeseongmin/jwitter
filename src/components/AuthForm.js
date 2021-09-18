import React, { useState } from "react";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
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
