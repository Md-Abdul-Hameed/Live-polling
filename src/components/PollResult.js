import React, { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase/firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";
import { makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
	question: {
		padding: "1rem",
	},
	option: {
		border: "1px solid green",
		margin: "1rem",
		borderRadius: "6px",
		padding: "0.5rem",
		position: "relative",
	},
	percentage: {
		position: "absolute",
		right: "1em",
		color: "#41eb3b",
	},
}));

export default function PollResult(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [totalVotes, setTotalVotes] = useState(0);
	const [eachOptionVotes, setEachOptionVotes] = useState([]);
	const [myVote, setMyVote] = useState();
	const [loading, setLoading] = useState(true);
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
	const classes = useStyles();

	setTimeout(() => {
		setLoading(false);
	}, 1400);

	return (
		<>
			{loading ? (
				<>
					<Skeleton
						animation="wave"
						variant="rect"
						width="100%"
						height={240}
						marginTop="0px"
						style={{ backgroundColor: "#edf2f7" }}
					/>
					<div style={{ maxWidth: "50%", margin: "50px auto" }}>
                        <Skeleton
                        animation="wave"
                        height={100}
                        style={{backgroundColor: "#edf2f7"}}
                        />
						<Skeleton
							animation="wave"
							height={180}
							style={{ margin: "0 auto", backgroundColor: "#edf2f7" }}
						/>
						<Skeleton
							animation="wave"
							height={180}
							style={{
								backgroundColor: "#edf2f7",
								margin: "0 auto",
							}}
						/>
					</div>
				</>
			) : (
				<>
					<Header />
					<div style={{ width: "50%", margin: "0 auto" }}>
						<h1 className={classes.question}>{question}</h1>
						{eachOptionVotes.map((option, id) => {
							return (
								<div key={id} className={classes.option}>
									{id == 0 ? (
										<h1 className={classes.percentage}>
											{(option.votes / totalVotes) * 100 + "%"}
										</h1>
									) : (
										<h1
											className={classes.percentage}
											style={{ color: "#c2ffd3" }}
										>
											{(option.votes / totalVotes) * 100 + "%"}
										</h1>
									)}
									<h2>{option.optionName}</h2>
									<span>votes : {option.votes}</span>
								</div>
							);
						})}
					</div>
					<div>
						<h5>Total Votes: {totalVotes}</h5>
						<h5>You voted: {options[myVote]}</h5>
					</div>
					<Footer />
				</>
			)}
		</>
	);
}
