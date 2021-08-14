import React, { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase/firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";

export default function PollResult(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [totalVotes, setTotalVotes] = useState(0);
	const [eachOptionVotes, setEachOptionVotes] = useState([]);
	const [myVote, setMyVote] = useState();
	const {
		match: {
			params: { id },
		},
	} = props;

	useEffect(() => {
		database.polls.doc(id).onSnapshot((doc) => {
			let data = doc.data();
			setTotalVotes(data.totalVotes);
			setQuestion(data.question);
			setOptions(data.options);
			let sortedArr = data.votesToEachOption.sort((a, b) => {
				return b.votes - a.votes;
			});
			setEachOptionVotes(sortedArr);
		});
		let existing = localStorage.getItem("votes");
		let oldVotes = existing ? JSON.parse(existing) : null;
		if (oldVotes !== null) {
			oldVotes.forEach((voteObj) => {
				if (voteObj.pollID === id) {
					setMyVote(voteObj.optionIdx);
				}
			});
		}
	}, []);
	return (
		<>
			<Header />
			<div>
				<h1>{question}</h1>
				{eachOptionVotes.map((option, id) => {
					return (
						<div key={id}>
							<h2>{option.optionName}</h2>
							<span>{option.votes}</span>
						</div>
					);
				})}
			</div>
			<div>
				<h5>Total Votes : {totalVotes}</h5>
				<h5>You voted: {options[myVote]}</h5>
			</div>
			<Footer />
		</>
	);
}
