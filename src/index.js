import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import firebase from "./mybase";

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById("root")
);
