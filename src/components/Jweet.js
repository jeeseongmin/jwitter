import React, { useState, useEffect } from "react";
import { db, storage } from "mybase";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Jweet = ({ jweetObj, isOwner }) => {
	const [editing, setEditing] = useState(false);
	const [newJweet, setNewJweet] = useState(jweetObj.text);
	const onDeleteClick = async () => {
		const ok = window.confirm("Are you sure you want to delete this jweet?");
		if (ok) {
			await deleteDoc(doc(db, "jweets", jweetObj.id));
			if (jweetObj.attachmentUrl !== "")
				await deleteObject(ref(storage, jweetObj.attachmentUrl));
		}
	};

	const toggleEditing = () => {
		setEditing((prev) => !prev);
	};
	const onSubmit = async (e) => {
		e.preventDefault();
		console.log(jweetObj, newJweet);
		await updateDoc(doc(db, "jweets", jweetObj.id), {
			text: newJweet,
		});
		setEditing(false);
	};
	const onChange = (e) => {
		setNewJweet(e.target.value);
	};

	return (
		<div>
			{editing ? (
				<>
					<form onSubmit={onSubmit}>
						<input
							type="text"
							onChange={onChange}
							placeholder="Edit your Jweet"
							value={newJweet}
							required
						/>
						<input type="submit" value="Update Jweet" />
					</form>
					<button onClick={toggleEditing}>Cancel</button>
				</>
			) : (
				<>
					<h4>{jweetObj.text}</h4>
					{jweetObj.attachmentUrl && (
						<img
							src={jweetObj.attachmentUrl}
							widwth="50px"
							height="50px"
							alt="attachmentUrl"
						/>
					)}
					{isOwner && (
						<>
							<button onClick={onDeleteClick}>Delete Jweet</button>
							<button onClick={toggleEditing}>Edit Jweet</button>
						</>
					)}
				</>
			)}
		</div>
	);
};

export default Jweet;
