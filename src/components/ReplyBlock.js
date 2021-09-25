import React, { useEffect, useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import defaultImg from "image/defaultImg.jpg";
import { IoImageOutline } from "react-icons/io5";
import { GrEmoji } from "react-icons/gr";
import Picker from "emoji-picker-react";

const ReplyBlock = ({ id }) => {
	const [jweetText, setJweetText] = useState("");
	const [over, setOver] = useState(false);
	const [focusOn, setFocusOn] = useState(false);
	const [attachment, setAttachment] = useState("");
	const emojiRef = useRef();
	const fileRef = useRef();
	const [emojiClick, setEmojiClick] = useState(false);
	const toggleEmoji = () => setEmojiClick(!emojiClick);

	const onEmojiClick = (event, emojiObject) => {
		// setChosenEmoji(emojiObject);
		const cp = jweetText + emojiObject.emoji;
		setJweetText(cp);
	};
	const textareaRef = useRef();
	const currentUser = useSelector((state) => state.user.currentUser);
	const onChange = (e) => {
		setJweetText(e.target.value);
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

	const handleResizeHeight = useCallback(() => {
		if (textareaRef === null || textareaRef.current === null) {
			return;
		}
		if (
			textareaRef.current.style.height.substring(
				0,
				textareaRef.current.style.height.length - 2
			) *
				1 >
			window.innerHeight - 200
		) {
			setOver(true);
			if (jweetText === "") textareaRef.current.style.height = "40px";
		} else {
			setOver(false);
			textareaRef.current.style.height = "40px";
			textareaRef.current.style.height =
				textareaRef.current.scrollHeight + "px";
		}
	});
	return (
		<div
			class={
				"flex flex-row h-auto border-t border-b border-gray-200 py-2 px-2 "
			}
		>
			<div class="p-2 h-16">
				<img
					src={currentUser.photoURL ? currentUser.photoURL : defaultImg}
					class="h-full object-cover rounded-full cursor-pointer hover:opacity-60"
					alt="img"
				/>
			</div>
			<form
				class={
					"flex-1 flex items-end " +
					(focusOn ? "flex-col" : "flex-row items-center ")
				}
			>
				<textarea
					type="text"
					value={jweetText}
					ref={textareaRef}
					onChange={onChange}
					placeholder="Jweet Your reply?"
					onInput={handleResizeHeight}
					onFocus={() => setFocusOn(true)}
					class={
						"w-full py-3 pl-2 pr-4 resize-none h-10 scroll leading-7 outline-none text-xl text-purple-300 focus:text-purple-500 " +
						(over ? "overflow-y-scroll" : "overflow-hidden")
					}
				/>
				<div
					class={
						" h-16 flex flex-row items-center " +
						(focusOn ? "justify-between w-full" : "")
					}
				>
					{focusOn && (
						<div class="flex flex-row items-center text-purple-500 relative">
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
					)}
					<div>
						<input
							type="submit"
							class="text-sm w-full rounded-2xl text-white font-bold bg-purple-400 flex justify-center px-4 py-2 hover:bg-purple-600 transition delay-50 duration-300 cursor-pointer"
							value="Reply"
						/>
					</div>
					<input
						ref={fileRef}
						type="file"
						accept="image/*"
						class="hidden"
						onChange={onFileChange}
					/>
				</div>
			</form>
		</div>
	);
};

export default ReplyBlock;
