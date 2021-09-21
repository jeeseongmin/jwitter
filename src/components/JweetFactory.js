import React, { useState, useCallback, useEffect, useRef } from "react";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { db, storage } from "mybase";
import { v4 as uuidv4 } from "uuid";

const JweetFactory = ({ userObj }) => {
	const [jweet, setJweet] = useState("");
	const [attachment, setAttachment] = useState("");
	const ref = useRef();
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

	useEffect(() => {
		if (ref === null || ref.current === null) {
			return;
		}
		ref.current.style.height = "40px";
		ref.current.style.height = ref.current.scrollHeight + "px";
	}, []);

	const handleResizeHeight = useCallback(() => {
		if (ref === null || ref.current === null) {
			return;
		}
		ref.current.style.height = "40px";
		ref.current.style.height = ref.current.scrollHeight + "px";
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
				<div class="w-full border-b border-gray-200 mb-4">
					<textarea
						type="text"
						value={jweet}
						ref={ref}
						onChange={onChange}
						placeholder="What's on your mind?"
						onInput={handleResizeHeight}
						class="py-3 resize-none h-10 overflow-hidden scroll leading-7 outline-none text-lg text-purple-300 focus:text-purple-500"
					/>
				</div>
				<div class="flex flex-row justify-between">
					{/* 좌측 아이콘 */}
					<div></div>
					{/* 우측 submit */}
					<div>
						<input
							type="submit"
							class="text-sm w-full rounded-full text-white font-bold bg-purple-400 flex justify-center px-4 py-1 hover:bg-purple-600 transition delay-50 duration-300 cursor-pointer"
							value="Jweet"
						/>
					</div>
				</div>
				<input type="file" accept="image/*" onChange={onFileChange} />
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
