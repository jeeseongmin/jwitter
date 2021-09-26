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
import { Link, Route, Switch } from "react-router-dom";
import ExploreJweets from "components/ExploreJweets";
import ExploreUsers from "components/ExploreUsers";

const Popular = () => {
	const [loading, setLoading] = useState(false);
	const [filteredJweets, setFilteredJweets] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [randomList, setRandomList] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [selected, setSelected] = useState(1);
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
			const userArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const _randomList = Array.from({ length: userArray.length }, (v, i) => i);
			shuffle(_randomList);
			const _randomArray = await _randomList.map((element, index) => {
				return userArray[element];
			});
			setFilteredJweets(_randomArray);
			setLoading(true);
		});

		onSnapshot(query(collection(db, "users")), async (snapshot) => {
			const userArray = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			const _randomList = Array.from({ length: userArray.length }, (v, i) => i);
			shuffle(_randomList);
			const _randomArray = await _randomList.map((element, index) => {
				return userArray[element];
			});
			setFilteredUsers(_randomArray);
			setLoading(true);
		});
	}, []);

	const refreshJweets = async () => {
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
	const refreshUsers = async () => {
		setLoading(false);
		const _randomList = Array.from(
			{ length: filteredUsers.length },
			(v, i) => i
		);
		shuffle(_randomList);
		const _randomArray = await _randomList.map((element, index) => {
			return filteredUsers[element];
		});
		setFilteredUsers(_randomArray);
		setLoading(true);
	};

	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);

	useEffect(() => {
		if (window.location.href.includes("jweets")) setSelected(1);
		else setSelected(2);
	}, [window.location.href]);

	const onSelected = (num) => {
		window.scrollTo(0, 0);
		setSelected(num);
	};

	return (
		<>
			<div class="select-none flex-1 flex flex-col pl-64">
				<div class="min-h-16 w-full px-2 py-2 flex flex-row justify-between items-center border-b border-gray-200">
					<div class="flex flex-col pl-2">
						<div class="font-bold text-xl flex flex-row items-center">
							<HiHashtag class="text-purple-700 mr-1" /> Explore
						</div>
						{(selected === 1 || window.location.href.includes("jweets")) && (
							<div class="text-xs">Jweets are randomly selected</div>
						)}
						{(selected === 2 || window.location.href.includes("users")) && (
							<div class="text-xs">Users are randomly selected</div>
						)}
					</div>
					<div
						onClick={selected === 1 ? refreshJweets : refreshUsers}
						class="p-2 rounded-full hover:bg-gray-100 cursor-pointer"
					>
						<GrFormRefresh size={28} />
					</div>
				</div>
				<div class="w-full flex flex-row ">
					<Link
						to={"/explore/jweets"}
						onClick={() => onSelected(1)}
						class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
					>
						<span
							class={
								"py-3 " + (selected === 1 ? "border-b-4 border-purple-500" : "")
							}
						>
							Jweets
						</span>
					</Link>
					<Link
						to={"/explore/users"}
						onClick={() => onSelected(2)}
						class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
					>
						<span
							class={
								"py-3 " + (selected === 2 ? "border-b-4 border-purple-500" : "")
							}
						>
							Users
						</span>
					</Link>
				</div>
				<Switch>
					<Route path="/explore/jweets">
						<ExploreJweets filteredJweets={filteredJweets} />
					</Route>
					<Route path="/explore/users">
						<ExploreUsers filteredUsers={filteredUsers} />
					</Route>
				</Switch>
			</div>
		</>
	);
};

export default Popular;
