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
import { HiOutlineHashtag, HiHashtag } from "react-icons/hi";
import { GrFormRefresh } from "react-icons/gr";
const Popular = () => {
	const [loading, setLoading] = useState(false);
	const [filteredJweets, setFilteredJweets] = useState([]);
	const [randomList, setRandomList] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	function shuffle(array) {
		for (let index = array.length - 1; index > 0; index--) {
			// 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
			const randomPosition = Math.floor(Math.random() * (index + 1));
			// 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
			const temporary = array[index];
			array[index] = array[randomPosition];
			array[randomPosition] = temporary;
		}
	}

	useEffect(() => {
		onSnapshot(query(collection(db, "jweets")), async (snapshot) => {
			const myJweetArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const _randomList = Array.from(
				{ length: myJweetArray.length },
				(v, i) => i
			);
			shuffle(_randomList);
			const _randomArray = await _randomList.map((element, index) => {
				return myJweetArray[element];
			});
			setFilteredJweets(_randomArray);
			setLoading(true);
		});
	}, []);

	const refresh = async () => {
		setLoading(false);
		const _randomList = Array.from(
			{ length: filteredJweets.length },
			(v, i) => i
		);
		shuffle(_randomList);
		const _randomArray = await _randomList.map((element, index) => {
			return filteredJweets[element];
		});
		setFilteredJweets(_randomArray);
		setLoading(true);
	};

	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);

	return (
		<>
			<div class="select-none flex-1 flex flex-col pl-64">
				<div class="min-h-16 w-full px-2 py-2 flex flex-row justify-between items-center border-b border-gray-200">
					<div class="flex flex-col pl-2">
						<div class="font-bold text-xl flex flex-row items-center">
							<HiHashtag class="text-purple-700 mr-1" /> Explore
						</div>
						<div class="text-xs">Jweets are randomly selected</div>
					</div>
					<div
						onClick={refresh}
						class="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
					>
						<GrFormRefresh size={28} />
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
