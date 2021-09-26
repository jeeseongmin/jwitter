import CircularProgress from "@material-ui/core/CircularProgress";
import DetailBlock from "components/DetailBlock";
import ReplyBlock from "components/ReplyBlock";
import ReplyFactory from "components/ReplyFactory";
import {
	collection,
	doc,
	onSnapshot,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { IoArrowBackOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const JweetDetail = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [jweet, setJweet] = useState([]);
	const [replies, setReplies] = useState([]);
	const currentUser = useSelector((state) => state.user.currentUser);

	const getJweet = async () => {
		onSnapshot(doc(db, "jweets", uid), (doc) => {
			setJweet({
				id: doc.id,
				...doc.data(),
			});
			setLoading(true);
		});
	};

	const getReplies = async () => {
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
	};

	useEffect(() => {
		getJweet();
		getReplies();
	}, [uid]);

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
							<DetailBlock
								jweet={jweet}
								id={jweet.id}
								isOwner={jweet.creatorId === currentUser.uid}
							/>
						</div>

						<div class="w-full">
							<ReplyFactory id={jweet.id} />
						</div>
						<div class="w-full">
							{replies.map((element, index) => {
								return (
									<ReplyBlock
										key={element.id}
										reply={element}
										id={element.id}
									/>
								);
							})}
						</div>
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

export default JweetDetail;
