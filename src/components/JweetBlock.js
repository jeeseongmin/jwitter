import Modal from "@mui/material/Modal";
import EditJweet from "components/EditJweet";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { db, storage } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AiTwotoneDelete } from "react-icons/ai";
import { GrClose } from "react-icons/gr";
// import firebase from "firebase/compat/app";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { RiEdit2Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { BsChat } from "react-icons/bs";
import {
	AiOutlineRetweet,
	AiOutlineHeart,
	AiTwotoneHeart,
} from "react-icons/ai";
import { FcLikePlaceholder, FcLike } from "react-icons/fc";

const JweetBlock = ({ jweet, ownerID, isOwner }) => {
	const [loading, setLoading] = useState(false);
	const currentUser = useSelector((state) => state.user.currentUser);
	const funcRef = useRef();
	const [func, setFunc] = useState(false);

	const [creatorInfo, setCreatorInfo] = useState({});
	const [editing, setEditing] = useState(false);
	const [newJweet, setNewJweet] = useState(jweet.text);
	const toggleFunc = () => setFunc(!func);

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
		const docRef = doc(db, "users", jweet.creatorId);
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

	return (
		<div class="z-30 cursor-pointer hover:bg-gray-100 transition delay-50 duration-300 flex flex-row px-2 pt-2 pb-4 border-r border-l border-b border-gray-200">
			<>
				{loading ? (
					<>
						<div class="flex flex-col">
							<Link to={"/profile/" + jweet.creatorId} class="h-16 w-16 p-2">
								<img
									src={creatorInfo.photoURL}
									class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
									alt="img"
								/>
							</Link>
						</div>
						<div class="w-full flex flex-col pl-2">
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
										class={
											"cursor-pointer transition delay-50 duration-300 rounded-full p-2 relative " +
											(jweet.creatorId === currentUser.uid
												? "hover:bg-purple-100"
												: "")
										}
									>
										<HiOutlineDotsHorizontal
											onClick={
												jweet.creatorId === currentUser.uid ? toggleFunc : ""
											}
											size={28}
										/>
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
							<div class="w-full h-auto ">{jweet.text}</div>
							{jweet.attachmentUrl !== "" && (
								<div class="w-full mt-4 mb-2 pr-4 ">
									<img
										src={jweet.attachmentUrl}
										class="w-full object-cover rounded-xl border border-gray-200 shadow-lg"
										alt="attachment"
									/>
								</div>
							)}
							<div class="w-full flex flex-row items-center mt-4 ">
								<div class="w-1/4 flex flex-row items-center transition delay-50 duration-300 hover:text-purple-500">
									<div class="rounded-full transition delay-50 duration-300 hover:bg-purple-100 mt-1 mr-1 p-2">
										<BsChat size={16} />
									</div>
									<p class="text-sm flex flex-row items-center">0</p>
								</div>
								<div class="w-1/4 flex flex-row items-center transition delay-50 duration-300 hover:text-green-500">
									<div class="rounded-full transition delay-50 duration-300 hover:bg-green-100 mt-1 mr-1 p-2">
										<AiOutlineRetweet size={16} />
									</div>
									<p class="text-sm flex flex-row items-center">0</p>
								</div>
								{/* AiOutlineHeart,
	AiTwotoneHeart, */}
								<div class="w-1/4 flex flex-row items-center transition delay-50 duration-300 hover:text-red-500">
									<div class="rounded-full transition delay-50 duration-300 hover:bg-red-100 mt-1 mr-1 p-2">
										<AiOutlineHeart size={16} />
									</div>
									<p class="text-sm flex flex-row items-center">0</p>
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
						{/* <div class="flex flex-col px-4">
						<h1 class="text-xl font-bold mb-2">Log out of Jwitter?</h1>
						<p class="text-left pb-8">
							You can always log back in at any time. If you just want to switch
							accounts, you can do that by adding an existing account.{" "}
						</p>
						<div
							onClick={onLogOutClick}
							class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full bg-purple-300 text-white font-bold mb-4"
						>
							Log out
						</div>
						<div
							onClick={handleProfileClose}
							class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full border border-purple-300 text-purple-500 font-bold"
						>
							Cancel
						</div>
					</div> */}
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
			</>
		</div>
	);
};

export default JweetBlock;
