import React, { useEffect, useState } from "react";
import { dbService } from "mybase";
import { addDoc, collection, getDocs } from "firebase/firestore";

const Home = (props) => {
	const userObj = props.userObj;
	const [jweet, setJweet] = useState("");
	const [jweets, setJweets] = useState([]);
	const getJweets = async () => {
		const _jweets = await getDocs(collection(dbService, "jweets"));
		_jweets.forEach((document) => {
			const jweetObject = {
				...document.data(),
				id: document.id,
			};
			setJweets((prev) => [jweetObject, ...prev]);
		});
	};
	useEffect(() => {
		// getJweets();

		dbService.collection("jweets").onSnapshot((snapshot) => {
			const _jweets = snapshot.getDocs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setJweets(_jweets);
		});
	}, []);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			await addDoc(collection(dbService, "jweets"), {
				text: jweet,
				createdAt: Date.now(),
				creatorId: userObj.uid,
			});
		} catch (error) {
			console.log(error);
		}

		setJweet("");
	};
	const onChange = (e) => {
		setJweet(e.target.value);
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
				<input type="submit" value="Jweet" />
			</form>
			<div>
				{jweets.map((jweet) => (
					<div key={jweet.id}>
						<h4>{jweet.jweet}</h4>
					</div>
				))}
			</div>
		</div>
	);
};

export default Home;
