import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SearchJweetBlock = ({ jweet, users, setFocus }) => {
	const [filteredUser, setFilteredUser] = useState("");
	useEffect(() => {
		const _filteredUser = users.filter(function (element, index) {
			return element.id === jweet.creatorId;
		});
		setFilteredUser(_filteredUser);
	}, [jweet, users]);

	return (
		<Link
			to={"/jweet/" + jweet.id}
			onClick={() => setFocus(false)}
			class="select-none cursor-pointer flex flex-col  hover:bg-gray-100"
		>
			<div class="flex flex-row h-12">
				{filteredUser[0] && (
					<div class="h-full p-2">
						<img
							src={filteredUser[0].photoURL ? filteredUser[0].photoURL : ""}
							class="h-full rounded-full object-cover mr-2"
							alt="photourl"
						/>
					</div>
				)}
				<div class="w-full flex flex-col justify-center">
					{filteredUser[0] && (
						<>
							<p>
								<b>{filteredUser[0].displayName}</b>
							</p>
							<p class="text-xs text-gray-500">
								@{filteredUser[0].email.split("@")[0]}
							</p>
						</>
					)}
				</div>
			</div>
			<p class="truncate text-sm px-2 pt-1 pb-2">{jweet.text}</p>
		</Link>
	);
};

export default SearchJweetBlock;
