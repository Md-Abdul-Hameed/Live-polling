import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { database } from "../firebase/firebaseConfig";
import { makeStyles } from "@material-ui/styles";
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import Footer from "./Footer";
import Header from "./Header";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles(() => ({
	pollPage: {
		width: "50%",
		margin: "80px auto",
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "flex-start",
	},
	pollQuestion: {
		margin: "30px",
	},
	option: {
		position: "relative",
		minWidth: "90%",
		display: "block",
		fontSize: "18px",
		padding: "25px",
		margin: "15px",
		backgroundColor: "#edf2f7",
		cursor: "pointer",
		borderRadius: "10px",
	},
	tickIcon: {
		position: "absolute",
		right: 10,
		color: "#41eb3b",
	},
	submitBtn: {
		border: "none",
		background: "transparent",
		backgroundColor: "#41eb3b",
		height: "50px",
        fontSize:"16px",
		minWidth: "150px",
		padding: "10px",
		borderRadius: "6px",
		color: "#fff",
		cursor: "pointer",
		margin: "20px",
		"&:disabled": {
			backgroundColor: "#ccc",
			cursor: "no-drop",
		},
	},
}));

export default function Polling(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState([]);
	const [disable, setDisable] = useState(true);
	const [optionSelectId, setOptionSelectId] = useState();
	const [loader, setLoader] = useState(true);
	const {
		match: {
			params: { id },
		},
	} = props;

	const handleSelect = (e) => {
		console.log(e.currentTarget);
		setOptionSelectId(Number(e.target.id));
		console.log(e.target.style.border);
		if (optionSelectId === e.target.id) {
			e.target.style.border = "3px solid black";
		} else {
			e.target.style.border = "none";
		}
		setDisable(false);
	};
	const handlePollSubmit = async () => {
		let pollRef = await database.polls.doc(id).get();
		let pollData = pollRef.data();
		let votesToEachOption = pollData.votesToEachOption;
		let totalVotes = pollData.totalVotes;
		votesToEachOption[optionSelectId].votes += 1;
		totalVotes++;
		await database.polls.doc(id).update({
			votesToEachOption,
			totalVotes,
		});
		let existing = localStorage.getItem("votes");
		let oldVotesArr = existing ? JSON.parse(existing) : [];
		oldVotesArr.push({ pollID: id, optionIdx: optionSelectId });
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

	setTimeout(() => {
		setLoader(false);
	}, 1400);

	const classes = useStyles();

	return (
		<>
			{loader ? (
				<>
					<Skeleton
						variant="rect"
						width="100%"
						height={250}
						animation="wave"
						marginTop="0px"
						style={{ backgroundColor: "#edf2f7" }}
					/>
					<div style={{ maxWidth: "50%", margin: "50px auto" }}>
						<Skeleton
							height={150}
							animation="wave"
							style={{
								width: "70%",
								backgroundColor: "#edf2f7",
								marginTop: "30px",
							}}
						/>
						<Skeleton
							animation="wave"
							height={120}
                            margin="0px"
							style={{  backgroundColor: "#edf2f7" }}
						/>
						<Skeleton
							animation="wave"
							height={120}
							style={{ margin: "1px auto", backgroundColor: "#edf2f7" }}
						/>
						<Skeleton
							animation="wave"
							height={80}
							style={{ margin: "10px 0",width:"30%", backgroundColor: "#edf2f7" }}
						/>
					</div>
				</>
			) : (
				<>
					<Header />
					<div className={classes.pollPage}>
						<h1 className={classes.pollQuestion}>{question}</h1>
						<div style={{ width: "100%" }}>
							{options.map((option, id) => {
								return (
									<div>
										{optionSelectId === id ? (
											<motion.div
												animate={{ x: 10 }}
												transition={{ type: "spring", stiffness: 100 }}
												key={id}
												id={id}
												style={{
													boxShadow: " 0px 0px 12px 0px rgba(120,120,120,1)",
												}}
												// style={{border:"3px solid black"}}
												className={classes.option}
												onClick={(e) => {
													handleSelect(e);
												}}
											>
												{option}
												<span className={classes.tickIcon}>
													<CheckCircleIcon />
												</span>
											</motion.div>
										) : (
											<div
												key={id}
												id={id}
												className={classes.option}
												onClick={(e) => {
													handleSelect(e);
												}}
											>
												{option}
											</div>
										)}
									</div>
								);
							})}
						</div>
						<button
							onClick={handlePollSubmit}
							disabled={disable}
							className={classes.submitBtn}
						>
							Submit your vote
						</button>
					</div>
					<Footer />
				</>
			)}
		</>
	);
}
