import RecommendJweets from "components/container/RecommendJweets";
import RecommendUsers from "components/container/RecommendUsers";
import SearchBox from "components/box/SearchBox";
import React from "react";
const Rightbar = () => {
	return (
		<div class="h-full w-80 hidden xl:flex xl:flex-col xl:items-center border-l border-gray-100 px-4 ">
			<SearchBox />
			<RecommendUsers />
			<div class="w-full mb-2"></div>
			<RecommendJweets />
		</div>
	);
};

export default Rightbar;
