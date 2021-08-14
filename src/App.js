import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreatePoll from "./components/CreatePoll";
import Polling from "./components/Polling";
import PollResult from "./components/PollResult";
import MyPolls from "./components/MyPolls";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/poll/result/:id" component={PollResult} />
				<Route path="/poll/:id" component={Polling} />
				<Route path="/mypolls" component={MyPolls} />
				<Route path="/" component={CreatePoll} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
