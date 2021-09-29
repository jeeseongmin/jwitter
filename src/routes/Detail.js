import LoadingBox from "components/box/LoadingBox";
import DetailJweetBox from "components/box/DetailJweetBox";
import ReplyBox from "components/box/ReplyBox";
import CreateReplyBox from "components/box/CreateReplyBox";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState, useCallback } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const Detail = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [jweet, setJweet] = useState([]);
	const [replies, setReplies] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);
	useEffect(() => {
		return () => setLoading(false);
	}, []);
	const getJweet = useCallback(async () => {
		onSnapshot(doc(db, "jweets", uid), (doc) => {
			setJweet({
				id: doc.id,
				...doc.data(),
			});
			setLoading(true);
		});
	}, [uid]);

	const getReplies = useCallback(async () => {
		onSnapshot(
			query(
				collection(db, "replies"),
				where("parent", "==", uid),
				orderBy("createdAt", "desc")
			),
			(snapshot) => {
				const nweetArray = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setReplies(nweetArray);
				setLoading(true);
			}
		);
	}, [uid]);

	useEffect(() => {
		getJweet();
		getReplies();
	}, [getJweet, getReplies]);

	return (
		<>
			{loading ? (
				<>
					<div class="flex-1 flex flex-col pl-64">
						<div class="w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
							<div
								onClick={() => history.goBack()}
								class="mr-4 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition delay-50 duration-300"
							>
								<IoArrowBackOutline size={24} />
							</div>
							<div class="flex flex-col">
								<div class="font-bold text-xl">Jweet & Replies</div>
							</div>
						</div>
						<div>
							<DetailJweetBox
								jweet={jweet}
								id={jweet.id}
								isOwner={jweet.creatorId === currentUser.uid}
							/>
						</div>

						<div class="w-full">
							<CreateReplyBox id={jweet.id} />
						</div>
						<div class="w-full">
							{replies.map((element, index) => {
								return (
									<ReplyBox key={element.id} reply={element} id={element.id} />
								);
							})}
						</div>
					</div>
				</>
			) : (
				<LoadingBox />
			)}
		</>
	);
};

export default Detail;
