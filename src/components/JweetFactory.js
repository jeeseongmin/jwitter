import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

const JweetFactory = ({ userObj }) => {
	const [jweet, setJweet] = useState("");
	const [attachment, setAttachment] = useState("");
	console.log("home", userObj);

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

	const handleResizeHeight = useCallback(() => {
		if (ref === null || ref.current === null) {
			return;
		}
		ref.current.style.height = "12rem";
		ref.current.style.height = ref.current.scrollheight + "px";
	});

	return (
		<div class="flex flex-row px-2 border border-black">
			<div class="flex flex-col">
				<div class="h-16 p-2">
					<img
						src={userObj.photoURL}
						class="h-full object-cover rounded-full"
						alt="img"
					/>
				</div>
			</div>
			<form onSubmit={onSubmit} class="w-full flex flex-col pl-2">
				<textarea
					type="text"
					value={jweet}
					onChange={onChange}
					placeholder="What's on your mind?"
					class="py-3 border border-black resize-none h-auto outline-none text-xl text-purple-300 focus:text-purple-500"
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
		</div>
	);
};

export default JweetFactory;
