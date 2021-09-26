import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import {
	getDocs,
	query,
	collection,
	where,
	doc,
	orderBy,
	limit,
	onSnapshot,
	getDoc,
} from "firebase/firestore";
import { auth, db } from "mybase";
import SearchUserBlock from "components/SearchUserBlock";
import SearchJweetBlock from "components/SearchJweetBlock";
import RecommendJweetBlock from "components/RecommendJweetBlock";
import RecommendUserBlock from "components/RecommendUserBlock";

const Rightbar = () => {
	const [loading, setLoading] = useState(false);
	const [search, setSearch] = useState("");
	const [focus, setFocus] = useState(false);
	const [jweets, setJweets] = useState([]);
	const [filteredJweets, setFilteredJweets] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [users, setUsers] = useState([]);
	const inputRef = useRef();

	useEffect(() => {
		onSnapshot(query(collection(db, "users")), (snapshot) => {
			const _user = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(_user);
		});
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const _jweet = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setJweets(_jweet);
				setLoading(true);
			}
		);
	}, []);

	const getFiltered = async () => {
		console.log(users, jweets);
		const _filteredUsers = await users.filter(function (element, index) {
			return (
				element.displayName.includes(search) ||
				element.email.includes(search) ||
				search === "all"
			);
		});
		await setFilteredUsers(_filteredUsers);
		const _filteredJweets = await jweets.filter(function (element, index) {
			return element.text.includes(search) || search === "all";
		});
		await setFilteredJweets(_filteredJweets);
		console.log(filteredUsers, filteredJweets);
	};

	useEffect(() => {
		if (search !== "") {
			getFiltered();
			setLoading(true);
		} else {
			setLoading(false);
			setFilteredJweets([]);
			setFilteredUsers([]);
		}
	}, [search]);

	const onChange = (e) => {
		setSearch(e.target.value);
		setLoading(false);
	};
	const clearText = (e) => {
		setSearch("");
		setFocus(false);
		console.log("clear", search);
	};

	useEffect(() => {
		if (!focus) return;
		function handleClick(e) {
			if (inputRef.current === null) {
				return;
			} else if (!inputRef.current.contains(e.target)) {
				setFocus(false);
			}
		}
		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [focus]);

	return (
		<div class="h-full w-80 hidden xl:flex xl:flex-col xl:items-center border-l border-gray-100 px-4 ">
			<div
				ref={inputRef}
				class="relative w-full h-14 border-b border-gray-200 py-1 flex flex-row items-center"
			>
				<div
					class={
						"h-full w-full flex flex-row rounded-full items-center px-2 py-2 " +
						(focus
							? "bg-white text-blue-500 border border-blue-500"
							: "bg-gray-100 text-gray-500 border border-gray-200")
					}
				>
					<div>
						<FiSearch
							size={20}
							class={" " + (focus ? " text-blue-500" : "text-gray-500")}
						/>
					</div>
					<input
						type="text"
						placeholder="Search Jwitter"
						onFocus={() => setFocus(true)}
						onChange={onChange}
						value={search}
						class={
							"select-none w-full outline-none text-sm text-gray-500 py-1 px-2 " +
							(focus ? "bg-white " : "bg-gray-100 ")
						}
					/>
					{focus && search !== "" && (
						<div
							onClick={clearText}
							class="z-40 p-2 rounded-full flex justify-center items-center"
						>
							<MdCancel size={24} class="text-blue-500" />
						</div>
					)}
				</div>
				{focus && (
					<div
						class={
							"z-50 select-none absolute px-4 py-4 border border-gray-200 max-h-96 bg-white rounded-lg w-full top-14 shadow-xl h-auto " +
							(filteredUsers.length !== 0 || filteredJweets.length !== 0
								? "overflow-y-scroll"
								: "")
						}
					>
						{search !== "" &&
							filteredUsers.length === 0 &&
							filteredJweets.length === 0 && (
								<div class="w-full text-xs mb-6">
									<p>search for "{search}"</p>
								</div>
							)}
						{search === "" && (
							<div class="w-full text-xs mb-6">
								<p>Try searching for people, topics, or keywords</p>
							</div>
						)}
						{filteredUsers.length !== 0 && (
							<div class="border-b border-gray-200 pb-2">
								<div class="w-full font-bold text-lg mb-1 ">Users</div>

								<div class="w-full flex flex-col">
									{filteredUsers.map((user, index) => {
										return <SearchUserBlock user={user} setFocus={setFocus} />;
									})}
								</div>
							</div>
						)}
						{filteredJweets.length !== 0 && (
							<div class="w-full font-bold text-lg mt-3 mb-1 ">Jweets</div>
						)}
						<div class="w-full flex flex-col">
							{filteredJweets.map((jweet, index) => {
								return (
									<SearchJweetBlock
										jweet={jweet}
										users={users}
										setFocus={setFocus}
									/>
								);
							})}
						</div>
					</div>
				)}
			</div>
			<RecommendUserBlock jweets={jweets} users={users} />
			<div class="w-full mb-2"></div>
			<RecommendJweetBlock jweets={jweets} users={users} />
		</div>
	);
};

export default Rightbar;
