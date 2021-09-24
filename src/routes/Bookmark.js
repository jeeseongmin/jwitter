import CircularProgress from "@material-ui/core/CircularProgress";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db, firebase } from "mybase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JweetBlock from "components/JweetBlock";

const Bookmark = () => {
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState({});
	const [filteredJweets, setFilteredJweets] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [bookmarkList, setBookmarkList] = useState([]);
	// const uid = match.params.id;
	const [selected, setSelected] = useState(1);

	const getMyInfo = async () => {
		const docRef = await doc(db, "users", currentUser.uid);
		await getDoc(docRef).then((snap) => {
			if (snap.exists()) {
				setInfo(snap.data());
				setLoading(true);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
	};

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
		console.log(filteredJweets);
	}, [currentUser.bookmark]);

	useEffect(() => {
		getMyInfo();
	}, []);
	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);
	return (
		<>
			<div class="flex-1 flex flex-col pl-64">
				<div class="w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
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
							return <JweetBlock key={jweet.id} jweet={jweet} />;
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
						<div class="py-4 w-full flex justify-center">
							<CircularProgress />
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default Bookmark;
