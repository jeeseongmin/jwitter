import LoadingBox from "components/box/LoadingBox";
import RecommendJweetBox from "components/box/RecommendJweetBox";
import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";

const PopularJweets = ({
	handleModalOpen,
	show,
	users,
	showMore,
	type,
	setType,
}) => {
	const [likeList, setLikeList] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			async (snapshot) => {
				const _myJweet = await snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				sorting(_myJweet);
				setLoading(true);
			}
		);
	}, [type]);

	function sorting(array) {
		array.sort(function (a, b) {
			return b.like.length - a.like.length;
		});
		setLikeList(array);
	}

	return (
		<>
			<div class="select-none py-3 border border-gray-100 bg-gray-100 w-full h-auto mt-2 rounded-xl">
				<div class="px-4 flex flex-row justify-between items-center">
					<p class="text-lg mb-2">
						<b>Popular Jweets</b>
					</p>
					<div
						onClick={handleModalOpen}
						class="relative hover:bg-gray-300 rounded-full cursor-pointer p-2 mb-2"
					>
						<FiSettings size={16} />
					</div>
				</div>
				{loading ? (
					<>
						<div class="flex-col">
							{likeList.map((element, index) => {
								if (index < show) {
									return (
										<RecommendJweetBox
											key={element.id}
											id={element.id}
											jweet={element}
											users={users}
										/>
									);
								}
							})}
						</div>
						{likeList.length >= 5 && (
							<div class="w-full my-2">
								{show === 5 || show === 10 ? (
									<p
										onClick={showMore}
										class="px-4 text-sm font-bold cursor-pointer text-blue-500"
									>
										show more...
									</p>
								) : (
									""
								)}
							</div>
						)}
					</>
				) : (
					<LoadingBox />
				)}
			</div>
		</>
	);
};

export default PopularJweets;
