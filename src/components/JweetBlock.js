import MuiAlert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
import Skeleton from "@mui/material/Skeleton";
import Snackbar from "@mui/material/Snackbar";
import EditJweet from "components/EditJweet";
import ImageModal from "components/ImageModal";
import ReplyFactory from "components/ReplyFactory";
import {
	deleteDoc,
	doc,
	onSnapshot,
	updateDoc,
	addDoc,
	collection,
	getDoc,
} from "firebase/firestore";
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
import { FaRetweet } from "react-icons/fa";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const JweetBlock = (props) => {
	const jweet = props.jweet;
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

	// jweet 모달
	const [jweetOpen, setJweetOpen] = useState(false);
	const handleJweetOpen = () => setJweetOpen(true);
	const handleJweetClose = () => {
		setJweetOpen(false);
	};

	// jweet 모달
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
		setLike(jweet.like.includes(currentUser.uid));
		setBookmark(currentUser.bookmark.includes(jweet.id));
		setRejweet(jweet.rejweet.includes(currentUser.uid));

		onSnapshot(doc(db, "users", jweet.creatorId), (doc) => {
			setCreatorInfo(doc.data());
			setLoading(true);
		});
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

	const [photoOpen, setPhotoOpen] = useState(false);
	const handlePhotoOpen = () => setPhotoOpen(true);
	const handlePhotoClose = () => {
		setPhotoOpen(false);
	};

	const exceptRef = useRef();
	const modalRef = useRef();
	const dotRef = useRef();
	const profileRef = useRef();
	const replyRef = useRef();
	const reJweetRef = useRef();
	const likeRef = useRef();
	const bookmarkRef = useRef();

	const goJweet = (e) => {
		if (
			e.target !== exceptRef.current &&
			e.target !== profileRef.current &&
			e.target !== replyRef.current &&
			e.target !== reJweetRef.current &&
			e.target !== likeRef.current &&
			e.target !== bookmarkRef.current &&
			e.target.tagName !== "svg" &&
			e.target.tagName !== "path" &&
			e.target.id !== "except" &&
			e.target.innerText !== "Edit Jweet" &&
			e.target.innerText !== "Delete Jweet" &&
			!photoOpen &&
			!jweetOpen &&
			!replyOpen &&
			!checkOpen
		) {
			history.push("/jweet/" + jweet.id);
			window.scrollTo(0, 0);
		}
	};

	return (
		<div class="w-full select-none z-30 cursor-pointer hover:bg-gray-100 transition delay-50 duration-300 flex flex-col px-2 pt-2 pb-4  border-b border-gray-200">
			{jweet.rejweet && jweet.rejweet.includes(currentUser.uid) && (
				<div
					class={
						"pl-10 text-xs text-gray-500 font-bold w-full flex flex-row items-center " +
						(props.type !== "explore" ? "" : "mb-2")
					}
				>
					<div class="mt-1 mr-3">
						<FaRetweet size={16} />
					</div>
					<p class="m-0 p-0">{currentUser.displayName} ReJweeted</p>
				</div>
			)}
			<div onClick={goJweet} class="w-full flex flex-row ">
				<>
					<div class="flex flex-col">
						{loading ? (
							<div
								class={
									"h-16 w-16 pb-2 pl-2 pr-2 " +
									(props.type !== "explore" ? "pt-4 " : "")
								}
							>
								<Avatar
									src={creatorInfo.photoURL}
									sx={{ width: 48, height: 48 }}
								/>

								{/* <img
									
									class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
									alt="img"
								/> */}
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
							<div class="w-full flex flex-row mr-2 justify-between items-center">
								<div class="flex flex-row">
									<h1 class="text-base font-bold mr-4">
										{creatorInfo.displayName}
									</h1>
									<p class="text-gray-500">
										@{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
									</p>
								</div>
								{props.type !== "explore" ? (
									<div
										ref={funcRef}
										id="except"
										class={
											"cursor-pointer transition delay-50 duration-300 rounded-full p-2 relative " +
											(jweet.creatorId === currentUser.uid
												? "hover:bg-purple-100"
												: "")
										}
									>
										<HiOutlineDotsHorizontal
											id="except"
											onClick={toggleFunc}
											size={28}
										/>
										{func && (
											<div
												ref={dotRef}
												id="except"
												class="bg-white border border-gray-200 z-40 absolute flex flex-col top-2 right-2 w-60 rounded-md shadow-xl"
											>
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
								) : (
									""
								)}
							</div>
						) : (
							<Skeleton width="100%">
								<div class="h-8"></div>
							</Skeleton>
						)}
						{/* <div class="w-full h-auto ">{jweet.text}</div> */}
						{loading ? (
							<>
								<div class="break-all w-full h-auto">
									<p class="w-full h-auto resize-none outline-none cursor-pointer bg-transparent whitespace-pre-wrap break-words">
										{jweet.text}
									</p>
								</div>
								{jweet.attachmentUrl !== "" && (
									<div class="w-full mt-4 mb-2 pr-4 ">
										<img
											onClick={handlePhotoOpen}
											ref={exceptRef}
											src={jweet.attachmentUrl}
											class="max-h-80 w-full object-cover rounded-xl border border-gray-200 shadow-lg"
											alt="attachment"
										/>
									</div>
								)}
							</>
						) : (
							<Skeleton width="100%">
								<div class="w-full h-24  resize-none outline-none cursor-pointer bg-transparent whitespace-pre	"></div>
							</Skeleton>
						)}

						{loading && props.type !== "explore" ? (
							<div id="except" class="w-full flex flex-row items-center mt-4 ">
								<div
									id="except"
									class="w-1/4 flex flex-row items-center transition delay-50 duration-300 text-gray-400 hover:text-purple-500"
								>
									<div
										onClick={handleReplyOpen}
										ref={replyRef}
										id="except"
										class="rounded-full transition delay-50 duration-300 hover:bg-purple-100 mt-1 mr-1 p-2"
									>
										<BsChat size={16} />
									</div>
									<p id="except" class="text-sm flex flex-row items-center">
										{jweet.reply.length}
									</p>
								</div>
								<div
									id="except"
									class={
										"w-1/4 flex flex-row items-center transition delay-50 duration-300  hover:text-green-500 " +
										(rejweet ? "text-green-500" : "text-gray-400")
									}
								>
									<div
										onClick={toggleRejweet}
										ref={reJweetRef}
										id="except"
										class="rounded-full transition delay-50 duration-300 hover:bg-green-100 mt-1 mr-1 p-2"
									>
										<AiOutlineRetweet size={16} />
									</div>
									<p id="except" class="text-sm flex flex-row items-center">
										{jweet.rejweet ? jweet.rejweet.length : 0}
									</p>
								</div>
								<div
									id="except"
									class={
										"w-1/4 flex flex-row items-center transition delay-50 duration-300 hover:text-red-500 " +
										(like ? "text-red-500" : "text-gray-400")
									}
								>
									<div
										id="except"
										onClick={toggleLike}
										ref={likeRef}
										class={
											"rounded-full transition delay-50 duration-300 hover:bg-red-100 mt-1 mr-1 p-2 "
										}
									>
										{like ? (
											<AiTwotoneHeart size={16} />
										) : (
											<AiOutlineHeart size={16} />
										)}
									</div>
									<p id="except" class="text-sm flex flex-row items-center">
										{jweet.like.length}
									</p>
								</div>
								<div
									id="except"
									class="w-1/4 flex flex-row items-center transition delay-50 duration-300 text-gray-400 hover:text-blue-500"
								>
									<div
										onClick={toggleBookmark}
										ref={bookmarkRef}
										id="except"
										class="rounded-full transition delay-50 duration-300 hover:bg-blue-100 mt-1 mr-1 p-2"
									>
										{bookmark ? (
											<MdBookmark size={16} class="text-blue-500" />
										) : (
											<MdBookmarkBorder size={16} />
										)}
									</div>
								</div>
							</div>
						) : props.type !== "explore" ? (
							<Skeleton width="100%">
								<div class="w-full h-12  resize-none outline-none cursor-pointer bg-transparent whitespace-pre	"></div>
							</Skeleton>
						) : (
							""
						)}
					</div>
					<Modal
						open={replyOpen}
						ref={modalRef}
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
								<ReplyFactory
									id={jweet.id}
									isModal={true}
									handleReplyClose={handleReplyClose}
								/>
							</div>
						</div>
					</Modal>
					<Modal
						open={jweetOpen}
						ref={modalRef}
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
							color="info"
							variant="filled"
							sx={{ width: "100%" }}
						>
							{bookmark ? "북마크 저장" : "북마크 취소"}
						</Alert>
					</Snackbar>
					<Snackbar
						open={likeSnack}
						autoHideDuration={2000}
						onClose={likeClose}
					>
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
						modalRef={modalRef}
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

export default JweetBlock;
