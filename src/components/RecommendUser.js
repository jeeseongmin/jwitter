import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import {
	AiOutlineHeart,
	AiOutlineRetweet,
	AiTwotoneDelete,
	AiTwotoneHeart,
} from "react-icons/ai";
import Skeleton from "@mui/material/Skeleton";
import Avatar from "@mui/material/Avatar";

const RecommendUser = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const goPage = () => {
		history.push("/profile/jweet/" + user.id);
		window.scrollTo(0, 0);
	};

	useEffect(() => {
		if (user) setLoading(true);
	}, []);
	return (
		<div
			onClick={goPage}
			class="h-full pl-2 pr-4 py-1 select-none cursor-pointer flex flex-row justify-between items-center hover:bg-gray-200"
		>
			<div class="flex flex-row h-12 w-full items-center">
				{loading ? (
					<div class="h-full p-1 mr-2 pt-1">
						<Avatar
							src={user.photoURL ? user.photoURL : ""}
							sx={{ width: 40, height: 40 }}
						/>
					</div>
				) : (
					<Skeleton variant="circular">
						<div class="h-full p-1 mr-2 pt-1">
							<Avatar sx={{ width: 40, height: 40 }} />
						</div>
					</Skeleton>
				)}
				<div class="w-full flex flex-col justify-center">
					{loading ? (
						<>
							<p>
								<b>{user.displayName}</b>
							</p>
							<p class="text-xs text-gray-500">@{user.email.split("@")[0]}</p>
						</>
					) : (
						<>
							<p>
								<Skeleton width="100%">
									<b>{user.displayName}</b>
								</Skeleton>
							</p>
							<Skeleton width="100%">
								<p class="text-xs text-gray-500">@{user.email.split("@")[0]}</p>
							</Skeleton>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default RecommendUser;
