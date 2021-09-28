import React, { useState } from "react";
import { BsChat } from "react-icons/bs";
import CreateReplyModal from "components/modal/CreateReplyModal";

const ReplyButton = ({
	jweet,
	isDetail,
	handleReplyOpen,
	replyOpen,
	handleReplyClose,
}) => {
	return (
		<>
			<div
				id="except"
				class={
					"w-1/4 flex flex-row items-center transition delay-50 duration-300 text-gray-400 hover:text-purple-500 " +
					(isDetail ? "justify-center" : "")
				}
			>
				<div
					onClick={handleReplyOpen}
					id="except"
					class={
						"rounded-full transition delay-50 duration-300 hover:bg-purple-100 p-2 " +
						(isDetail ? "mt-1 mr-1 " : "cursor-pointer")
					}
				>
					<BsChat size={isDetail ? 24 : 16} />
				</div>
				{!isDetail && (
					<p id="except" class="text-sm flex flex-row items-center">
						{jweet.reply.length}
					</p>
				)}
			</div>
			<CreateReplyModal
				jweet={jweet}
				replyOpen={replyOpen}
				handleReplyClose={handleReplyClose}
			/>
		</>
	);
};

export default ReplyButton;
