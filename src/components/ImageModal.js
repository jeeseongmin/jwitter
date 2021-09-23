import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import { IoClose } from "react-icons/io5";

const ImageModal = ({
	photoURL,
	photoOpen,
	handlePhotoOpen,
	handlePhotoClose,
}) => {
	return (
		<Modal
			open={photoOpen}
			onClose={handlePhotoClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<>
				<div class="outline-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center h-auto py-1/3 rounded-2xl flex flex-col justify-start items-start">
					<img src={photoURL} alt="imgURL" class="object-cover" />
				</div>
				<button
					onClick={handlePhotoClose}
					class="absolute left-4 top-4 rounded-full text-white p-2 bg-gray-700 hover:bg-gray-400 "
				>
					<IoClose size={24} />
				</button>
			</>
		</Modal>
	);
};

export default ImageModal;
