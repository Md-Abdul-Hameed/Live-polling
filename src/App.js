import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CreatePoll from "./components/CreatePoll";
import Polling from "./components/Polling";
import PollResult from "./components/PollResult";
import MyPolls from "./components/MyPolls";
import ErrorPage from "./components/Error";

function App() {
	return (
		<BrowserRouter>
			<Switch>
				<Route path="/poll/result/:id" exact component={PollResult} />
				<Route path="/poll/:id" exact component={Polling} />
				<Route path="/mypolls" exact component={MyPolls} />
				<Route path="/" exact component={CreatePoll} />
				<Route component={ErrorPage} />
			</Switch>
		</BrowserRouter>
	);
}

export default App;
