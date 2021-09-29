import LoadingBox from "components/box/LoadingBox";

import JweetBox from "components/box/JweetBox";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
} from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

const Bookmark = () => {
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState({});
	const [filteredJweets, setFilteredJweets] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);

	const getMyInfo = useCallback(async () => {
		const docRef = await doc(db, "users", currentUser.uid);
		await getDoc(docRef).then((snap) => {
			if (snap.exists()) {
				setInfo(snap.data());
				setLoading(true);
			} else {
				console.log("No such document!");
			}
		});
	}, [currentUser.uid]);

	useEffect(() => {
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const myJweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const _myJweet = myJweetArray.filter(function (element, index) {
					return currentUser.bookmark.includes(element.id);
				});
				setFilteredJweets(_myJweet);
				setLoading(true);
			}
		);
	}, [currentUser.bookmark]);

	useEffect(() => {
		getMyInfo();
	}, [getMyInfo]);

	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);

	return (
		<>
			<div class="flex-1 flex flex-col pl-64">
				<div class="min-h-16 w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
					<div class="flex flex-col pl-2">
						<div class="font-bold text-xl">Bookmarks</div>
						<div class="text-xs">
							{info.email ? "@" + info.email.split("@")[0] : ""}
						</div>
					</div>
				</div>
				<div>
					{filteredJweets.length !== 0 ? (
						filteredJweets.map((jweet, index) => {
							return <JweetBox key={jweet.id} jweet={jweet} />;
						})
					) : loading ? (
						<div class="w-full flex flex-col justify-center items-center mt-8">
							<div class="w-2/3 font-bold text-2xl">
								You haven’t added any Jweets to your Bookmarks yet
							</div>
							<div class="w-2/3 text-gray-500">
								When you do, they’ll show up here.
							</div>
						</div>
					) : (
						<LoadingBox />
					)}
				</div>
			</div>
		</>
	);
};

export default Bookmark;
