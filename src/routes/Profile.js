import React, { useState, useEffect } from "react";
import { auth, db } from "mybase";
import { useHistory } from "react-router-dom";
import { updateProfile } from "firebase/auth";
import {
	getDocs,
	query,
	collection,
	where,
	doc,
	getDoc,
} from "firebase/firestore";
import CircularProgress from "@material-ui/core/CircularProgress";
import { IoArrowBackOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import JweetBlock from "components/JweetBlock";

const Profile = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [info, setInfo] = useState({});
	const [myJweets, setMyJweets] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	const [selected, setSelected] = useState(1);

	const getMyJweets = async () => {
		const q = query(collection(db, "jweets"), where("creatorId", "==", uid));
		const querySnapshot = await getDocs(q);
		querySnapshot.forEach((doc) => {
			const cp = myJweets;
			cp.push(doc.data());
			setMyJweets(cp);
		});
	};

	const getMyInfo = async () => {
		const docRef = doc(db, "users", uid);
		getDoc(docRef).then((snap) => {
			if (snap.exists()) {
				setInfo(snap.data());
				setLoading(true);
			} else {
				// doc.data() will be undefined in this case
				console.log("No such document!");
			}
		});
	};
	useEffect(() => {
		setMyJweets([]);
		getMyJweets();
		getMyInfo();
	}, [uid]);

	return (
		<>
			{loading ? (
				<>
					<div class="flex-1 flex flex-col pl-64">
						<div class="w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
							<div
								onClick={() => history.push("/")}
								class="mr-4 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition delay-50 duration-300"
							>
								<IoArrowBackOutline size={24} />
							</div>
							<div class="flex flex-col">
								<div class="font-bold text-xl">{info.displayName}</div>
								<div>{myJweets.length} Jweets</div>
							</div>
						</div>
						<div class="w-full flex flex-col relative">
							<div class="h-48 w-full bg-purple-100"></div>
							{uid === currentUser.uid && (
								<div class="h-16 w-full flex flex-row-reverse items-center pr-4">
									<div class="cursor-pointer font-bold text-base border transition delay-50 duration-300 border-gray-300 text-gray-600 rounded-full flex justify-center items-center px-4 py-2 hover:bg-gray-200">
										Edit Profile
									</div>
								</div>
							)}
							<div class="absolute w-36 h-36 left-4 bottom-2">
								<div class="border-4 border-white rounded-full">
									<img
										src={info.photoURL}
										class="w-full h-full object-cover rounded-full"
										alt="img"
									/>
								</div>
							</div>
						</div>
						<div class="w-full flex flex-col pl-4 mb-4">
							<h1 class="font-bold text-xl">{info.displayName}</h1>
							<p class="text-gray-400 mb-2">@{info.email.split("@")[0]}</p>
							<p class="text-sm">{info.email}</p>
						</div>
						<div class="w-full flex flex-row ">
							<div
								onClick={() => setSelected(1)}
								class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(selected === 1 ? "border-b-4 border-purple-500" : "")
									}
								>
									Jweets
								</span>
							</div>
							<div
								onClick={() => setSelected(2)}
								class="w-1/2 flex justify-center items-center cursor-pointer font-bold hover:bg-gray-200 transition delay-50 duration-300"
							>
								<span
									class={
										"py-3 " +
										(selected === 2 ? "border-b-4 border-purple-500" : "")
									}
								>
									Likes
								</span>
							</div>
						</div>
						{selected === 1 && (
							<div>
								{myJweets.length !== 0 ? (
									myJweets.map((jweet) => {
										if (jweet.creatorId === uid) {
											return (
												<JweetBlock
													key={jweet.id}
													jweet={jweet}
													isOwner={jweet.creatorId === currentUser.uid}
												/>
											);
										}
									})
								) : loading ? (
									<div class="w-full flex justify-center items-center mt-8">
										등록된 내용이 없습니다.
									</div>
								) : (
									<div class="py-4 w-full flex justify-center">
										<CircularProgress />
									</div>
								)}
							</div>
						)}
						{selected === 2 && <div></div>}
					</div>
				</>
			) : (
				<div class="pl-64 h-full py-4 flex-1 flex flex-row justify-center items-center">
					<CircularProgress />
				</div>
			)}
		</>
	);
};

export default Profile;
