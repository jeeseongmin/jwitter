import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";

const LoadingBox = () => {
	return (
		<div class="h-full py-4 flex-1 flex flex-row justify-center items-center">
			<CircularProgress />
		</div>
	);
};

export default LoadingBox;
