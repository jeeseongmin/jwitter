import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const JweetFactory = ({ userObj }) => {
	const [jweet, setJweet] = useState("");
	const [attachment, setAttachment] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		let attachmentUrl = "";

		const text = jweet;
		if (text === "") {
			alert("글자를 입력해주세요");
		} else {
			if (attachment !== "") {
				const attachmentRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
				const response = await uploadString(
					attachmentRef,
					attachment,
					"data_url"
				);
				attachmentUrl = await getDownloadURL(response.ref);
			}
			const _jweet = {
				text: text,
				createdAt: Date.now(),
				creatorId: userObj.uid,
				attachmentUrl,
			};
			setJweet("");
			setAttachment("");

			try {
				await addDoc(collection(db, "jweets"), _jweet);
			} catch (error) {
				console.log(error);
			}
		}
	};
	const onChange = (e) => {
		setJweet(e.target.value);
	};

	const onFileChange = (e) => {
		const theFile = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			setAttachment(finishedEvent.currentTarget.result);
		};
		reader.readAsDataURL(theFile);
	};
	const clearAttachment = () => {
		setAttachment(null);
	};

	return (
		<form onSubmit={onSubmit}>
			<input
				type="text"
				value={jweet}
				onChange={onChange}
				placeholder="What's on your mind?"
				maxLength={120}
			/>
			<input type="file" accept="image/*" onChange={onFileChange} />
			<input type="submit" value="Jweet" />
			{attachment && (
				<div>
					<img src={attachment} width="50px" height="50px" alt="preview" />
					<button onClick={clearAttachment}>Clear</button>
				</div>
			)}
		</form>
	);
};

export default JweetFactory;
