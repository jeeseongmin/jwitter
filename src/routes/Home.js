import JweetBlock from "components/JweetBlock";
import JweetFactory from "components/JweetFactory";
import {
	collection,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { MdSettings } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";
import CircularProgress from "@material-ui/core/CircularProgress";

const Home = () => {
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);

	const [jweets, setJweets] = useState([]);

	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);

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
			<div class="max-16 px-4 py-2 font-bold text-xl flex justify-between items-center border-b border-gray-200">
				<h1 class="cursor-pointer">Home</h1>
				<div class="hover:bg-gray-200 transition delay-50 duration-300 rounded-full p-2">
					<MdSettings size={24} class="cursor-pointer" />
				</div>
			</div>
			<JweetFactory isModal={false} />
			<div>
				{jweets.length !== 0 ? (
					jweets.map((jweet) => {
						return <JweetBlock key={jweet.id} jweet={jweet} />;
					})
				) : loading ? (
					<div class="w-full flex-1 flex justify-center items-center mt-8">
						등록된 Jweet이 없습니다.
					</div>
				) : (
					<div class="py-4 w-full flex justify-center">
						<CircularProgress />
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
