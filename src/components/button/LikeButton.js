import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
// import firebase from "firebase/compat/app";
import { useSelector } from "react-redux";
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const LikeButton = ({ jweet, likeRef, isDetail }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const [like, setLike] = useState(false);
	const [likeSnack, setLikeSnack] = useState();
	const likeClick = () => setLikeSnack(true);
	const likeClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setLikeSnack(false);
	};
	useEffect(() => {
		setLike(jweet.like.includes(currentUser.uid));
	}, [currentUser.uid, jweet.like]);

	const toggleLike = async () => {
		likeClick();
		if (jweet.like.includes(currentUser.uid)) {
			setLike(false);
			const cp = [...jweet.like];
			cp.splice(jweet.like.indexOf(currentUser.uid), 1);
			await updateDoc(doc(db, "jweets", jweet.id), {
				like: cp,
			});
		} else {
			setLike(true);
			const cp = [...jweet.like];
			cp.push(currentUser.uid);
			await updateDoc(doc(db, "jweets", jweet.id), {
				like: cp,
			});
		}
	};
	return (
		<>
			<div
				id="except"
				class={
					"w-1/4 flex flex-row items-center transition delay-50 duration-300 hover:text-red-500 " +
					(like ? "text-red-500 " : "text-gray-400 ") +
					(isDetail ? "justify-center" : "")
				}
			>
				<div
					id="except"
					onClick={toggleLike}
					ref={likeRef}
					class={
						"cursor-pointer rounded-full transition delay-50 duration-300 hover:bg-red-100 p-2 " +
						(isDetail ? " " : "mt-1 mr-1 ")
					}
				>
					{like ? (
						<AiTwotoneHeart size={isDetail ? 25 : 16} />
					) : (
						<AiOutlineHeart size={isDetail ? 25 : 16} />
					)}
				</div>
				{!isDetail && (
					<p id="except" class="text-sm flex flex-row items-center">
						{jweet.like.length}
					</p>
				)}
			</div>
			<Snackbar open={likeSnack} autoHideDuration={2000} onClose={likeClose}>
				<Alert
					onClose={likeClose}
					severity="success"
					color="error"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{like ? "좋아요!" : "좋아요 취소!"}
				</Alert>
			</Snackbar>
		</>
	);
};

export default LikeButton;
