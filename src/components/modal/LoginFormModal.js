import Modal from "@mui/material/Modal";
import AuthFormModal from "components/modal/AuthFormModal";

const LoginFormModal = ({ isLogin, open, handleClose }) => {
	return (
		<Modal
			open={open}
			onClose={handleClose}
			aria-labelledby="modal-modal-title"
			aria-describedby="modal-modal-description"
		>
			<div class="outline-none absolute border border-white p-4 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 origin-center w-96 h-auto bg-white rounded-lg flex flex-col justify-start items-start">
				{isLogin && (
					<h1 class="text-2xl font-bold mb-4">일반 이메일로 로그인</h1>
				)}
				{!isLogin && (
					<h1 class="text-2xl font-bold mb-4">계정을 생성하세요.</h1>
				)}
				<AuthFormModal isLogin={isLogin} />
			</div>
		</Modal>
	);
};

export default LoginFormModal;
