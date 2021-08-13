import React, { useEffect, useState } from "react";
import { database } from "../firebase/firebaseConfig";

export default function Polling(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [selectedOption, setSelectedOption] = useState();

	const {
		match: {
			params: { id },
		},
	} = props;

	const handlePollSubmit = async () => {
		let pollRef = await database.polls.doc(id).get();
		let pollData = pollRef.data();
		let votesToEachOption = pollData.votesToEachOption
        let totalVotes = pollData.totalVotes
        votesToEachOption[selectedOption]+=1
        totalVotes++;
        await database.polls.doc(id).update({
            votesToEachOption,
            totalVotes
        })
	};
	useEffect(() => {
		(async () => {
			let pollRef = await database.polls.doc(id).get();
			let pollData = pollRef.data();
			setQuestion(pollData.question);
			setOptions(pollData.options);
		})();
	}, []);

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
								}}
							/>
							<label htmlFor="option">{option}</label>
						</div>
					);
				})}
			</div>
			<button onClick={handlePollSubmit}>Submit</button>
		</>
	);
}
