import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const UserBox = (props) => {
	const user = props.user;
	const history = useHistory();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (user) setLoading(true);
	}, [user]);

	const goUser = () => {
		history.push("/profile/jweet/" + user.id);
	};
	return (
		<div
			onClick={goUser}
			class="w-full select-none z-30 cursor-pointer hover:bg-gray-100 transition delay-50 duration-300 flex flex-row px-2 pt-2 pb-4  border-b border-gray-200"
		>
			<>
				<div class="flex flex-col">
					{loading ? (
						<div class="h-16 w-16 p-2 pt-4">
							<Avatar src={user.photoURL} sx={{ width: 48, height: 48 }} />
						</div>
					) : (
						<div class="h-16 w-16 p-2">
							<Skeleton variant="circular">
								<Avatar sx={{ width: 48, height: 48 }} />
							</Skeleton>
						</div>
					)}
				</div>
				<div class="w-full flex flex-col pl-2">
					{loading ? (
						<div class="max-w-lg md:max-w-sm xl:max-w-xl flex flex-row mr-2 justify-between items-center">
							<div class="w-full flex flex-col">
								<h1 class="text-base font-bold mr-4">{user.displayName}</h1>
								<p class="text-gray-500">
									@{user.email ? user.email.split("@")[0] : ""}
								</p>
								{user.description !== "" && (
									<div class="max-w-lg md:max-w-sm xl:max-w-xl text-md">
										<p class="w-full truncate">{user.description}</p>
									</div>
								)}
							</div>
						</div>
					) : (
						<Skeleton width="100%">
							<div class="h-8"></div>
						</Skeleton>
					)}
				</div>
			</>
		</div>
	);
};

export default UserBox;
