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
import { HiOutlineFire, HiFire } from "react-icons/hi";

const Popular = () => {
	const [loading, setLoading] = useState(false);
	const [info, setInfo] = useState({});
	const [filteredJweets, setFilteredJweets] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);

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
			async (snapshot) => {
				const myJweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				await myJweetArray.sort(function (a, b) {
					return b.like.length - a.like.length;
				});
				setFilteredJweets(myJweetArray);
				setLoading(true);
			}
		);
	}, []);

	useEffect(() => {
		getMyInfo();
	}, []);
	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);
	return (
		<>
			<div class="flex-1 flex flex-col pl-64">
				<div class="min-h-16 w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
					<div class="flex flex-col pl-2">
						<div class="font-bold text-xl flex flex-row items-center">
							<HiFire class="text-red-500 mr-1" /> Popular
						</div>
						<div class="text-xs">It's sorted based on likes</div>
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

export default Popular;
