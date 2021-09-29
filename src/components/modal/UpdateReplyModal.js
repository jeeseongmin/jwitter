import Modal from "@mui/material/Modal";
import UpdateReplyBox from "components/box/UpdateReplyBox";
import React from "react";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";

const UpdateReplyModal = ({ reply, replyOpen, handleReplyClose }) => {
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<Modal
			open={replyOpen}
			onClose={handleReplyClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div class="outline-none absolute border border-white top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 origin-center w-1/3 h-auto pt-2 pb-3 bg-white rounded-2xl flex flex-col justify-start items-start">
				{" "}
				<div
					onClick={handleReplyClose}
					class="w-full cursor-pointer flex justify-start items-center pb-1 border-b border-gray-200"
				>
					<GrClose size={38} class="ml-2 p-2 hover:bg-gray-200 rounded-full" />
				</div>
				<div class="w-full">
					<UpdateReplyBox
						currentUser={currentUser}
						isModal={true}
						_reply={reply}
						handleReplyClose={handleReplyClose}
					/>
				</div>
			</div>
		</Modal>
	);
};

export default UpdateReplyModal;
