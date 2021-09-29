import React from "react";
import { Link } from "react-router-dom";

const MenuButton = ({ url, onSelected, selected, num, width, text }) => {
	return (
		<Link
			to={url}
			onClick={() => onSelected(num)}
			class={
				width +
				" flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300 "
			}
		>
			<span
				class={
					"py-3 " + (selected === num ? "border-b-4 border-purple-500" : "")
				}
			>
				{text}
			</span>
		</Link>
	);
};

export default MenuButton;
