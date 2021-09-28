import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import BookmarkButton from "components/button/BookmarkButton";
import LikeButton from "components/button/LikeButton";
import RejweetButton from "components/button/RejweetButton";
import ReplyButton from "components/button/ReplyButton";
import ImageModal from "components/modal/ImageModal";
import LoadingBox from "components/box/LoadingBox";
import DeleteJweetModal from "components/modal/DeleteJweetModal";
import UpdateJweetModal from "components/modal/UpdateJweetModal";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaRetweet } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiEdit2Line } from "react-icons/ri";
// import firebase from "firebase/compat/app";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { setCurrentUser } from "reducers/user";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const DetailJweetBox = (props) => {
	const jweet = props.jweet;
	const uid = props.id;
	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const funcRef = useRef();
	const [func, setFunc] = useState(false);
	const [like, setLike] = useState(false);
	const [bookmark, setBookmark] = useState(false);
	const [rejweet, setRejweet] = useState(false);

	const [creatorInfo, setCreatorInfo] = useState({});
	const toggleFunc = () => {
		if (jweet.creatorId === currentUser.uid) setFunc(!func);
	};
	useEffect(() => {
		return () => setLoading(false);
	}, []);
	// jweet 모달
	const [updateOpen, setUpdateOpen] = useState(false);
	const handleUpdateOpen = () => setUpdateOpen(true);
	const handleUpdateClose = () => {
		setUpdateOpen(false);
	};

	const [deleteOpen, setDeleteOpen] = useState(false);
	const handleCheckOpen = () => setDeleteOpen(true);
	const handleDeleteClose = () => {
		setDeleteOpen(false);
	};
	// Snack bar
	const [bookmarkSnack, setBookmarkSnack] = useState();
	const bookmarkClick = () => setBookmarkSnack(true);
	const bookmarkClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setBookmarkSnack(false);
	};

	const [likeSnack, setLikeSnack] = useState();
	const likeClick = () => setLikeSnack(true);
	const likeClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setLikeSnack(false);
	};

	const [rejweetSnack, setRejweetSnack] = useState();
	const rejweetClick = () => setRejweetSnack(true);
	const rejweetClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setRejweetSnack(false);
	};

	const onDeleteClick = async () => {
		await deleteDoc(doc(db, "jweets", jweet.id));
		if (jweet.attachmentUrl !== "")
			await deleteObject(ref(storage, jweet.attachmentUrl));
	};

	useEffect(() => {
		if (!func) return;
		function handleClick(e) {
			if (funcRef.current === null) {
				return;
			} else if (!funcRef.current.contains(e.target)) {
				setFunc(false);
			}
		}
		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [func]);

	useEffect(() => {
		onSnapshot(doc(db, "users", jweet.creatorId), (doc) => {
			setCreatorInfo(doc.data());
			setLoading(true);
		});
	}, [uid]);

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

	const toggleRejweet = async () => {
		rejweetClick();

		if (jweet.rejweet.includes(currentUser.uid)) {
			setRejweet(false);
			// users에는 jweet.id를 제거한다.
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
			// jweets에는 user id를 제거한다.
			const cp_jweet = [...jweet.rejweet];
			cp_jweet.splice(cp_jweet.indexOf(currentUser.uid), 1);

			await updateDoc(doc(db, "jweets", jweet.id), {
				rejweet: cp_jweet,
			});
		} else {
			setRejweet(true);
			// users에는 jweet.id를 추가한다.
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

	useEffect(() => {
		setLike(jweet.like.includes(currentUser.uid));
		setBookmark(currentUser.bookmark.includes(jweet.id));
		setRejweet(jweet.rejweet ? jweet.rejweet.includes(currentUser.uid) : false);
	}, [uid]);

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

	const [photoOpen, setPhotoOpen] = useState(false);
	const handlePhotoOpen = () => setPhotoOpen(true);
	const handlePhotoClose = () => {
		setPhotoOpen(false);
	};

	return (
		<div class="w-full select-none z-30 flex flex-col px-2 pt-2 pb-4 border-r border-l border-b border-gray-200">
			{jweet.rejweet && jweet.rejweet.includes(currentUser.uid) && (
				<div class=" pl-10 text-xs text-gray-500 font-bold w-full flex flex-row items-center">
					<div class="mt-1 mr-3">
						<FaRetweet size={16} />
					</div>
					<p class="m-0 p-0">{currentUser.displayName} ReJweeted</p>
				</div>
			)}
			<div class="w-full">
				<>
					{loading ? (
						<>
							<div class="flex flex-row">
								<Link
									to={"/profile/jweet/" + jweet.creatorId}
									class="h-16 w-16 py-2 px-1"
								>
									<img
										src={creatorInfo.photoURL}
										class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
										alt="img"
									/>
								</Link>
								<div class="w-full flex flex-row mr-2 justify-between items-center">
									<div class="flex flex-col pl-2">
										<h1 class="text-base font-bold mr-4">
											{creatorInfo.displayName}
										</h1>
										<p class="text-xs text-gray-500">
											@
											{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
										</p>
									</div>
									{
										<div
											ref={funcRef}
											class={
												"cursor-pointer transition delay-50 duration-300 rounded-full p-2 relative " +
												(jweet.creatorId === currentUser.uid
													? "hover:bg-purple-100"
													: "")
											}
										>
											<HiOutlineDotsHorizontal onClick={toggleFunc} size={28} />
											{func && (
												<div class="bg-white border border-gray-200 z-40 absolute flex flex-col top-2 right-2 w-60 rounded-md shadow-xl">
													<div
														onClick={handleUpdateOpen}
														class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-t-md"
													>
														<RiEdit2Line class="w-12" size={20} />
														<div class="flex-1">Update Jweet</div>
													</div>
													<div
														onClick={handleCheckOpen}
														class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-b-md"
													>
														<AiTwotoneDelete class="w-12" size={20} />
														<div class="flex-1">Delete Jweet</div>
													</div>
												</div>
											)}
										</div>
									}
								</div>
							</div>
							<div class="w-full flex flex-col pl-2">
								{/* <div class="w-full h-auto ">{jweet.text}</div> */}
								<div class="break-all w-full h-auto">
									<p class=" w-full h-auto resize-none outline-none bg-transparent whitespace-pre-wrap break-words">
										{jweet.text}
									</p>
								</div>
								{jweet.attachmentUrl !== "" && (
									<div class="w-full mt-4 mb-2 pr-4 ">
										<img
											onClick={handlePhotoOpen}
											src={jweet.attachmentUrl}
											class="w-full object-cover cursor-pointer rounded-xl border border-gray-200 shadow-lg"
											alt="attachment"
										/>
									</div>
								)}
								<div class="w-full flex flex-row mt-2 py-2 pl-2 border-t border-b border-gray-200">
									<div class="mr-8">
										<b>{jweet.reply.length} </b>
										<span class="text-gray-500 ml-1">Replies</span>
									</div>
									<div class="mr-8">
										<b>{jweet.rejweet ? jweet.rejweet.length : 0} </b>
										<span class="text-gray-500 ml-1">Rejweets</span>
									</div>
									<div class="mr-8">
										<b>{jweet.like.length} </b>
										<span class="text-gray-500 ml-1">Likes</span>
									</div>
								</div>
								<div class="w-full flex flex-row items-center mt-4 ">
									{/* <div class="cursor-pointer w-1/4 flex flex-row justify-center items-center transition delay-50 duration-300 text-gray-400 hover:text-purple-500">
										<div class="rounded-full transition delay-50 duration-300 hover:bg-purple-100 p-2">
											<BsChat size={24} />
										</div>
									</div> */}
									<ReplyButton jweet={jweet} isDetail={true} />
									<RejweetButton jweet={jweet} isDetail={true} />
									<LikeButton jweet={jweet} isDetail={true} />
									<BookmarkButton jweet={jweet} isDetail={true} />
								</div>
							</div>
						</>
					) : (
						<LoadingBox />
					)}

					<UpdateJweetModal
						jweet={jweet}
						updateOpen={updateOpen}
						handleUpdateClose={handleUpdateClose}
					/>
					<DeleteJweetModal
						jweet={jweet}
						deleteOpen={deleteOpen}
						setDeleteOpen={setDeleteOpen}
						handleDeleteClose={handleDeleteClose}
					/>
					<Snackbar
						open={bookmarkSnack}
						autoHideDuration={2000}
						onClose={bookmarkClose}
					>
						<Alert
							onClose={bookmarkClose}
							severity="success"
							sx={{ width: "100%" }}
						>
							{bookmark ? "북마크 저장" : "북마크 취소"}
						</Alert>
					</Snackbar>
					<Snackbar
						open={rejweetSnack}
						autoHideDuration={2000}
						onClose={rejweetClose}
					>
						<Alert
							onClose={rejweetClose}
							severity="success"
							variant="filled"
							// severity="success"
							// color="error"
							// variant="filled"
							sx={{ width: "100%" }}
						>
							{like ? "리즈윗!" : "리즈윗 취소!"}
						</Alert>
					</Snackbar>
					<ImageModal
						photoURL={jweet.attachmentUrl}
						photoOpen={photoOpen}
						handlePhotoOpen={handlePhotoOpen}
						handlePhotoClose={handlePhotoClose}
					/>
				</>
			</div>
		</div>
	);
};

export default DetailJweetBox;
