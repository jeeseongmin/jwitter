import React from "react";
import { RiEdit2Line } from "react-icons/ri";

const UpdateButton = ({ handleOpen, text }) => {
	return (
		<div
			onClick={handleOpen}
			class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-t-md"
		>
			<RiEdit2Line class="w-12" size={20} />
			<div class="flex-1">{text}</div>
		</div>
	);
};

export default UpdateButton;
