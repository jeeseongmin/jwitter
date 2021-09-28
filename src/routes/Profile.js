import UpdateProfileModal from "components/modal/UpdateProfileModal";
import LikeJweets from "components/container/LikeJweets";
import MyJweets from "components/container/MyJweets";
import ReJweets from "components/container/ReJweets";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import bgimg from "image/bgimg.jpg";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import LoadingBox from "components/box/LoadingBox";

const Profile = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [info, setInfo] = useState({});
	const [myJweets, setMyJweets] = useState([]);
	const [updateState, setUpdateState] = useState(false);
	const toggleUpdateState = () => setUpdateState(!updateState);
	const currentUser = useSelector((state) => state.user.currentUser);

	const [updateModal, setUpdateModal] = useState(false);
	const updateModalOpen = () => setUpdateModal(true);
	const updateModalClose = () => {
		setUpdateModal(false);
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
		getMyInfo();
		getJweets();
	}, [uid, updateState]);

	return (
		<>
			{loading ? (
				<>
					<div class="flex-1 flex flex-col pl-64">
						<div class="h-16 w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
							<div
								onClick={() => history.goBack()}
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
									src={info.bgURL ? info.bgURL : bgimg}
									alt="bgimg"
									class="w-full h-full object-cover"
								/>
							</div>
							{uid === currentUser.uid ? (
								<div class="h-16 w-full flex flex-row-reverse items-center pr-4">
									<div
										onClick={updateModalOpen}
										class="cursor-pointer font-bold text-base border transition delay-50 duration-300 border-gray-300 text-gray-600 rounded-full flex justify-center items-center px-4 py-2 hover:bg-gray-200"
									>
										Update Profile
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
						<div class="w-full flex flex-col pl-4 pr-4 mb-4">
							<h1 class="font-bold text-xl">{info.displayName}</h1>
							<p class="text-gray-400 mb-2">@{info.email.split("@")[0]}</p>
							<p class="py-8 px-2 text-sm text-gray-800 border-t border-b border-gray-200">
								{info.description === ""
									? "소개글이 없습니다."
									: info.description}
							</p>
						</div>
						<div class="w-full flex flex-row ">
							<Link
								to={"/profile/jweet/" + uid}
								class="w-1/3 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(window.location.href.includes("/jweet")
											? "border-b-4 border-purple-500"
											: "")
									}
								>
									Jweets
								</span>
							</Link>
							<Link
								to={"/profile/like/" + uid}
								class="w-1/3 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(window.location.href.includes("/like")
											? "border-b-4 border-purple-500"
											: "")
									}
								>
									Likes
								</span>
							</Link>
							<Link
								to={"/profile/rejweet/" + uid}
								class="w-1/3 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(window.location.href.includes("/rejweet")
											? "border-b-4 border-purple-500"
											: "")
									}
								>
									Rejweets
								</span>
							</Link>
						</div>
						<Switch>
							<Route path="/profile/jweet/:id" component={MyJweets} />
							<Route path="/profile/like/:id" component={LikeJweets} />
							<Route path="/profile/rejweet/:id" component={ReJweets} />
						</Switch>
					</div>
				</>
			) : (
				<LoadingBox />
			)}
			<UpdateProfileModal
				updateModal={updateModal}
				updateModalOpen={updateModalOpen}
				updateModalClose={updateModalClose}
				toggleUpdateState={toggleUpdateState}
			/>
		</>
	);
};

export default Profile;
