import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import EditJweet from "components/EditJweet";
import ImageModal from "components/ImageModal";
import ReplyFactory from "components/ReplyFactory";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import {
	AiOutlineHeart,
	AiOutlineRetweet,
	AiTwotoneDelete,
	AiTwotoneHeart,
} from "react-icons/ai";
import { BsChat } from "react-icons/bs";
import { GrClose } from "react-icons/gr";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";
import { RiEdit2Line } from "react-icons/ri";
// import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setCurrentUser } from "reducers/user";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const UserBlock = (props) => {
	const user = props.user;
	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const funcRef = useRef();
	const [func, setFunc] = useState(false);
	const [like, setLike] = useState(false);
	const [bookmark, setBookmark] = useState(false);

	useEffect(() => {
		if (user) setLoading(true);
	}, []);

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
								<div class="max-w-lg md:max-w-sm xl:max-w-xl text-md">
									<p class="w-full truncate">{user.description}</p>
								</div>
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

export default UserBlock;
