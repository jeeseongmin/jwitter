import React from "react";

const EmailButton = ({ isLogin, handleOpen }) => {
	return (
		<div
			onClick={handleOpen}
			class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
		>
			{isLogin ? "일반 이메일로 로그인" : "일반 이메일로 가입하기"}
		</div>
	);
};

export default EmailButton;
