import SearchJweetBox from "components/box/SearchJweetBox";
import SearchUserBox from "components/box/SearchUserBox";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiSearch } from "react-icons/fi";
import { MdCancel } from "react-icons/md";

const SearchBox = () => {
	const [search, setSearch] = useState("");
	const [focus, setFocus] = useState(false);
	const [filteredJweets, setFilteredJweets] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const inputRef = useRef();
	const [jweets, setJweets] = useState([]);
	const [users, setUsers] = useState([]);

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
			}
		);
	}, []);

	const getFiltered = useCallback(async () => {
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
	}, [search, jweets, users]);

	useEffect(() => {
		if (search !== "") {
			getFiltered();
		} else {
			setFilteredJweets([]);
			setFilteredUsers([]);
		}
	}, [getFiltered, search]);

	const onChange = (e) => {
		setSearch(e.target.value);
	};
	const clearText = (e) => {
		setSearch("");
		setFocus(false);
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
									return <SearchUserBox user={user} setFocus={setFocus} />;
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
								<SearchJweetBox
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
	);
};

export default SearchBox;
