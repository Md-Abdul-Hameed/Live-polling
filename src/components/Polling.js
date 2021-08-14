import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";

export default function Polling(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState();
	const [disable, setDisable] = useState(true);

	const {
		match: {
			params: { id },
		},
	} = props;

	const handlePollSubmit = async () => {
		let pollRef = await database.polls.doc(id).get();
		let pollData = pollRef.data();
		let votesToEachOption = pollData.votesToEachOption;
		let totalVotes = pollData.totalVotes;
		votesToEachOption[selectedOption].votes += 1;
		totalVotes++;
		await database.polls.doc(id).update({
			votesToEachOption,
			totalVotes,
		});
		let existing = localStorage.getItem("votes");
		let oldVotesArr = existing ? JSON.parse(existing) : [];
		oldVotesArr.push({ pollID: id, optionIdx: selectedOption });
		localStorage.setItem("votes", JSON.stringify(oldVotesArr));
		props.history.push(`/poll/result/${id}`);
	};
	useEffect(() => {
		(async () => {
			let pollRef = await database.polls.doc(id).get();
			let pollData = pollRef.data();
			setQuestion(pollData.question);
			setOptions(pollData.options);
		})();
	}, []);

	useEffect(() => {
		let existing = localStorage.getItem("votes");
		let oldVotes = existing ? JSON.parse(existing) : null;
		if (oldVotes !== null) {
			oldVotes.forEach((voteObj) => {
				if (voteObj.pollID === id) {
					props.history.push(`/poll/result/${id}`);
				}
			});
		}
	});
	return (
		<>
			<h1>{question}</h1>
			<div>
				{options.map((option, id) => {
					return (
						<div key={id}>
							<input
								type="radio"
								name="options"
								id={id}
								value={option}
								onChange={(e) => {
									setSelectedOption(e.currentTarget.id);
									setDisable(false);
								}}
							/>
							<label htmlFor="option">{option}</label>
						</div>
					);
				})}
			</div>
			<button onClick={handlePollSubmit} disabled={disable}>
				Submit
			</button>
		</>
	);
}
