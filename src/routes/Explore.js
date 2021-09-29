import MenuButton from "components/button/MenuButton";
import ExploreJweets from "components/container/ExploreJweets";
import ExploreUsers from "components/container/ExploreUsers";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { GrFormRefresh } from "react-icons/gr";
import { HiHashtag } from "react-icons/hi";
import { Route, Switch, useLocation } from "react-router-dom";

const Explore = () => {
	const location = useLocation();
	const [loading, setLoading] = useState(false);
	const [filteredJweets, setFilteredJweets] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [selected, setSelected] = useState(1);

	useEffect(() => {
		return () => setLoading(false); // cleanup function을 이용
	}, []);
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
		if (location.pathname.includes("jweets")) setSelected(1);
		else setSelected(2);
	}, [location.pathname]);

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
						{selected === 1 && (
							<div class="text-xs">Jweets are randomly selected</div>
						)}
						{selected === 2 && (
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
					<MenuButton
						url={"/explore/jweets"}
						onSelected={onSelected}
						selected={selected}
						num={1}
						width={"w-1/2"}
						text={"Jweets"}
					/>
					<MenuButton
						url={"/explore/users"}
						onSelected={onSelected}
						selected={selected}
						num={2}
						width={"w-1/2"}
						text={"Users"}
					/>
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

export default Explore;
