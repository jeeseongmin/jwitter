import JweetBox from "components/box/JweetBox";
import CreateJweetBox from "components/box/CreateJweetBox";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useSelector } from "react-redux";
import LoadingBox from "components/box/LoadingBox";

const Home = () => {
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);

	const [jweets, setJweets] = useState([]);

	useEffect(() => {}, []);

	useEffect(() => {
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const nweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setJweets(nweetArray);
				setLoading(true);
			}
		);
	}, []);

	return (
		<div class="flex-1 flex flex-col pl-64">
			<div class="px-4 py-2 font-bold text-xl flex justify-between items-center border-b border-gray-200">
				<h1 class="cursor-pointer">Home</h1>
				<div class="hover:bg-gray-200 transition delay-50 duration-300 rounded-full p-2">
					<MdSettings size={24} class="cursor-pointer" />
				</div>
			</div>
			<CreateJweetBox isModal={false} />
			<div>
				{jweets.length !== 0 ? (
					jweets.map((jweet, index) => {
						return <JweetBox key={jweet.id} jweet={jweet} id={jweet.id} />;
					})
				) : loading ? (
					<div class="w-full flex-1 flex justify-center items-center mt-8">
						등록된 Jweet이 없습니다.
					</div>
				) : (
					<LoadingBox />
				)}
			</div>
		</div>
	);
};

export default Home;
