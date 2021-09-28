import UserBox from "components/box/UserBox";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import LoadingBox from "components/box/LoadingBox";

const ExploreUser = ({ filteredUsers }) => {
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<div class="w-full">
			{filteredUsers.length !== 0 ? (
				filteredUsers.map((user, index) => {
					return <UserBox key={user.id} user={user} />;
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
				<LoadingBox />
			)}
		</div>
	);
};

export default ExploreUser;
