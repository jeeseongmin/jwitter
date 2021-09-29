import MuiAlert from "@mui/material/Alert";
import LoadingBox from "components/box/LoadingBox";
import BookmarkButton from "components/button/BookmarkButton";
import LikeButton from "components/button/LikeButton";
import RejweetButton from "components/button/RejweetButton";
import ReplyButton from "components/button/ReplyButton";
import DeleteJweetModal from "components/modal/DeleteJweetModal";
import ImageModal from "components/modal/ImageModal";
import UpdateJweetModal from "components/modal/UpdateJweetModal";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
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
import UpdateButton from "components/button/UpdateButton";
import DeleteButton from "components/button/DeleteButton";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const DetailJweetBox = (props) => {
	const jweet = props.jweet;
	const uid = props.id;
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const funcRef = useRef();
	const [func, setFunc] = useState(false);

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
	const handleDeleteOpen = () => setDeleteOpen(true);
	const handleDeleteClose = () => {
		setDeleteOpen(false);
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
													<UpdateButton
														handleOpen={handleUpdateOpen}
														text={"Update Jweet"}
													/>
													<DeleteButton
														handleOpen={handleDeleteOpen}
														text={"Delete Jweet"}
													/>
												</div>
											)}
										</div>
									}
								</div>
							</div>
							<div class="w-full flex flex-col pl-2">
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
										<b>{jweet.reply ? jweet.reply.length : 0} </b>
										<span class="text-gray-500 ml-1">Replies</span>
									</div>
									<div class="mr-8">
										<b>{jweet.rejweet ? jweet.rejweet.length : 0} </b>
										<span class="text-gray-500 ml-1">Rejweets</span>
									</div>
									<div class="mr-8">
										<b>{jweet.like ? jweet.like.length : 0} </b>
										<span class="text-gray-500 ml-1">Likes</span>
									</div>
								</div>
								<div class="w-full flex flex-row items-center mt-4 ">
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
						goBack={true}
						handleDeleteClose={handleDeleteClose}
					/>
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
