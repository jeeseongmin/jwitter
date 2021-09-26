import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./routes/App";
import firebase from "./mybase";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";
import configureStore from "./app/store";
const { store, persistor } = configureStore();

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<PersistGate loading={null} persistor={persistor}>
				<App />
			</PersistGate>
		</BrowserRouter>
	</Provider>,

	document.getElementById("root")
);
