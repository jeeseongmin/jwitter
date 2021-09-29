import UserBox from "components/box/UserBox";
import React from "react";

const ExploreUser = ({ filteredUsers }) => {
	return (
		<div class="w-full">
			{filteredUsers.length !== 0 ? (
				filteredUsers.map((user, index) => {
					return <UserBox key={user.id} user={user} />;
				})
			) : (
				<div class="w-full flex flex-col justify-center items-center mt-8">
					<div class="w-2/3 font-bold text-2xl">
						You haven’t added any Jweets to your Bookmarks yet
					</div>
					<div class="w-2/3 text-gray-500">
						When you do, they’ll show up here.
					</div>
				</div>
			)}
		</div>
	);
};

export default ExploreUser;
