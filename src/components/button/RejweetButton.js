import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { AiOutlineRetweet } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "reducers/user";
const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RejweetButton = ({ jweet, reJweetRef, isDetail }) => {
	const dispatch = useDispatch();
	const currentUser = useSelector((state) => state.user.currentUser);
	const [rejweet, setRejweet] = useState(false);

	const [rejweetSnack, setRejweetSnack] = useState();
	const rejweetClick = () => setRejweetSnack(true);
	const rejweetClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setRejweetSnack(false);
	};
	useEffect(() => {
		setRejweet(jweet.rejweet.includes(currentUser.uid));
	}, [currentUser.uid, jweet.rejweet]);

	const toggleRejweet = async () => {
		rejweetClick();

		if (!currentUser.rejweet) {
			await updateDoc(doc(db, "users", currentUser.uid), {
				rejweet: [],
			});
			dispatch(
				setCurrentUser({
					...currentUser,
					rejweet: [],
				})
			);
		}

		if (jweet.rejweet.includes(currentUser.uid)) {
			setRejweet(false);
			const cp = [...currentUser.rejweet];
			cp.splice(currentUser.rejweet.indexOf(jweet.id), 1);
			await updateDoc(doc(db, "users", currentUser.uid), {
				rejweet: cp,
			});
			dispatch(
				setCurrentUser({
					...currentUser,
					rejweet: cp,
				})
			);
			const cp_jweet = [...jweet.rejweet];
			cp_jweet.splice(cp_jweet.indexOf(currentUser.uid), 1);

			await updateDoc(doc(db, "jweets", jweet.id), {
				rejweet: cp_jweet,
			});
		} else {
			setRejweet(true);
			const cp = [...currentUser.rejweet];
			cp.push(jweet.id);
			await updateDoc(doc(db, "users", currentUser.uid), {
				rejweet: cp,
			});
			dispatch(
				setCurrentUser({
					...currentUser,
					rejweet: cp,
				})
			);

			const cp_jweet = [...jweet.rejweet];
			cp_jweet.push(currentUser.uid);
			await updateDoc(doc(db, "jweets", jweet.id), {
				rejweet: cp_jweet,
			});
		}
	};
	return (
		<>
			<div
				id="except"
				class={
					"w-1/4 flex flex-row items-center transition delay-50 duration-300  hover:text-green-500 " +
					(rejweet ? "text-green-500 " : "text-gray-400 ") +
					(isDetail ? "justify-center " : "")
				}
			>
				<div
					onClick={toggleRejweet}
					ref={reJweetRef}
					id="except"
					class={
						"cursor-pointer rounded-full transition delay-50 duration-300 hover:bg-green-100 p-2 " +
						(isDetail ? "" : "mt-1 mr-1")
					}
				>
					<AiOutlineRetweet size={isDetail ? 25 : 16} />
				</div>
				{!isDetail && (
					<p id="except" class="text-sm flex flex-row items-center">
						{jweet.rejweet ? jweet.rejweet.length : 0}
					</p>
				)}
			</div>
			<Snackbar
				open={rejweetSnack}
				autoHideDuration={2000}
				onClose={rejweetClose}
			>
				<Alert
					onClose={rejweetClose}
					severity="success"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{rejweet ? "리즈윗!" : "리즈윗 취소!"}
				</Alert>
			</Snackbar>
		</>
	);
};

export default RejweetButton;
