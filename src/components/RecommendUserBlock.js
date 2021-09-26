import React, { useEffect, useState, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useDispatch, useSelector } from "react-redux";
import MuiAlert from "@mui/material/Alert";
import Modal from "@mui/material/Modal";
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
import { auth, db } from "mybase";
import { FiSettings } from "react-icons/fi";
import { CgArrowsExchangeAlt } from "react-icons/cg";
import RecommendJweet from "components/RecommendJweet";
import { useHistory } from "react-router-dom";
import RecommendUser from "components/RecommendUser";
import { RiRefreshLine } from "react-icons/ri";

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RecommendUserBlock = () => {
	const history = useHistory();
	const settingRef = useRef();
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(5);
	// reply 모달
	const [modalOpen, setModalOpen] = useState(false);
	const [users, setUsers] = useState([]);
	const [randomIndex, setRandomIndex] = useState([]);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => {
		setModalOpen(false);
	};
	const [likeList, setLikeList] = useState([]);
	const [randomList, setRandomList] = useState([]);
	const [type, setType] = useState("");
	const [refresh, setRefresh] = useState(false);
	const toggleRefresh = () => setRefresh(!refresh);

	const showMore = () => {
		history.push("/explore/users");
		// if (show === 5) setShow(10);
		// else if (show === 10) {
		// 	window.scrollTo(0, 0);

		// 	if (type === "like") history.push("/popular");
		// 	// else if(type === "user") history.push("/profile/jweet/"+)
		// 	else history.push("/explore");
		// 	setShow(5);
		// }
	};

	useEffect(() => {
		onSnapshot(query(collection(db, "users")), (snapshot) => {
			const _user = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			shuffle(_user);
			setUsers(_user);
			setLoading(true);
		});
	}, [type, refresh]);

	function shuffle(array) {
		for (let index = array.length - 1; index > 0; index--) {
			// 무작위 index 값을 만든다. (0 이상의 배열 길이 값)
			const randomPosition = Math.floor(Math.random() * (index + 1));
			// 임시로 원본 값을 저장하고, randomPosition을 사용해 배열 요소를 섞는다.
			const temporary = array[index];
			array[index] = array[randomPosition];
			array[randomPosition] = temporary;
		}
	}

	return (
		<>
			<div class="select-none py-3 border border-gray-100 bg-gray-100 w-full h-auto mt-2 rounded-xl">
				<div class="px-4 flex flex-row justify-between items-center">
					<p class="text-lg mb-2">
						<b>You might like</b>
					</p>
					<div
						onClick={toggleRefresh}
						class="relative hover:bg-gray-300 rounded-full cursor-pointer p-2 mb-2"
					>
						<RiRefreshLine size={16} />
					</div>
				</div>
				{loading ? (
					<>
						<div class="flex-col">
							{users.map((user, index) => {
								if (index < show) {
									return <RecommendUser key={user.id} user={user} />;
								}
							})}
						</div>
						<div class="w-full my-2">
							<p
								onClick={showMore}
								class="px-4 text-sm font-bold cursor-pointer text-blue-500"
							>
								show more...
							</p>
						</div>
					</>
				) : (
					<div class="h-full py-4 flex-1 flex flex-row justify-center items-center">
						<CircularProgress />
					</div>
				)}
			</div>
		</>
	);
};

export default RecommendUserBlock;
