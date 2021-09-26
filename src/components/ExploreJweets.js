import CircularProgress from "@material-ui/core/CircularProgress";
import {
	collection,
	doc,
	getDoc,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db, firebase } from "mybase";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import JweetBlock from "components/JweetBlock";
import { HiOutlineHashtag, HiHashtag } from "react-icons/hi";
import { GrFormRefresh } from "react-icons/gr";
import { Link, Route, Switch } from "react-router-dom";

const ExploreJweets = ({ filteredJweets }) => {
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);

	return (
		<div>
			{filteredJweets.length !== 0 ? (
				filteredJweets.map((jweet, index) => {
					return <JweetBlock key={jweet.id} jweet={jweet} type={"explore"} />;
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
				<div class="py-4 w-full flex justify-center">
					<CircularProgress />
				</div>
			)}
		</div>
	);
};

export default ExploreJweets;
