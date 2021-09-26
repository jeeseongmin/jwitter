import React, { useState, useEffect, useRef } from "react";
import { auth, db } from "mybase";
import { useHistory, Switch, Route, Link } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
	getDocs,
	query,
	collection,
	where,
	doc,
	orderBy,
	limit,
	onSnapshot,
	getDoc,
} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import JweetBlock from "components/JweetBlock";
import LikeJweets from "components/LikeJweets";
import MyJweets from "components/MyJweets";
import Modal from "@mui/material/Modal";
import { GrClose } from "react-icons/gr";
import { MdCameraEnhance } from "react-icons/md";
import EditProfile from "components/EditProfile";
import bgimg from "image/bgimg.jpg";

const Profile = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [info, setInfo] = useState({});
	const [myJweets, setMyJweets] = useState([]);
	const [editState, setEditState] = useState(false);
	const toggleEditState = () => setEditState(!editState);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [selected, setSelected] = useState(1);
	const fileRef = useRef();
	const [attachment, setAttachment] = useState(currentUser.photoURL);

	const [editModal, setEditModal] = useState(false);
	const editModalOpen = () => setEditModal(true);
	const editModalClose = () => {
		setEditModal(false);
	};

	const getMyInfo = async () => {
		await onSnapshot(doc(db, "users", uid), (doc) => {
			setInfo(doc.data());
			setLoading(true);
		});
	};

	const getJweets = async () => {
		const q = query(collection(db, "jweets"), where("creatorId", "==", uid));
		onSnapshot(q, (querySnapshot) => {
			const cp = [];
			querySnapshot.forEach((doc) => {
				cp.push(doc.data());
			});
			setMyJweets(cp);
		});
	};

	useEffect(() => {
		setSelected(1);
		getMyInfo();
		getJweets();
	}, [uid, editState]);

	return (
		<>
			{loading ? (
				<>
					<div class="flex-1 flex flex-col pl-64">
						<div class="h-16 w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
							<div
								onClick={() => history.push("/home")}
								class="mr-4 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition delay-50 duration-300"
							>
								<IoArrowBackOutline size={20} />
							</div>
							<div class="flex flex-col">
								<div class="font-bold text-xl">{info.displayName}</div>
								<div>{myJweets.length} Jweets</div>
							</div>
						</div>
						<div class="w-full flex flex-col relative">
							<div class="h-48 w-full ">
								<img
									src={bgimg}
									alt="bgimg"
									class="w-full h-full object-cover"
								/>
							</div>
							{uid === currentUser.uid ? (
								<div
									onClick={editModalOpen}
									class="h-16 w-full flex flex-row-reverse items-center pr-4"
								>
									<div class="cursor-pointer font-bold text-base border transition delay-50 duration-300 border-gray-300 text-gray-600 rounded-full flex justify-center items-center px-4 py-2 hover:bg-gray-200">
										Edit Profile
									</div>
								</div>
							) : (
								<div class="h-16 w-full flex flex-row-reverse items-center pr-4">
									<div class="cursor-pointer font-bold text-base rounded-full flex justify-center items-center px-4 py-2 "></div>
								</div>
							)}
							<div class="absolute w-32 h-32 left-4 bottom-2">
								<div class="border-4 border-white rounded-full">
									<img
										src={info.photoURL}
										class="w-full h-32 object-cover rounded-full"
										alt="img"
									/>
								</div>
							</div>
						</div>
						<div class="w-full flex flex-col pl-4 mb-4">
							<h1 class="font-bold text-xl">{info.displayName}</h1>
							<p class="text-gray-400 mb-2">@{info.email.split("@")[0]}</p>
							<p class="py-8 px-4 text-sm text-gray-500 border-t border-b border-gray-200">
								{info.description === ""
									? "소개글이 없습니다."
									: info.description}
							</p>
						</div>
						<div class="w-full flex flex-row ">
							<Link
								to={"/profile/jweet/" + uid}
								class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(window.location.href.includes("jweet")
											? "border-b-4 border-purple-500"
											: "")
									}
								>
									Jweets
								</span>
							</Link>
							<Link
								to={"/profile/like/" + uid}
								class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(window.location.href.includes("like")
											? "border-b-4 border-purple-500"
											: "")
									}
								>
									Likes
								</span>
							</Link>
						</div>
						<Switch>
							<Route path="/profile/jweet/:id" component={MyJweets} />
							<Route path="/profile/like/:id" component={LikeJweets} />
						</Switch>
					</div>
				</>
			) : (
				<div class="pl-64 h-full py-4 flex-1 flex flex-row justify-center items-center">
					<CircularProgress />
				</div>
			)}
			<EditProfile
				editModal={editModal}
				editModalOpen={editModalOpen}
				editModalClose={editModalClose}
				toggleEditState={toggleEditState}
			/>
		</>
	);
};

export default Profile;
