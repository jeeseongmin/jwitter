import JweetBox from "components/box/JweetBox";
import React from "react";

const ExploreJweets = ({ filteredJweets }) => {
	return (
		<div>
			{filteredJweets.length !== 0 ? (
				filteredJweets.map((jweet, index) => {
					return <JweetBox key={jweet.id} jweet={jweet} type={"explore"} />;
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

export default ExploreJweets;
