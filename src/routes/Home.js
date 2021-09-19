import Jweet from "components/Jweet";
import JweetFactory from "components/JweetFactory";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";

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
		<div class="flex-1 flex flex-col">
			<div class="px-4 py-3 font-bold text-xl flex justify-between border-b border-gray-200">
				<h1>Home</h1>
				<MdSettings zie={28} />
			</div>
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
