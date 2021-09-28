import LoadingBox from "components/box/LoadingBox";
import RecommendUserBox from "components/box/RecommendUserBox";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { RiRefreshLine } from "react-icons/ri";
import { useHistory } from "react-router-dom";

const RecommendUsers = () => {
	const history = useHistory();
	const [loading, setLoading] = useState(false);

	const [users, setUsers] = useState([]);

	const [refresh, setRefresh] = useState(false);
	const toggleRefresh = () => setRefresh(!refresh);

	const showMore = () => {
		history.push("/explore/users");
	};

	useEffect(() => {
		onSnapshot(query(collection(db, "users")), (snapshot) => {
			const _user = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			shuffle(_user);
			setUsers(_user);
			setLoading(true);
		});
	}, [refresh]);

	function shuffle(array) {
		for (let index = array.length - 1; index > 0; index--) {
			const randomPosition = Math.floor(Math.random() * (index + 1));
			const temporary = array[index];
			array[index] = array[randomPosition];
			array[randomPosition] = temporary;
		}
	}

	return (
		<>
			<div class="select-none py-3 border border-gray-100 bg-gray-100 w-full h-auto mt-2 rounded-xl">
				<div class="px-4 flex flex-row justify-between items-center">
					<p class="text-lg mb-2">
						<b>You might like</b>
					</p>
					<div
						onClick={toggleRefresh}
						class="relative hover:bg-gray-300 rounded-full cursor-pointer p-2 mb-2"
					>
						<RiRefreshLine size={16} />
					</div>
				</div>
				{loading ? (
					<>
						<div class="flex-col">
							{users.map((user, index) => {
								if (index < 5) {
									return <RecommendUserBox key={user.id} user={user} />;
								}
							})}
						</div>
						<div class="w-full my-2">
							<p
								onClick={showMore}
								class="px-4 text-sm font-bold cursor-pointer text-blue-500"
							>
								show more...
							</p>
						</div>
					</>
				) : (
					<LoadingBox />
				)}
			</div>
		</>
	);
};

export default RecommendUsers;
