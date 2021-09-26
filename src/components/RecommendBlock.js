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

const Alert = React.forwardRef(function Alert(props, ref) {
	return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RecommendBlock = () => {
	const history = useHistory();
	const settingRef = useRef();
	const [loading, setLoading] = useState(false);
	const [show, setShow] = useState(5);
	// reply 모달
	const [modalOpen, setModalOpen] = useState(false);
	const [sortedJweets, setSortedJweets] = useState([]);
	const [jweets, setJweets] = useState([]);
	const [users, setUsers] = useState([]);
	const [randomIndex, setRandomIndex] = useState([]);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => {
		setModalOpen(false);
	};
	const [likeList, setLikeList] = useState([]);
	const [randomList, setRandomList] = useState([]);
	const [type, setType] = useState("");

	const toggleType = () => {
		if (type === "like") setType("random");
		else setType("like");
	};

	const showMore = () => {
		if (show === 5) setShow(10);
		else if (show === 10) {
			window.scrollTo(0, 0);

			if (type === "like") history.push("/popular");
			else history.push("/explore");
		}
	};

	const selectType = () => {
		toggleType();
		handleModalClose();
	};

	useEffect(() => {
		onSnapshot(query(collection(db, "users")), (snapshot) => {
			const _user = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(_user);
		});
		onSnapshot(
			query(collection(db, "jweets"), orderBy("createdAt", "desc")),
			(snapshot) => {
				const _myJweet = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setJweets(_myJweet);
				setSortedJweets(_myJweet);
				getLikeList();
				getRandomList();
				if (type === "") setType("like");
				setLoading(true);
			}
		);
	}, [type]);

	const getLikeList = async () => {
		await sortedJweets.sort(function (a, b) {
			return b.like.length - a.like.length;
		});
		await setLikeList(sortedJweets);
		setLoading(true);
	};

	const getRandomList = async () => {
		setRandomIndex(Array.from({ length: jweets.length }, (v, i) => i));
		await shuffle(randomIndex);
		const _randomArray = await randomIndex.map((element, index) => {
			return jweets[element];
		});
		await setRandomList(_randomArray);
		setLoading(true);
	};

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
			<div class="py-3 border border-gray-100 bg-gray-100 w-full h-auto mt-2 rounded-xl">
				<div class="px-4 flex flex-row justify-between items-center">
					<p class="text-lg mb-2">
						{type === "like" && <b>Popular Jweets</b>}
						{type === "random" && <b>Random Jweets</b>}
					</p>
					<div
						ref={settingRef}
						onClick={handleModalOpen}
						class="relative hover:bg-gray-300 rounded-full cursor-pointer p-2 mb-2"
					>
						<FiSettings size={16} />
					</div>
				</div>
				{loading ? (
					<>
						{type === "like" ? (
							<div class="flex-col">
								{likeList.map((element, index) => {
									if (index < show) {
										return <RecommendJweet jweet={element} users={users} />;
									}
								})}
							</div>
						) : (
							<div class="flex-col">
								{randomList.map((element, index) => {
									if (index < show) {
										return <RecommendJweet jweet={element} users={users} />;
									}
								})}
							</div>
						)}
						<div class="w-full my-2">
							{show === 5 || show === 10 ? (
								<p
									onClick={showMore}
									class="px-4 text-sm font-bold cursor-pointer text-blue-500"
								>
									show more...
								</p>
							) : (
								""
							)}
						</div>
					</>
				) : (
					<div class="h-full py-4 flex-1 flex flex-row justify-center items-center">
						<CircularProgress />
					</div>
				)}
			</div>
			<Modal
				open={modalOpen}
				onClose={handleModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto py-4 bg-white rounded-2xl flex flex-col justify-start items-start">
					<div class="w-full flex flex-col">
						<h1 class="px-8 text-xl font-bold mb-2">Sorting Method</h1>
						{type === "like" && (
							<div
								onClick={selectType}
								class="px-8 cursor-pointer w-full flex flex-row items-center hover:bg-gray-100 py-2"
							>
								<div class="mr-4">
									<CgArrowsExchangeAlt size={40} />
								</div>
								<div class="flex flex-col">
									<p class="font-bold text-lg">Random Jweets</p>
									<p class="text-sm">Jweets are randomly selected</p>
								</div>
							</div>
						)}
						{type === "random" && (
							<div
								onClick={selectType}
								class="px-8 cursor-pointer w-full flex flex-row items-center hover:bg-gray-100 py-2"
							>
								<div class="mr-4">
									<CgArrowsExchangeAlt size={40} />
								</div>
								<div class="flex flex-col">
									<p class="font-bold text-lg">Like Jweets</p>
									<p class="text-sm">It's sorted based on likes</p>
								</div>
							</div>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
};

export default RecommendBlock;
