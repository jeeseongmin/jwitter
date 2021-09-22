export const SET_LOGIN_TOKEN = "SET_LOGIN_TOKEN";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

export const setLoginToken = (loginToken) => ({
	type: SET_LOGIN_TOKEN,
	payload: loginToken,
});

export const setCurrentUser = (currentUser) => ({
	type: SET_CURRENT_USER,
	payload: currentUser,
});

const initialState = {
	loginToken: "logout",
	currentUser: {
		uid: "",
		photoURL: "",
		displayName: "",
		email: "",
	},
};

const user = (state = initialState, action) => {
	switch (action.type) {
		case SET_LOGIN_TOKEN: {
			return {
				...state,
				loginToken: action.payload,
			};
		}
		case SET_CURRENT_USER: {
			return {
				...state,
				currentUser: action.payload,
			};
		}

		default:
			return state;
	}
};

export default user;
