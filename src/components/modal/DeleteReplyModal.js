import Modal from "@mui/material/Modal";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "mybase";
import React from "react";

const DeleteReplyModal = ({ reply, deleteOpen, handleDeleteClose }) => {
	const onDeleteClick = async () => {
		const docRef = doc(db, "jweets", reply.parent);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			const cp = docSnap.data().reply;
			cp.splice(docSnap.data().reply.indexOf(reply.id), 1);
			await updateDoc(doc(db, "jweets", reply.parent), {
				reply: cp,
			});
		}

		await deleteDoc(doc(db, "replies", reply.id));
		if (reply.attachmentUrl !== "")
			await deleteObject(ref(storage, reply.attachmentUrl));
	};

	return (
		<Modal
			open={deleteOpen}
			onClose={handleDeleteClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto px-4 py-8 bg-white rounded-2xl flex flex-col justify-start items-start">
				<div class="flex flex-col px-4">
					<h1 class="text-xl font-bold mb-2">Delete Reply?</h1>
					<p class="text-left pb-8">
						This can’t be undone and it will be removed from your profile, the
						timeline of any accounts that follow you, and from Jwitter search
						results.
					</p>
					<div
						onClick={onDeleteClick}
						class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full bg-red-500 hover:bg-red-600 transition delay-50 duration-300 text-white font-bold mb-4"
					>
						Delete
					</div>
					<div
						onClick={handleDeleteClose}
						class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full border border-purple-300 text-purple-500 transition delay-50 duration-300 font-bold hover:bg-gray-200"
					>
						Cancel
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default DeleteReplyModal;
