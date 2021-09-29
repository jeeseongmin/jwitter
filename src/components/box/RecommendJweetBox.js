import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const RecommendJweet = ({ jweet, users }) => {
	const history = useHistory();

	const [filteredUser, setFilteredUser] = useState("");
	useEffect(() => {
		const _filteredUser = users.filter(function (element, index) {
			return element.id === jweet.creatorId;
		});
		setFilteredUser(_filteredUser);
	}, [users, jweet]);

	const goPage = () => {
		history.push("/jweet/" + jweet.id);
		window.scrollTo(0, 0);
	};
	return (
		<div
			onClick={goPage}
			class="pl-2 pr-4 py-1 select-none cursor-pointer flex flex-col  hover:bg-gray-200"
		>
			<div class="flex flex-row h-12 items-center">
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
			<p class="truncate text-xs px-2 pt-1 pb-2">{jweet.text}</p>
		</div>
	);
};

export default RecommendJweet;
