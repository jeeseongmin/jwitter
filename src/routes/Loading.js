import logo from "image/logo.png";
import React from "react";

const Loading = ({ loading }) => {
	return (
		<div
			class={
				"absolute left-0 top-0 w-full h-full flex-row justify-center items-center bg-purple-100 " +
				(loading ? "hidden" : "flex")
			}
		>
			<img class="h-1/6 object-cover" src={logo} alt="loading" />
		</div>
	);
};

export default Loading;
