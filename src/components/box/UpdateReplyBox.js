import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Picker from "emoji-picker-react";
import { doc, updateDoc } from "firebase/firestore";
import defaultImg from "image/defaultImg.jpg";
import { db } from "mybase";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GrEmoji } from "react-icons/gr";
import { IoImageOutline } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { useSelector } from "react-redux";

const UpdateReply = ({ _reply, handleReplyClose }) => {
	const currentUser = useSelector((state) => state.user.currentUser);
	const Alert = React.forwardRef(function Alert(props, ref) {
		return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
	});
	const [reply, setReply] = useState(_reply.text);
	const [attachment, setAttachment] = useState(_reply.attachmentUrl);
	const textareaRef = useRef();
	const fileRef = useRef();
	const emojiRef = useRef();
	const [emojiClick, setEmojiClick] = useState(false);
	const toggleEmoji = () => setEmojiClick(!emojiClick);

	const onEmojiClick = (event, emojiObject) => {
		const newText =
			reply.slice(0, textareaRef.current.selectionStart) +
			emojiObject.emoji +
			reply.slice(textareaRef.current.selectionEnd, reply.length);
		setReply(newText);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		handleReplyClose();
		await updateDoc(doc(db, "replies", _reply.id), {
			text: reply,
			attachmentUrl: attachment === null ? "" : attachment,
		});
	};
	const onChange = (e) => {
		setReply(e.target.value);
	};

	const onFileChange = (e) => {
		const theFile = e.target.files[0];
		const reader = new FileReader();
		reader.onloadend = (finishedEvent) => {
			setAttachment(finishedEvent.currentTarget.result);
		};
		reader.readAsDataURL(theFile);
	};
	const clearAttachment = () => {
		setAttachment(null);
	};

	useEffect(() => {
		if (textareaRef === null || textareaRef.current === null) {
			return;
		}
		textareaRef.current.style.height = "40px";
		textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
	}, []);

	useEffect(() => {
		if (!emojiClick) return;
		function handleClick(e) {
			if (emojiRef.current === null) {
				return;
			} else if (!emojiRef.current.contains(e.target)) {
				setEmojiClick(false);
			}
		}
		window.addEventListener("click", handleClick);

		return () => window.removeEventListener("click", handleClick);
	}, [emojiClick]);

	const handleResizeHeight = useCallback(() => {
		if (textareaRef === null || textareaRef.current === null) {
			return;
		}
		textareaRef.current.style.height = "40px";
		textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
	});

	const [editSnack, setEditSnack] = useState();
	const editClick = () => setEditSnack(true);
	const editClose = (e, reason) => {
		if (reason === "clickaway") {
			return;
		}

		setEditSnack(false);
	};

	return (
		<>
			<div class="flex flex-row px-2 pt-2 border-b border-gray-200">
				<div class="flex flex-col">
					<div class="h-16 w-16 p-2">
						<img
							src={currentUser.photoURL ? currentUser.photoURL : defaultImg}
							class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
							alt="img"
						/>
					</div>
				</div>
				<form onSubmit={onSubmit} class="w-full flex flex-col pl-2 pb-2">
					<div class="w-full border-b border-gray-200 mb-2">
						<textarea
							type="text"
							value={reply}
							ref={textareaRef}
							onChange={onChange}
							placeholder="What's happening?"
							onInput={handleResizeHeight}
							class="w-full py-3 resize-none h-10 overflow-hidden scroll leading-7 outline-none text-lg text-purple-300 focus:text-purple-500"
						/>
						{attachment && (
							<div class="w-full h-96 relative">
								<img
									src={attachment}
									class="w-full h-full object-cover"
									alt="preview"
								/>
								<div
									class="absolute left-0 top-0 w-auto h-auto opacity-70 cursor-pointer"
									onClick={clearAttachment}
								>
									<MdCancel size={28} alt="remove" />
								</div>
							</div>
						)}
					</div>
					<div class="flex flex-row justify-between items-center pr-2">
						{/* 좌측 아이콘 */}
						<div class="flex flex-row items-center text-purple-300 relative">
							<div
								onClick={() => fileRef.current.click()}
								class="p-2 transition delay-50 duration-300 hover:bg-purple-100 rounded-full blur-md cursor-pointer"
							>
								<IoImageOutline size={20} />
							</div>
							<div
								onClick={toggleEmoji}
								class="p-2 transition delay-50 duration-300 hover:bg-purple-100 rounded-full blur-md cursor-pointer"
							>
								<GrEmoji size={20} />
							</div>
							{emojiClick && (
								<div ref={emojiRef} class="absolute top-10">
									<Picker onEmojiClick={onEmojiClick} />
								</div>
							)}
						</div>
						{/* 우측 submit */}
						<div>
							<input
								type="submit"
								class="text-sm w-full rounded-full text-white font-bold bg-purple-400 flex justify-center px-4 py-2 hover:bg-purple-600 transition delay-50 duration-300 cursor-pointer"
								value="Reply"
							/>
						</div>
					</div>
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						class="hidden"
						onChange={onFileChange}
					/>
				</form>
			</div>
			<Snackbar open={editSnack} autoHideDuration={2000} onClose={editClose}>
				<Alert
					onClose={editClose}
					severity="success"
					color="error"
					variant="filled"
					sx={{ width: "100%" }}
				>
					{editSnack ? "좋아요!" : "좋아요 취소!"}
				</Alert>
			</Snackbar>
		</>
	);
};

export default UpdateReply;
