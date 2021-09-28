import LoadingBox from "components/box/LoadingBox";
import RecommendJweetBox from "components/box/RecommendJweetBox";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";

const RandomJweets = ({
	handleModalOpen,
	show,
	users,
	showMore,
	type,
	setType,
}) => {
	const [randomList, setRandomList] = useState([]);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		return () => setLoading(false);
	}, []);
	useEffect(() => {
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const _myJweet = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				shuffle(_myJweet);
				if (type === "") setType("like");
				setLoading(true);
			}
		);
	}, [type]);

	function shuffle(array) {
		for (let index = array.length - 1; index > 0; index--) {
			// 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
			const randomPosition = Math.floor(Math.random() * (index + 1));
			// 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
			const temporary = array[index];
			array[index] = array[randomPosition];
			array[randomPosition] = temporary;
		}
		setRandomList(array);
	}

	return (
		<>
			<div class="select-none py-3 border border-gray-100 bg-gray-100 w-full h-auto mt-2 rounded-xl">
				<div class="px-4 flex flex-row justify-between items-center">
					<p class="text-lg mb-2">
						<b>Random Jweets</b>
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
							{randomList.map((element, index) => {
								if (index < show) {
									return (
										<RecommendJweetBox
											key={element.id}
											jweet={element}
											users={users}
										/>
									);
								}
							})}
						</div>
						{randomList.length >= 5 && (
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

export default RandomJweets;
