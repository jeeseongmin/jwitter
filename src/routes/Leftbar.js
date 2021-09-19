import React, { useState, useEffect, useRef } from "react";
import logo from "image/logo.png";
import defaultImg from "image/defaultImg.jpg";
import { Link, useHistory } from "react-router-dom";
import { AiFillHome, AiOutlineHome } from "react-icons/ai";
import { IoNotificationsOutline, IoNotificationsSharp } from "react-icons/io5";
import { updateProfile } from "firebase/auth";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { BsPerson, BsPersonFill } from "react-icons/bs";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { BiCheck } from "react-icons/bi";
import { auth, db } from "mybase";
import Modal from "@mui/material/Modal";

const Leftbar = ({ userObj }) => {
	const history = useHistory();
	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const [profile, setProfile] = useState(false);
	const toggleProfile = () => setProfile(!profile);
	const profileRef = useRef();

	useEffect(() => {
		if (!profile) return;
		function handleClick(e) {
			if (profileRef.current === null) {
				return;
			} else if (!profileRef.current.contains(e.target)) {
				setProfile(false);
			}
		}
		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [profile]);

	useEffect(() => {}, []);

	const onLogOutClick = () => {
		auth.signOut();
		history.push("/");
	};
	return (
		<>
			<div class="w-64 pt-4 pr-8 h-full flex flex-col border-r border-gray-200 justify-between">
				<div class="flex flex-col">
					<div class="h-16 mb-4">
						<img
							src={logo}
							class="h-full px-4 py-3 object-cover hover:bg-purple-200 rounded-full cursor-pointer transition delay-50 duration-300 "
							alt="logo"
						/>
					</div>
					<div class="flex flex-col w-full ">
						{/* 기본 트윗 홈 */}
						<div class="w-auto flex flex-row items-center">
							<Link
								to="/home"
								class="pl-3 pr-5 py-3 rounded-full flex flex-row text-xl mb-2 hover:bg-gray-200 transition delay-50 duration-300"
							>
								<AiOutlineHome size={32} class="mr-4" /> Home
							</Link>
						</div>
						<div class="w-auto flex flex-row items-center">
							<Link
								to="/notification"
								class="pl-3 pr-5 py-3 rounded-full flex flex-row text-xl mb-2 hover:bg-gray-200 transition delay-50 duration-300"
							>
								<IoNotificationsOutline size={32} class="mr-4" />
								Notifications
							</Link>
						</div>
						<div class="w-auto flex flex-row items-center">
							<Link
								to="/bookmark"
								class="pl-3 pr-5 py-3 rounded-full flex flex-row text-xl mb-2 hover:bg-gray-200 transition delay-50 duration-300"
							>
								<MdBookmarkBorder size={32} class="mr-4" /> Bookmarks
							</Link>
						</div>
						<div class="w-auto flex flex-row items-center">
							<Link
								to="/profile"
								class="pl-3 pr-5 py-3 rounded-full flex flex-row text-xl mb-4 hover:bg-gray-200 transition delay-50 duration-300"
							>
								<BsPerson size={32} class="mr-4" /> Profile
							</Link>
						</div>
						<div class="w-full rounded-full text-white font-bold bg-purple-400 flex justify-center py-3 hover:bg-purple-600 transition delay-50 duration-300 cursor-pointer">
							Jweet
						</div>
					</div>
				</div>
				<div ref={profileRef}>
					{
						<div
							class={
								"w-full relative transition delay-200 duration-300 " +
								(profile ? "block" : "hidden")
							}
						>
							<div class="absolute w-64 py-2 -right-4 bottom-2 border border-gray-300 shadow-lg rounded-3xl">
								<div class="border-b px-4 border-gray-300 h-16 w-full py-3 flex flex-row justify-between items-center">
									<div class="h-full flex flex-row items-center ">
										<div class="h-full ">
											<img
												src={userObj.photoURL ? userObj.photoURL : defaultImg}
												class="rounded-full object-cover h-full mr-4"
												alt="default"
											/>
										</div>
										<div class="font-bold">{userObj.displayName}</div>
									</div>
									<div>
										<BiCheck class="text-purple-500" size={20} />
									</div>
								</div>
								<div
									onClick={handleOpen}
									class="cursor-pointer px-4 py-4 hover:bg-gray-100 transition delay-50 duration-300"
								>
									Log out @{userObj.displayName}
								</div>
							</div>
						</div>
					}
					<div
						onClick={toggleProfile}
						class="h-16 w-full px-3 py-3 rounded-full hover:bg-gray-200 transition delay-50 duration-300 flex flex-row justify-between items-center mb-4 cursor-pointer relative"
					>
						<div class="h-full flex flex-row items-center">
							<div class="h-full ">
								<img
									src={userObj.photoURL ? userObj.photoURL : defaultImg}
									class="rounded-full object-cover h-full mr-4"
									alt="default"
								/>
							</div>
							<div class="font-bold">{userObj.displayName}</div>
						</div>
						<div>
							<HiOutlineDotsHorizontal size={20} />
						</div>
					</div>
				</div>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<div class="outline-none absolute border border-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto p-8 bg-white rounded-2xl flex flex-col justify-start items-start">
					<div class="w-full h-12 flex justify-center items-center mb-4">
						<img src={logo} class="h-full object-cover" alt="logo" />
					</div>
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
						onClick={handleClose}
						class="cursor-pointer w-full flex py-3 justify-center items-center rounded-full border border-purple-300 text-purple-500 font-bold"
					>
						Cancel
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Leftbar;
