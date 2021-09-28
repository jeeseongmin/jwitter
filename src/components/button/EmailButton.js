import React from "react";

const EmailButton = ({ isLogin, handleOpen }) => {
	return (
		<div
			onClick={handleOpen}
			class="cursor-pointer mb-4 border border-gray-300 rounded-full w-full md:w-1/2 flex flex-row h-12 items-center justify-center font-bold"
		>
			{isLogin
				? "전화, 이메일 또는 사용자 아이디 사용"
				: "휴대폰 번호나 이메일 주소로 가입하기"}
		</div>
	);
};

export default EmailButton;
