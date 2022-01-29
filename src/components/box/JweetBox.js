import Avatar from "@mui/material/Avatar";
import Skeleton from "@mui/material/Skeleton";
import BookmarkButton from "components/button/BookmarkButton";
import DeleteButton from "components/button/DeleteButton";
import LikeButton from "components/button/LikeButton";
import RejweetButton from "components/button/RejweetButton";
import ReplyButton from "components/button/ReplyButton";
import UpdateButton from "components/button/UpdateButton";
import DeleteJweetModal from "components/modal/DeleteJweetModal";
import ImageModal from "components/modal/ImageModal";
import UpdateJweetModal from "components/modal/UpdateJweetModal";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "mybase";
import React, { useEffect, useRef, useState } from "react";
import { FaRetweet } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const JweetBox = (props) => {
  const history = useHistory();
  const jweet = props.jweet;
  const [loading, setLoading] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser);
  const funcRef = useRef();
  const [func, setFunc] = useState(false);

  const [creatorInfo, setCreatorInfo] = useState({});
  const toggleFunc = () => {
    if (jweet.creatorId === currentUser.uid) setFunc(!func);
  };
  const [replyOpen, setReplyOpen] = useState(false);
  const handleReplyOpen = () => setReplyOpen(true);
  const handleReplyClose = () => {
    setReplyOpen(false);
  };
  // jweet 모달
  const [updateOpen, setUpdateOpen] = useState(false);
  const handleUpdateOpen = () => setUpdateOpen(true);
  const handleUpdateClose = () => {
    setUpdateOpen(false);
  };

  const [deleteOpen, setDeleteOpen] = useState(false);
  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };
  useEffect(() => {
    console.log(jweet);
    return () => setLoading(false);
  }, []);
  useEffect(() => {
    if (!func) return;
    function handleClick(e) {
      if (funcRef.current === null) {
        return;
      } else if (!funcRef.current.contains(e.target)) {
        setFunc(false);
      }
    }
    window.addEventListener("click", handleClick);

    return () => window.removeEventListener("click", handleClick);
  }, [func]);

  const timeToString = (timestamp) => {
    var date = new Date(timestamp);
    let str =
      date.getFullYear() +
      "년 " +
      Number(date.getMonth() + 1) +
      "월 " +
      date.getDate() +
      "일 ";
    return str;
  };

  const [photoOpen, setPhotoOpen] = useState(false);
  const handlePhotoOpen = () => setPhotoOpen(true);
  const handlePhotoClose = () => {
    setPhotoOpen(false);
  };
  useEffect(() => {
    onSnapshot(doc(db, "users", jweet.creatorId), (doc) => {
      setCreatorInfo(doc.data());
      setLoading(true);
    });
  }, [jweet]);
  const exceptRef = useRef();
  const modalRef = useRef();
  const profileRef = useRef();
  const replyRef = useRef();
  const reJweetRef = useRef();
  const likeRef = useRef();
  const bookmarkRef = useRef();

  const goJweet = (e) => {
    if (
      e.target !== exceptRef.current &&
      e.target !== profileRef.current &&
      e.target !== replyRef.current &&
      e.target !== reJweetRef.current &&
      e.target !== likeRef.current &&
      e.target !== bookmarkRef.current &&
      e.target.tagName !== "svg" &&
      e.target.tagName !== "path" &&
      e.target.id !== "except" &&
      e.target.innerText !== "Update Jweet" &&
      e.target.innerText !== "Delete Jweet" &&
      !e.target.className.includes("MuiBackdrop") &&
      !photoOpen &&
      !updateOpen &&
      !replyOpen &&
      !deleteOpen
    ) {
      history.push("/jweet/" + jweet.id);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div class='w-full select-none z-30 cursor-pointer hover:bg-gray-100 transition delay-50 duration-300 flex flex-col px-2 pt-2 pb-4  border-b border-gray-200'>
      {jweet.rejweet && jweet.rejweet.includes(currentUser.uid) && (
        <div
          class={
            "pl-10 text-xs text-gray-500 font-bold w-full flex flex-row items-center " +
            (props.type !== "explore" ? "" : "mb-2")
          }>
          <div class='mt-1 mr-3'>
            <FaRetweet size={16} />
          </div>
          <p class='m-0 p-0'>{currentUser.displayName} ReJweeted</p>
        </div>
      )}
      <div onClick={goJweet} class='w-full flex flex-row '>
        <>
          <div class='flex flex-col'>
            {loading ? (
              <div
                class={
                  "h-16 w-16 pb-2 pl-2 pr-2 " +
                  (props.type !== "explore" ? "pt-4 " : "")
                }>
                <Avatar
                  src={creatorInfo.photoURL}
                  sx={{ width: 48, height: 48 }}
                />
              </div>
            ) : (
              <div class='h-16 w-16 p-2'>
                <Skeleton variant='circular'>
                  <Avatar sx={{ width: 48, height: 48 }} />
                </Skeleton>
              </div>
            )}
          </div>
          <div class='w-full flex flex-col pl-2'>
            {loading ? (
              <div class='w-full flex flex-row mr-2 justify-between items-center'>
                <div class='w-full flex flex-row'>
                  <h1 class='text-base font-bold mr-4'>
                    {creatorInfo.displayName}
                  </h1>
                  <p class='text-gray-500 whitespace-pre-wrap break-words'>
                    @{creatorInfo.email ? creatorInfo.email.split("@")[0] : ""}
                  </p>
                  <p class='text-gray-500 mx-1'>∙</p>
                  <p class='text-gray-500'>{timeToString(jweet.createdAt)}</p>
                </div>
                {props.type !== "explore" ? (
                  <div
                    ref={funcRef}
                    id='except'
                    class={
                      "cursor-pointer transition delay-50 duration-300 rounded-full p-2 relative " +
                      (jweet.creatorId === currentUser.uid
                        ? "hover:bg-purple-100"
                        : "")
                    }>
                    <HiOutlineDotsHorizontal
                      id='except'
                      onClick={toggleFunc}
                      size={28}
                    />
                    {func && (
                      <div class='bg-white border border-gray-200 z-40 absolute flex flex-col top-2 right-2 w-60 rounded-md shadow-xl'>
                        <UpdateButton
                          handleOpen={handleUpdateOpen}
                          text={"Update Jweet"}
                        />
                        <DeleteButton
                          handleOpen={handleDeleteOpen}
                          text={"Delete Jweet"}
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              <Skeleton width='100%'>
                <div class='h-8'></div>
              </Skeleton>
            )}
            {loading ? (
              <>
                <div class='break-all w-full h-auto'>
                  <p class='w-full h-auto resize-none outline-none cursor-pointer bg-transparent whitespace-pre-wrap break-words'>
                    {jweet.text}
                  </p>
                </div>
                {jweet.attachmentUrl !== "" && (
                  <div class='w-full mt-4 mb-2 pr-4 '>
                    <img
                      onClick={handlePhotoOpen}
                      ref={exceptRef}
                      src={jweet.attachmentUrl}
                      class='max-h-80 w-full object-cover rounded-xl border border-gray-200 shadow-lg'
                      alt='attachment'
                    />
                  </div>
                )}
              </>
            ) : (
              <Skeleton width='100%'>
                <div class='w-full h-24  resize-none outline-none cursor-pointer bg-transparent whitespace-pre	'></div>
              </Skeleton>
            )}

            {loading && props.type !== "explore" ? (
              <div id='except' class='w-full flex flex-row items-center mt-4 '>
                <ReplyButton
                  replyRef={replyRef}
                  jweet={jweet}
                  isDetail={false}
                  replyOpen={replyOpen}
                  handleReplyOpen={handleReplyOpen}
                  handleReplyClose={handleReplyClose}
                />
                <RejweetButton
                  reJweetRef={reJweetRef}
                  jweet={jweet}
                  isDetail={false}
                />
                <LikeButton likeRef={likeRef} jweet={jweet} isDetail={false} />
                <BookmarkButton
                  bookmarkRef={bookmarkRef}
                  jweet={jweet}
                  isDetail={false}
                />
              </div>
            ) : props.type !== "explore" ? (
              <Skeleton width='100%'>
                <div class='w-full h-12  resize-none outline-none cursor-pointer bg-transparent whitespace-pre	'></div>
              </Skeleton>
            ) : (
              ""
            )}
          </div>

          <UpdateJweetModal
            jweet={jweet}
            updateOpen={updateOpen}
            handleUpdateClose={handleUpdateClose}
          />
          <DeleteJweetModal
            jweet={jweet}
            deleteOpen={deleteOpen}
            goBack={false}
            handleDeleteClose={handleDeleteClose}
          />

          <ImageModal
            modalRef={modalRef}
            photoURL={jweet.attachmentUrl}
            photoOpen={photoOpen}
            handlePhotoOpen={handlePhotoOpen}
            handlePhotoClose={handlePhotoClose}
          />
        </>
      </div>
    </div>
  );
};

export default JweetBox;
