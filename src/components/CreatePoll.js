import React, { useState } from "react";
import { database } from "../firebase/firebaseConfig";

export default function CreatePoll(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", ""]);

	const handleCreate = async () => {
		let poll = {
			question,
			options,
			totalVotes: 0,
			votesToEachOption: [0,0],
		};
		try {
			let resp =  database.polls.doc();
			let pollId = resp.id;
			await resp.set(poll);
			let iop = JSON.parse(localStorage.getItem("pollIds"));
			let oldPollIds = iop == null ? [] : iop;
			oldPollIds.push(pollId);
			console.log(oldPollIds);
			localStorage.setItem("pollIds", JSON.stringify(oldPollIds));
			props.history.push(`/poll/${pollId}`);
		} catch (err) {
			console.log("Error :", err);
		}
	};

	return (
		<div>
			<input
				placeholder="question"
				onChange={(e) => setQuestion(e.target.value)}
			></input>
			<input
				placeholder="option1"
				onChange={(e) => {
					let tempArr = [...options];
					tempArr[0] = e.target.value;
					setOptions(tempArr);
				}}
			></input>
			<input
				placeholder="option2"
				onChange={(e) => {
					let tempArr = [...options];
					tempArr[1] = e.target.value;
					setOptions(tempArr);
				}}
			></input>
			<button onClick={handleCreate}>Create</button>
		</div>
	);
}
