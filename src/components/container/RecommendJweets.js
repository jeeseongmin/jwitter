import PopularJweets from "components/container/PopularJweets";
import RandomJweets from "components/container/RandomJweets";
import RecommendMethodModal from "components/modal/RecommendMethodModal";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
const RecommendJweets = () => {
	const history = useHistory();
	const [show, setShow] = useState(5);
	// reply 모달
	const [users, setUsers] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);
	const handleModalOpen = () => setModalOpen(true);
	const handleModalClose = () => {
		setModalOpen(false);
	};
	const [type, setType] = useState("");

	const toggleType = () => {
		setShow(5);
		if (type === "like") setType("random");
		else setType("like");
	};

	const showMore = () => {
		if (show === 5) setShow(10);
		else if (show === 10) {
			window.scrollTo(0, 0);

			if (type === "like") history.push("/popular");
			else history.push("/explore/jweets");
			setShow(5);
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
	}, [type]);

	return (
		<>
			{type === "like" ? (
				<PopularJweets
					handleModalOpen={handleModalOpen}
					show={show}
					users={users}
					showMore={showMore}
					type={type}
					setType={setType}
				/>
			) : (
				<RandomJweets
					handleModalOpen={handleModalOpen}
					show={show}
					users={users}
					showMore={showMore}
					type={type}
					setType={setType}
				/>
			)}
			<RecommendMethodModal
				modalOpen={modalOpen}
				handleModalClose={handleModalClose}
				selectType={selectType}
				type={type}
			/>
		</>
	);
};

export default RecommendJweets;
