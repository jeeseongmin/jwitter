import CircularProgress from "@material-ui/core/CircularProgress";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
import Snackbar from "@mui/material/Snackbar";
import EditReply from "components/EditReply";
import ImageModal from "components/ImageModal";
import {
	deleteDoc,
	doc,
	getDoc,
	onSnapshot,
	updateDoc,
} from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import {
	AiOutlineHeart,
	AiTwotoneDelete,
	AiTwotoneHeart,
} from "react-icons/ai";
import { GrClose } from "react-icons/gr";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiEdit2Line } from "react-icons/ri";
import Avatar from "@mui/material/Avatar";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import Skeleton from "@mui/material/Skeleton";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const ReplyBlock = (props) => {
	const reply = props.reply;
	const history = useHistory();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const funcRef = useRef();
	const [func, setFunc] = useState(false);
	const [like, setLike] = useState(false);
	const [bookmark, setBookmark] = useState(false);

	const [creatorInfo, setCreatorInfo] = useState({});
	const toggleFunc = () => setFunc(!func);

	// reply 모달
	const [replyOpen, setReplyOpen] = useState(false);
	const handleReplyOpen = () => setReplyOpen(true);
	const handleReplyClose = () => {
		setReplyOpen(false);
	};

	const [checkOpen, setCheckOpen] = useState(false);
	const handleCheckOpen = () => setCheckOpen(true);
	const handleCheckClose = () => {
		setCheckOpen(false);
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
		await onSnapshot(doc(db, "jweets", reply.parent), async (docu) => {
			const cp = docu.data().reply;
			cp.splice(docu.data().reply.indexOf(reply.id), 1);
			await updateDoc(doc(db, "jweets", reply.parent), {
				reply: cp,
			});
		});
		await deleteDoc(doc(db, "replies", reply.id));
		if (reply.attachmentUrl !== "")
			await deleteObject(ref(storage, reply.attachmentUrl));
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
		setLike(reply.like.includes(currentUser.uid));
		const docRef = doc(db, "users", reply.creatorId);
		getDoc(docRef).then((snap) => {
			if (snap.exists()) {
				setCreatorInfo(snap.data());
				setLoading(true);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
	}, []);

	const toggleLike = async () => {
		likeClick();
		if (reply.like.includes(currentUser.uid)) {
			setLike(false);
			const cp = [...reply.like];
			cp.splice(reply.like.indexOf(currentUser.uid), 1);
			await updateDoc(doc(db, "replies", reply.id), {
				like: cp,
			});
		} else {
			setLike(true);
			const cp = [...reply.like];
			cp.push(currentUser.uid);
			await updateDoc(doc(db, "replies", reply.id), {
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
		<div class="w-full select-none z-30 cursor-pointer hover:bg-gray-100 transition delay-50 duration-300 flex flex-row px-2 pt-2 pb-4 border-r border-l border-b border-gray-200">
			<>
				<div class="flex flex-col">
					{loading ? (
						<Link
							to={"/profile/reply/" + reply.creatorId}
							class="h-16 w-16 p-2"
						>
							<Avatar
								src={creatorInfo.photoURL}
								sx={{ width: 48, height: 48 }}
							/>

							{/* <img
									
									class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
									alt="img"
								/> */}
						</Link>
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
						<div class="w-full flex flex-row mr-2 justify-between items-center">
							<div class="flex flex-row">
								<h1 class="text-base font-bold mr-4">
									{creatorInfo.displayName}
								</h1>
								<p class="text-gray-500">
									@{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
								</p>
							</div>
							{
								<div
									ref={funcRef}
									id="except"
									class={
										"cursor-pointer transition delay-50 duration-300 rounded-full p-2 relative " +
										(reply.creatorId === currentUser.uid
											? "hover:bg-purple-100"
											: "")
									}
								>
									<HiOutlineDotsHorizontal
										id="except"
										onClick={
											reply.creatorId === currentUser.uid ? toggleFunc : ""
										}
										size={28}
									/>
									{func && (
										<div
											id="except"
											class="bg-white border border-gray-200 z-40 absolute flex flex-col top-2 right-2 w-60 rounded-md shadow-xl"
										>
											<div
												onClick={handleReplyOpen}
												class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-t-md"
											>
												<RiEdit2Line class="w-12" size={20} />
												<div class="flex-1">Edit Reply</div>
											</div>
											<div
												onClick={handleCheckOpen}
												class="flex flex-row items-center transition delay-50 duration-300 py-3 hover:bg-gray-100 rounded-b-md"
											>
												<AiTwotoneDelete class="w-12" size={20} />
												<div class="flex-1">Delete Reply</div>
											</div>
										</div>
									)}
								</div>
							}
						</div>
					) : (
						<Skeleton width="100%">
							<div class="h-8"></div>
						</Skeleton>
					)}
					{/* <div class="w-full h-auto ">{reply.text}</div> */}
					{loading ? (
						<div class="w-full h-auto">
							<div class="w-full h-auto resize-none outline-none cursor-pointer bg-transparent whitespace-pre	">
								{reply.text}
							</div>
						</div>
					) : (
						<Skeleton width="100%">
							<div class="w-full h-24  resize-none outline-none cursor-pointer bg-transparent whitespace-pre	"></div>
						</Skeleton>
					)}
					{reply.attachmentUrl !== "" && (
						<div class="w-full mt-4 mb-2 pr-4 ">
							<img
								onClick={handlePhotoOpen}
								src={reply.attachmentUrl}
								class="w-full object-cover rounded-xl border border-gray-200 shadow-lg"
								alt="attachment"
							/>
						</div>
					)}
					{loading ? (
						<div id="except" class="w-full flex flex-row items-center mt-4 ">
							<div
								onClick={toggleLike}
								id="except"
								class="w-1/2 flex flex-row items-center transition delay-50 duration-300 text-gray-400 hover:text-red-500"
							>
								<div
									id="except"
									class="rounded-full transition delay-50 duration-300 hover:bg-red-100 mt-1 mr-1 p-2"
								>
									{reply.like.includes(currentUser.uid) ? (
										<AiTwotoneHeart size={16} class="text-red-500" />
									) : (
										<AiOutlineHeart size={16} />
									)}
								</div>
								<p id="except" class="text-sm flex flex-row items-center">
									{reply.like.length}
								</p>
							</div>
						</div>
					) : (
						<Skeleton width="100%">
							<div class="w-full h-8 resize-none outline-none cursor-pointer bg-transparent whitespace-pre	"></div>
						</Skeleton>
					)}
				</div>
				<Modal
					open={replyOpen}
					onClose={handleReplyClose}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
				>
					<div class="outline-none absolute border border-white top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/4 origin-center w-1/3 h-auto pt-2 pb-3 bg-white rounded-2xl flex flex-col justify-start items-start">
						{" "}
						<div
							onClick={handleReplyClose}
							class="w-full cursor-pointer flex justify-start items-center pb-1 border-b border-gray-200"
						>
							<GrClose
								size={38}
								class="ml-2 p-2 hover:bg-gray-200 rounded-full"
							/>
						</div>
						<div class="w-full">
							<EditReply
								currentUser={currentUser}
								isModal={true}
								_reply={reply}
								handleReplyClose={handleReplyClose}
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
							<h1 class="text-xl font-bold mb-2">Delete Reply?</h1>
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
					photoURL={reply.attachmentUrl}
					photoOpen={photoOpen}
					handlePhotoOpen={handlePhotoOpen}
					handlePhotoClose={handlePhotoClose}
				/>
			</>
		</div>
	);
};

export default ReplyBlock;
