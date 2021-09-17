import React, { useState } from "react";
import { app, auth } from "mybase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	GoogleAuthProvider,
	GithubAuthProvider,
	signInWithPopup,
} from "firebase/auth";
import Modal from "@mui/material/Modal";

import AuthForm from "components/AuthForm";
import background from "image/background.jpg";
import logo from "image/logo.png";
import github from "image/github.jpg";
import google from "image/google.png";

const Login = () => {
	const [login, setLogin] = useState(true);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const toggleLogin = () => setLogin(!login);

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
		<div class="h-full w-full flex flex-col lg:flex-row-reverse">
			<div class="h-full w-full lg:w-1/2 px-8 py-16 flex flex-col">
				<div class="w-full h-auto">
					<div class="h-24">
						<img src={logo} alt="logo" class="h-full" />
					</div>
					<h1 class="text-2xl md:text-6xl font-bold my-6 md:my-12">
						지금 일어나고 있는 일
					</h1>
					{login && (
						<>
							<h1 class="text-xl md:text-3xl font-bold mb-8">
								Jwitter 로그인하기
							</h1>
							<button
								name="google"
								onClick={onSocialClick}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								<img src={google} class="h-6 object-cover mr-2" alt="google" />{" "}
								Google로 로그인하기
							</button>
							<button
								name="github"
								onClick={onSocialClick}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								<img src={github} class="h-6 object-cover mr-2" alt="github" />{" "}
								Github로 로그인하기
							</button>
							<div
								onClick={handleOpen}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								전화, 이메일 또는 사용자 아이디 사용
							</div>
							<h1>
								계정이 없으신가요?{" "}
								<span
									onClick={toggleLogin}
									class="cursor-pointer text-blue-600"
								>
									가입하기
								</span>
							</h1>
						</>
					)}
					{!login && (
						<>
							<h1 class="text-xl md:text-3xl font-bold mb-8">
								오늘 Jwitter에 가입하세요.
							</h1>
							<button
								name="google"
								onClick={onSocialClick}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								<img src={google} class="h-6 object-cover mr-2" alt="google" />{" "}
								Google에서 가입하기
							</button>
							<button
								name="github"
								onClick={onSocialClick}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								<img src={github} class="h-6 object-cover mr-2" alt="github" />{" "}
								Github에서 가입하기
							</button>
							<div
								onClick={handleOpen}
								class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
							>
								휴대폰 번호나 이메일 주소로 가입하기
							</div>
							<h1 class="w-full md:w-1/2 mb-4">
								By signing up, you agree to the{" "}
								<span class="text-blue-600">Terms of Service</span> and{" "}
								<span class="text-blue-600">Privacy Policy</span>, including{" "}
								<span class="text-blue-600">Cookie Use.</span>
							</h1>
							<h1>
								트위터 아이디가 있으세요?{" "}
								<span
									onClick={toggleLogin}
									class="cursor-pointer text-blue-600"
								>
									로그인
								</span>
								하기
							</h1>
						</>
					)}
				</div>
			</div>
			<div class="h-full w-full lg:w-1/2 ">
				<img src={background} alt="bg" class="h-full w-full object-cover" />
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="absolute p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto bg-white rounded-lg flex flex-col justify-start items-start">
					{login && (
						<h1 class="text-2xl font-bold mb-4">일반 이메일로 로그인</h1>
					)}
					{!login && (
						<h1 class="text-2xl font-bold mb-4">계정을 생성하세요.</h1>
					)}
					<AuthForm isLogin={login} />
				</div>
			</Modal>
		</div>
	);
};

export default Login;
