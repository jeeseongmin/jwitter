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

const MyJweets = ({ match }) => {
	const uid = match.params.id;
	const currentUser = useSelector((state) => state.user.currentUser);
	const [myJweets, setMyJweets] = useState([]);
	const [loading, setLoading] = useState(false);

	// useEffect(() => {
	// 	onSnapshot(
	// 		query(
	// 			collection(db, "jweets"),
	// 			orderBy("createdAt", "desc"),
	// 			where("creatorId", "==", uid)
	// 		),
	// 		(snapshot) => {
	// 			snapshot.docChanges().forEach((change) => {
	// 				console.log(change);
	// 			});
	// 		}
	// 	);
	// }, []);

	useEffect(() => {
		// onSnapshot(
		// 	query(
		// 		collection(db, "jweets"),
		// 		orderBy("createdAt", "desc"),
		// 		where("creatorId", "==", uid)
		// 	),
		// 	(snapshot) => {
		// 		const _myJweet = snapshot.docs.map((doc) => ({
		// 			id: doc.id,
		// 			...doc.data(),
		// 		}));
		// 		setMyJweets(_myJweet);
		// 		setLoading(true);
		// 	}
		// );
		const q = query(
			collection(db, "jweets"),
			orderBy("createdAt", "desc"),
			where("creatorId", "==", uid)
		);
		onSnapshot(q, (querySnapshot) => {
			const cp = [];
			querySnapshot.forEach((doc) => {
				cp.push({
					id: doc.id,
					...doc.data(),
				});
			});
			setMyJweets(cp);
		});
	}, [uid]);

	return (
		<div>
			{myJweets.length !== 0 ? (
				myJweets.map((jweet, index) => {
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
						You don’t have any Jweet yet
					</div>
					<div class="w-2/3 text-gray-500">
						Write a Jweet. When you do, it’ll show up here.
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

export default MyJweets;
