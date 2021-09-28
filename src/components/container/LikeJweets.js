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

const LikeJweets = ({ match }) => {
	const uid = match.params.id;
	const currentUser = useSelector((state) => state.user.currentUser);
	const [likeJweets, setLikeJweets] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		onSnapshot(
			query(
				collection(db, "jweets"),
				where("like", "array-contains", uid),
				orderBy("createdAt", "desc")
			),
			(snapshot) => {
				const _likeJweets = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setLikeJweets(_likeJweets);
				setLoading(true);
			}
		);
	}, [uid]);

	return (
		<div>
			{likeJweets.length !== 0 ? (
				likeJweets.map((jweet, index) => {
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
				<div class="w-full flex flex-col justify-center items-center mt-16">
					<div class="w-2/3 font-bold text-2xl">
						You don’t have any likes yet
					</div>
					<div class="w-2/3 text-gray-500">
						Tap the heart on any Jweet to show it some love. When you do, it’ll
						show up here.
					</div>
				</div>
			) : (
				<LoadingBox />
			)}
		</div>
	);
};

export default LikeJweets;
