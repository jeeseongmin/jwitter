import React from "react";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import Modal from "@mui/material/Modal";

const RecommendMethodModal = ({
	modalOpen,
	handleModalClose,
	selectType,
	type,
}) => {
	return (
		<Modal
			open={modalOpen}
			onClose={handleModalClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto py-4 bg-white rounded-2xl flex flex-col justify-start items-start">
				<div class="w-full flex flex-col">
					<h1 class="px-8 text-xl font-bold mb-2">Sorting Method</h1>
					{type === "like" && (
						<div
							onClick={selectType}
							class="px-8 cursor-pointer w-full flex flex-row items-center hover:bg-gray-100 py-2"
						>
							<div class="mr-4">
								<CgArrowsExchangeAlt size={40} />
							</div>
							<div class="flex flex-col">
								<p class="font-bold text-lg">Random Jweets</p>
								<p class="text-sm">Jweets are randomly selected</p>
							</div>
						</div>
					)}
					{type === "random" && (
						<div
							onClick={selectType}
							class="px-8 cursor-pointer w-full flex flex-row items-center hover:bg-gray-100 py-2"
						>
							<div class="mr-4">
								<CgArrowsExchangeAlt size={40} />
							</div>
							<div class="flex flex-col">
								<p class="font-bold text-lg">Like Jweets</p>
								<p class="text-sm">It's sorted based on likes</p>
							</div>
						</div>
					)}
				</div>
			</div>
		</Modal>
	);
};

export default RecommendMethodModal;
