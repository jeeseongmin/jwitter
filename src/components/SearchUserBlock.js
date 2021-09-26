import React from "react";
import { Link } from "react-router-dom";

const SearchUserBlock = ({ user, setFocus }) => {
	return (
		<Link
			to={"/profile/jweet/" + user.id}
			onClick={() => setFocus(false)}
			class="select-none cursor-pointer flex flex-row h-16 hover:bg-gray-100"
		>
			<div class="h-full p-2">
				<img
					src={user.photoURL}
					class="h-full rounded-full object-cover mr-2"
					alt="photourl"
				/>
			</div>
			<div class="flex flex-col justify-center">
				<p>
					<b>{user.displayName}</b>
				</p>
				<p class="text-sm text-gray-500">@{user.email.split("@")[0]}</p>
				<p class="text-xs text-gray-500">
					{user.description !== "" ? user.description : ""}
				</p>
			</div>
		</Link>
	);
};

export default SearchUserBlock;
