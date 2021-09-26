import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import EditJweet from "components/EditJweet";
import ImageModal from "components/ImageModal";
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
import { Link, useHistory } from "react-router-dom";
import { setCurrentUser } from "reducers/user";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const DetailBlock = (props) => {
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

	const [creatorInfo, setCreatorInfo] = useState({});
	const toggleFunc = () => {
		if (jweet.creatorId === currentUser.uid) setFunc(!func);
	};

	// jweet 모달
	const [jweetOpen, setJweetOpen] = useState(false);
	const handleJweetOpen = () => setJweetOpen(true);
	const handleJweetClose = () => {
		setJweetOpen(false);
	};

	const [checkOpen, setCheckOpen] = useState(false);
	const handleCheckOpen = () => setCheckOpen(true);
	const handleCheckClose = () => {
		setCheckOpen(false);
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

	useEffect(() => {
		setLike(jweet.like.includes(currentUser.uid));
		setBookmark(currentUser.bookmark.includes(jweet.id));
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
										@{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
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
													onClick={handleJweetOpen}
													class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-t-md"
												>
													<RiEdit2Line class="w-12" size={20} />
													<div class="flex-1">Edit Jweet</div>
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
							<div class="w-full h-auto">
								<div class="w-full h-auto resize-none outline-none bg-transparent whitespace-pre">
									{jweet.text}
								</div>
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
									<b>{0} </b>
									<span class="text-gray-500 ml-1">Rejweets</span>
								</div>
								<div class="mr-8">
									<b>{jweet.reply.length} </b>
									<span class="text-gray-500 ml-1">Quote Jweets</span>
								</div>
								<div class="mr-8">
									<b>{jweet.like.length} </b>
									<span class="text-gray-500 ml-1">Likes</span>
								</div>
							</div>
							<div class="w-full flex flex-row items-center mt-4 ">
								<div class="cursor-pointer w-1/4 flex flex-row justify-center items-center transition delay-50 duration-300 text-gray-400 hover:text-purple-500">
									<div class="rounded-full transition delay-50 duration-300 hover:bg-purple-100 p-2">
										<BsChat size={24} />
									</div>
								</div>
								<div class="cursor-pointer w-1/4 flex flex-row justify-center items-center transition delay-50 duration-300 text-gray-400 hover:text-green-500">
									<div class="rounded-full transition delay-50 duration-300 hover:bg-green-100 p-2">
										<AiOutlineRetweet size={24} />
									</div>
								</div>
								{/* AiOutlineHeart,
	AiTwotoneHeart, */}
								<div
									onClick={toggleLike}
									class="cursor-pointer w-1/4 flex flex-row justify-center items-center transition delay-50 duration-300 text-gray-400 hover:text-red-500"
								>
									<div class="rounded-full transition delay-50 duration-300 hover:bg-red-100 p-2">
										{like ? (
											<AiTwotoneHeart size={24} class="text-red-500" />
										) : (
											<AiOutlineHeart size={24} />
										)}
									</div>
								</div>
								<div
									onClick={toggleBookmark}
									class="cursor-pointer w-1/4 flex flex-row justify-center items-center transition delay-50 duration-300 text-gray-400 hover:text-blue-500"
								>
									<div class="rounded-full transition delay-50 duration-300 hover:bg-blue-100 p-2">
										{bookmark ? (
											<MdBookmark size={24} class="text-blue-500" />
										) : (
											<MdBookmarkBorder size={24} />
										)}
									</div>
								</div>
							</div>
						</div>
					</>
				) : (
					<div class="py-4 w-full flex justify-center">
						<CircularProgress />
					</div>
				)}
				<Modal
					open={jweetOpen}
					onClose={handleJweetClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<div class="outline-none absolute border border-white top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 origin-center w-1/3 h-auto pt-2 pb-3 bg-white rounded-2xl flex flex-col justify-start items-start">
						{" "}
						<div
							onClick={handleJweetClose}
							class="w-full cursor-pointer flex justify-start items-center pb-1 border-b border-gray-200"
						>
							<GrClose
								size={38}
								class="ml-2 p-2 hover:bg-gray-200 rounded-full"
							/>
						</div>
						<div class="w-full">
							<EditJweet
								currentUser={currentUser}
								isModal={true}
								_jweet={jweet}
								handleJweetClose={handleJweetClose}
							/>
						</div>
					</div>
				</Modal>
				<Modal
					open={checkOpen}
					onClose={handleCheckClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto px-4 py-8 bg-white rounded-2xl flex flex-col justify-start items-start">
						<div class="flex flex-col px-4">
							<h1 class="text-xl font-bold mb-2">Delete Jweet?</h1>
							<p class="text-left pb-8">
								This can’t be undone and it will be removed from your profile,
								the timeline of any accounts that follow you, and from Jwitter
								search results.
							</p>
							<div
								onClick={onDeleteClick}
								class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full bg-red-500 hover:bg-red-600 transition delay-50 duration-300 text-white font-bold mb-4"
							>
								Delete
							</div>
							<div
								onClick={handleCheckClose}
								class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full border border-purple-300 text-purple-500 transition delay-50 duration-300 font-bold hover:bg-gray-200"
							>
								Cancel
							</div>
						</div>
					</div>
				</Modal>
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
				<ImageModal
					photoURL={jweet.attachmentUrl}
					photoOpen={photoOpen}
					handlePhotoOpen={handlePhotoOpen}
					handlePhotoClose={handlePhotoClose}
				/>
			</>
		</div>
	);
};

export default DetailBlock;
