import Jweet from "components/Jweet";
import JweetFactory from "components/JweetFactory";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
	const [jweets, setJweets] = useState([]);

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

	return (
		<div>
			<JweetFactory userObj={userObj} />
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
