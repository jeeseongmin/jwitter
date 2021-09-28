import JweetBox from "components/box/JweetBox";
import {
	collection,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import LoadingBox from "components/box/LoadingBox";

const ReJweets = ({ match }) => {
	const uid = match.params.id;
	const currentUser = useSelector((state) => state.user.currentUser);
	const [rejweets, setRejweets] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		onSnapshot(
			query(
				collection(db, "jweets"),
				where("rejweet", "array-contains", uid),
				orderBy("createdAt", "desc")
			),
			(snapshot) => {
				const reJweets = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setRejweets(reJweets);
				setLoading(true);
			}
		);
	}, [uid]);

	return (
		<div>
			{rejweets.length !== 0 ? (
				rejweets.map((jweet, index) => {
					return (
						<JweetBox
							key={jweet.id}
							jweet={jweet}
							id={jweet.id}
							isOwner={jweet.creatorId === currentUser.uid}
						/>
					);
				})
			) : loading ? (
				<div class="flex flex-col justify-center items-center mt-16">
					<div class="w-2/3 font-bold text-2xl">
						You don’t have any reJweet yet
					</div>
					<div class="w-2/3 text-gray-500">
						Try a reJweet for any jweet. When you do, it’ll show up here.
					</div>
				</div>
			) : (
				<LoadingBox />
			)}
		</div>
	);
};

export default ReJweets;
