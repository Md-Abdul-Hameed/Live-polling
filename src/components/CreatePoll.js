import React, { useState } from "react";
import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { database } from "../firebase/firebaseConfig";
import { Button, Container, Fab, TextField } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import Footer from "./Footer";
import Header from "./Header";

const useStyles = makeStyles((theme) => ({
	maxWidthSm: {
		maxWidth: "70%",
	},
	text: {
		fontSize: "20px",
	},
	questionInput: {
		width: "100%",
	},
	option: {
		width: "100%",
		marginTop: "20px",
		marginRight: "3px",
	},
	deleteBtn: {
		cursor: "pointer",
		color: "red",
		fontSize: "30px",
		marginTop: "15px",
	},
	margin: {
		marginTop: theme.spacing(5),
	},
	createBtn: {
		marginTop: theme.spacing(5),
		padding: "15px",
		"&:disabled": {
			cursor: "not-allowed",
		},
	},
}));

export default function CreatePoll(props) {
	const [question, setQuestion] = useState("");
	const [options, setOptions] = useState(["", ""]);
	const [disable, setDisable] = useState(true);

	const handleCreate = async () => {
		const optionAndVotesArr = options.map((option) => {
			return {
				optionName: option,
				votes: 0,
			};
		});
		let poll = {
			question,
			options,
			totalVotes: 0,
			votesToEachOption: optionAndVotesArr,
		};
		try {
			let resp = database.polls.doc();
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

	const handleAddOption = () => {
		setOptions([...options, ""]);
	};

	const handleDelete = (e) => {
		let idx = Number(e.target.parentNode.id);
		let tempOptions = [...options];
		let UpdatedOptions = [];
		for (let i = 0; i < tempOptions.length; i++) {
			if (i !== idx) {
				UpdatedOptions.push(tempOptions[i]);
			}
		}
		setOptions(UpdatedOptions);
	};

	useEffect(() => {
		if (question !== "") {
			setDisable(false);
		} else {
			setDisable(true);
		}
		for (let i = 0; i < options.length; i++) {
			if (options[i] === "") {
				setDisable(true);
				break;
			} else if (question !== "") {
				setDisable(false);
			} else {
				setDisable(true);
			}
		}
	}, [question, options]);

	const classes = useStyles();
	return (
		<>
			<Header />
			<Container maxWidth="sm" className={classes.maxWidthSm}>
				<div>
					<h1>Create Poll</h1>
					<p className={classes.text}>Complete below fields to create a poll</p>
				</div>
				<div>
					<TextField
						className={classes.questionInput}
						id="outlined-multiline-static"
						label="Poll question"
						placeholder="What's your favorite movie?"
						multiline
						rows={4}
						variant="outlined"
						onChange={(e) => setQuestion(e.target.value)}
					/>
					{options.map((option, idx) => {
						return (
							<div
								key={idx}
								id={idx}
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<TextField
									className={classes.option}
									id="outlined-basic"
									label={`Option ${idx + 1}`}
									variant="outlined"
									placeholder="option"
									value={option}
									onChange={(e) => {
										let tempArr = [...options];
										tempArr[idx] = e.target.value;
										setOptions(tempArr);
									}}
								/>
								{options.length > 2 ? (
									<DeleteForeverIcon
										onClick={handleDelete}
										className={classes.deleteBtn}
									/>
								) : null}
							</div>
						);
					})}
					<Fab
						color="secondary"
						aria-label="add"
						className={classes.margin}
						onClick={handleAddOption}
					>
						<AddIcon />
					</Fab>
					<br />
					<Button
						variant="contained"
						color="primary"
						className={classes.createBtn}
						onClick={handleCreate}
						disabled={disable}
					>
						Create Your Poll
					</Button>
				</div>
			</Container>
			<Footer />
		</>
	);
}
