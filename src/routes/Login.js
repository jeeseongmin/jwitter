import LoginContainer from "components/container/LoginContainer";
import RegisterContainer from "components/container/RegisterContainer";
import background from "image/background.jpg";
import logo from "image/logo.png";
import React, { useEffect, useState } from "react";
import Loading from "routes/Loading";
import LoginFormModal from "components/modal/LoginFormModal";

const Login = () => {
	const [isLogin, setIsLogin] = useState(true);
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const toggleLogin = () => setIsLogin(!isLogin);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setTimeout(function () {
			setLoading(true);
		}, 1500);
	}, []);

	return (
		<>
			<div class="h-full w-full flex flex-col lg:flex-row-reverse relative">
				<div class="h-full w-full lg:w-1/2 px-8 py-16 flex flex-col">
					<div class="w-full h-auto">
						<div class="h-24">
							<img src={logo} alt="logo" class="h-full" />
						</div>
						<h1 class="text-2xl md:text-6xl font-bold my-6 md:my-12">
							지금 일어나고 있는 일
						</h1>
						{isLogin && (
							<LoginContainer
								handleOpen={handleOpen}
								toggleLogin={toggleLogin}
							/>
						)}
						{!isLogin && (
							<RegisterContainer
								handleOpen={handleOpen}
								toggleLogin={toggleLogin}
							/>
						)}
					</div>
				</div>
				<div class="h-full w-full lg:w-1/2 ">
					<img src={background} alt="bg" class="h-full w-full object-cover" />
				</div>
				<LoginFormModal
					isLogin={isLogin}
					handleClose={handleClose}
					open={open}
				/>
				<Loading loading={loading} />
			</div>
		</>
	);
};

export default Login;
