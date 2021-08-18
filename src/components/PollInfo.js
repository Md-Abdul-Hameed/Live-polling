import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Footer from "./Footer";
import Header from "./Header";
import { useState } from "react";
import { Skeleton } from "@material-ui/lab";

const useStyles = makeStyles({
	root: {
		maxWidth: "50%",
		margin: "100px auto",
		boxShadow:
			"0 10px 15px -3px rgb(0 0 0 / 10%), 0 4px 6px -2px rgb(0 0 0 / 5%)",
	},
	title: {
		fontSize: 18,
		margin: "1rem",
		fontFamily: "cursive",
	},
	pos: {
		marginBottom: 12,
	},
	link: {
		backgroundColor: "#edf2f7",
		padding: "10px",
		fontSize: "16px",
		color: "#4a5568",
		margin: "2rem",
	},
	pollBtn: {
		border: "none",
		background: "transparent",
		fontSize: "16px",
		fontWeight: "bold",
		color: "#4299e1",
		cursor: "pointer",
		position: "absolute",
		right: 40,
		bottom: 10,
		padding: "5px",
		"&:hover": {
			color: "#529fe1",
		},
	},
});

export default function PollInfo(props) {
	const [loader, setLoader] = useState(true);

	const { id } = props.match.params;
	const link = "localhost:3000/poll/" + id;

	const classes = useStyles();

	setTimeout(() => {
		setLoader(false);
	}, 1400);

	return (
		<div>
			{loader ? (
				<>
					<Skeleton
						animation="wave"
						variant="rect"
						width="100%"
						height={250}
						marginTop="0px"
						style={{ backgroundColor: "#edf2f7" }}
					/>
					<div style={{ maxWidth: "50%", margin: "50px auto" }}>
						<Skeleton
							animation="wave"
							height={250}
							style={{ margin: "0 auto", backgroundColor: "#edf2f7" }}
						/>
						<Skeleton
							animation="wave"
							height={60}
							style={{
								width: "60%",
								backgroundColor: "#edf2f7",
								margin: "100px auto",
							}}
						/>
					</div>
				</>
			) : (
				<>
					<Header />
					<Card className={classes.root}>
						<CardContent>
							<Typography
								className={classes.title}
								color="textPrimary"
								gutterBottom
							>
								The link to your poll is:
							</Typography>
							<Typography
								variant="body2"
								component="p"
								className={classes.link}
							>
								{link}
								<br />
							</Typography>
						</CardContent>
						<CardActions style={{ position: "relative" }}>
							<button
								className={classes.pollBtn}
								onClick={() => {
									props.history.push(`/poll/${id}`);
								}}
							>
								visit your poll
							</button>
						</CardActions>
					</Card>
					<Footer />
				</>
			)}
		</div>
	);
}
