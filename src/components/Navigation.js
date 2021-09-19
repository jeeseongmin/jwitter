import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Navigation = ({ userObj }) => {
	useEffect(() => {
		if (userObj.displayName === null) userObj.displayName = "";
	}, []);
	return (
		<nav>
			<ul>
				<li>
					<Link to="/">Home</Link>
				</li>
				<li>
					{userObj && (
						<Link to="/profile">
							{userObj.displayName ? userObj.displayName : "나"}의 Profile
						</Link>
					)}
				</li>
			</ul>
		</nav>
	);
};

export default Navigation;
