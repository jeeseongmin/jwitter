import LoadingBox from "components/box/LoadingBox";

import JweetBox from "components/box/JweetBox";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { HiFire } from "react-icons/hi";

const Popular = () => {
	const [loading, setLoading] = useState(false);
	const [filteredJweets, setFilteredJweets] = useState([]);

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

export default Popular;
