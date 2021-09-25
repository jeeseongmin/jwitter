import React, { useState, useEffect } from "react";
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
import DetailBlock from "components/DetailBlock";
import ReplyBlock from "components/ReplyBlock";

const JweetDetail = ({ match }) => {
	const uid = match.params.id;
	const [loading, setLoading] = useState(false);
	const history = useHistory();
	const [jweet, setJweet] = useState([]);
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

	useEffect(() => {
		getJweet();
	}, [uid]);

	return (
		<>
			{loading ? (
				<>
					<div class="flex-1 flex flex-col pl-64">
						<div class="w-full px-2 py-2 flex flex-row items-center border-b border-gray-200">
							<div
								onClick={() => history.push("/home")}
								class="mr-4 cursor-pointer p-2 rounded-full hover:bg-gray-200 transition delay-50 duration-300"
							>
								<IoArrowBackOutline size={24} />
							</div>
							<div class="flex flex-col">
								<div class="font-bold text-xl">Jweet</div>
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
							<ReplyBlock id={jweet.id} />
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
