import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { composeWithDevTools } from "redux-devtools-extension";
import { createStore } from "redux";
import reducers from "../reducers";

const persistConfig = {
	key: "root",
	storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export default function configureStore() {
	const store = createStore(persistedReducer, {}, composeWithDevTools());
	const persistor = persistStore(store);
	return { store, persistor };
}
