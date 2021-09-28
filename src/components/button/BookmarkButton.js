import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
// import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const BookmarkButton = ({ jweet, bookmarkRef, isDetail }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [bookmark, setBookmark] = useState(false);

	// Snack bar
	const [bookmarkSnack, setBookmarkSnack] = useState();
	const bookmarkClick = () => setBookmarkSnack(true);
	const bookmarkClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setBookmarkSnack(false);
	};

	useEffect(() => {
		setBookmark(currentUser.bookmark.includes(jweet.id));
	}, []);

	const toggleBookmark = async () => {
		bookmarkClick();
		if (currentUser.bookmark.includes(jweet.id)) {
			setBookmark(false);
			const cp = [...currentUser.bookmark];
			cp.splice(currentUser.bookmark.indexOf(jweet.id), 1);
			await updateDoc(doc(db, "users", currentUser.uid), {
				bookmark: cp,
			});
			dispatch(
				setCurrentUser({
					...currentUser,
					bookmark: cp,
				})
			);
		} else {
			setBookmark(true);
			const cp = [...currentUser.bookmark];
			cp.push(jweet.id);
			await updateDoc(doc(db, "users", currentUser.uid), {
				bookmark: cp,
			});
			dispatch(
				setCurrentUser({
					...currentUser,
					bookmark: cp,
				})
			);
		}
	};

	return (
		<>
			<div
				id="except"
				class={
					"w-1/4 flex flex-row items-center transition delay-50 duration-300 text-gray-400 hover:text-blue-500 " +
					(bookmark ? "text-blue-500 " : " ") +
					(isDetail ? "justify-center " : "")
				}
			>
				<div
					onClick={toggleBookmark}
					ref={bookmarkRef}
					id="except"
					class={
						"cursor-pointer rounded-full transition delay-50 duration-300 hover:bg-blue-100 p-2 " +
						(isDetail ? "" : "mt-1 mr-1")
					}
				>
					{bookmark ? (
						<MdBookmark size={isDetail ? 27 : 16} />
					) : (
						<MdBookmarkBorder size={isDetail ? 27 : 16} />
					)}
				</div>
			</div>
			<Snackbar
				open={bookmarkSnack}
				autoHideDuration={2000}
				onClose={bookmarkClose}
			>
				<Alert
					onClose={bookmarkClose}
					severity="success"
					color="info"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{bookmark ? "북마크 저장" : "북마크 취소"}
				</Alert>
			</Snackbar>
		</>
	);
};

export default BookmarkButton;
