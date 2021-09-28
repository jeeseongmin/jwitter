import Modal from "@mui/material/Modal";
import CreateJweetBox from "components/box/CreateJweetBox";
import React from "react";
import { GrClose } from "react-icons/gr";
import { useSelector } from "react-redux";

const CreateJweetModal = ({
	createOpen,
	discardCheck,
	handleCreateClose,
	checkOpen,
	handleCheckClose,
	discardThread,
}) => {
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<>
			<Modal
				open={createOpen}
				onClose={discardCheck}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="outline-none absolute border border-white top-1/4 left-1/2 lg:left-1/2 transform -translate-x-1/2 -translate-y-1/4 origin-center w-2/3 lg:w-1/2 h-auto pt-2 pb-3 bg-white rounded-2xl flex flex-col justify-start items-start">
					{" "}
					<div
						onClick={discardCheck}
						class="w-full cursor-pointer flex justify-start items-center pb-1 border-b border-gray-200"
					>
						<GrClose
							size={38}
							class="ml-2 p-2 hover:bg-gray-200 rounded-full"
						/>
					</div>
					<div class="w-full">
						<CreateJweetBox
							currentUser={currentUser}
							isModal={true}
							handleCreateClose={handleCreateClose}
						/>
					</div>
				</div>
			</Modal>
			<Modal
				open={checkOpen}
				onClose={handleCheckClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto px-4 py-8 bg-white rounded-2xl flex flex-col justify-start items-start">
					<div class="flex flex-col px-4">
						<h1 class="text-xl font-bold mb-2">Discard Thread?</h1>
						<p class="text-left pb-8">
							This can’t be undone and you’ll lose your draft.
						</p>
						<div
							onClick={discardThread}
							class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full bg-red-500 hover:bg-red-600 transition delay-50 duration-300 text-white font-bold mb-4"
						>
							Discard
						</div>
						<div
							onClick={handleCheckClose}
							class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full border border-purple-300 text-purple-500 transition delay-50 duration-300 font-bold hover:bg-gray-200"
						>
							Cancel
						</div>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default CreateJweetModal;
