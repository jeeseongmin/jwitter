import React, { useState, useEffect } from "react";
import JweetBlock from "components/JweetBlock";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import {
	getDocs,
	query,
	collection,
	where,
	doc,
	orderBy,
	limit,
	onSnapshot,
	getDoc,
} from "firebase/firestore";
import { auth, db } from "mybase";

const ReJweets = ({ match }) => {
	const uid = match.params.id;
	const currentUser = useSelector((state) => state.user.currentUser);
	const [rejweets, setRejweets] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// const q = query(
		// 	collection(db, "jweets"),
		// 	orderBy("createdAt", "desc"),
		// 	where("rejweet", "array-contains", uid)
		// );
		// onSnapshot(q, (querySnapshot) => {
		// 	const cp = [];
		// 	querySnapshot.forEach((doc) => {
		// 		cp.push({
		// 			id: doc.id,
		// 			...doc.data(),
		// 		});
		// 	});
		// 	setRejweets(cp);
		// 	setLoading(true);
		// });

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
						<JweetBlock
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
				<div class="py-4 w-full flex justify-center">
					<CircularProgress />
				</div>
			)}
		</div>
	);
};

export default ReJweets;
