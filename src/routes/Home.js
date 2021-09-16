import React, { useEffect, useState } from "react";
import { db, storage } from "mybase";
import {
	addDoc,
	collection,
	getDocs,
	onSnapshot,
	doc,
	query,
	orderBy,
	getFirestore,
} from "firebase/firestore";
import Jweet from "components/Jweet";
import { uploadString, getDownloadURL, ref } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = (props) => {
	const userObj = props.userObj;
	const [jweet, setJweet] = useState("");
	const [jweets, setJweets] = useState([]);
	const [attachment, setAttachment] = useState("");

	useEffect(() => {
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const nweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setJweets(nweetArray);
			}
		);
	}, []);

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
		<div>
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
			<div>
				{jweets.map((jweet) => (
					<Jweet
						key={jweet.id}
						jweetObj={jweet}
						isOwner={jweet.creatorId === userObj.uid}
					/>
				))}
			</div>
		</div>
	);
};

export default Home;
