import React, { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase/firebaseConfig";

export default function PollResult(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [totalVotes, setTotalVotes] = useState(0);
	const [eachOptionVotes, setEachOptionVotes] = useState([]);
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
	}, []);
	return (
		<>
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
			<div>Total Votes : {totalVotes}</div>
		</>
	);
}
