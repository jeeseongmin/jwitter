import React from "react";
import { AiTwotoneDelete } from "react-icons/ai";

const DeleteButton = ({ handleOpen, text }) => {
	return (
		<div
			onClick={handleOpen}
			class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-b-md"
		>
			<AiTwotoneDelete class="w-12" size={20} />
			<div class="flex-1">{text}</div>
		</div>
	);
};

export default DeleteButton;
