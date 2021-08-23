import React, { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase/firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";
import { LinearProgress, makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import {
  WhatsappShareButton,
  TwitterShareButton,
  WhatsappIcon,
  TwitterIcon,
  TelegramIcon,
  TelegramShareButton,
  LinkedinIcon,
  LinkedinShareButton,
} from "react-share";
import { AnimatePresence, motion } from "framer-motion";
import FlipMove from "react-flip-move";
import { AnimatedList } from "react-animated-list";

const useStyles = makeStyles(() => ({
  question: {
    padding: "1rem",
  },
  option: {
    margin: "1rem",
    borderRadius: "6px",
    padding: "0.5rem",
    position: "relative",
    backgroundColor: "#fff",
    boxShadow: "3px 6px 13px 1px #ddd",
    "&:hover": {
      boxShadow: "none",
    },
  },
  percentage: {
    position: "absolute",
    right: "1em",
    color: "#41eb3b",
  },
  parent: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    alignItems: "center",
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
    console.log("useeffect");
    database.polls.doc(id).onSnapshot((doc) => {
      let data = doc.data();
      setTotalVotes(data.totalVotes);
      setQuestion(data.question);
      setOptions(data.options);
      setEachOptionVotes(data.votesToEachOption);
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
  }, [id]);
  const classes = useStyles();

  setTimeout(() => {
    setLoading(false);
  }, 1400);

  const animations = {
    initial: { scale: 1 },
    animate: { scale: 0 },
    exit: { scale: 0 },
    delay: "0.2s",
  };

  const sort = (a, b) => {
    return b.votes - a.votes;
  };

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
              style={{ backgroundColor: "#edf2f7" }}
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
		  
          <div className={classes.parent}>
            <div style={{ width: "50%", minWidth: "340px" }}>
              <h1 className={classes.question}>{question}</h1>
                {[...eachOptionVotes].sort(sort).map((option, id) => {
                  return (
                    <motion.div
                      layout
                      key={option.optionName}
                      id={id}
                      className={classes.option}
                      value={option.votes}
                      
                    >
                      {Number(id) === 0 ? (
                        <h1 className={classes.percentage}>
                          {Number(totalVotes) === 0
                            ? 0 + "%"
                            : Math.round(
                                (option.votes / totalVotes) * 100 * 10
                              ) /
                                10 +
                              "%"}
                        </h1>
                      ) : (
                        <h1
                          className={classes.percentage}
                          style={{ color: "#c2ffd3" }}
                        >
                          {Number(totalVotes) === 0
                            ? 0 + "%"
                            : Math.round(
                                (option.votes / totalVotes) * 100 * 10
                              ) /
                                10 +
                              "%"}
                        </h1>
                      )}
                      <h2>{option.optionName}</h2>
                      <LinearDeterminate
                        progress={
                          Math.round((option.votes / totalVotes) * 100 * 10) /
                          10
                        }
                      ></LinearDeterminate>
                      <span>votes : {option.votes}</span>
                    </motion.div>
                  );
                })}
            </div>
			
            <div>
              {options[myVote] !== null ? (
                <h4
                  style={{
                    backgroundColor: "rgba(190,227,248,255)",
                    padding: "4px",
                    borderRadius: "5px",
                    textAlign: "center",
                    boxShadow: "3px 6px 13px 1px #ddd",
                  }}
                >
                  You Voted : {options[myVote]}
                </h4>
              ) : (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={props.history.goBack}
                >
                  Submit your vote
                </Button>
              )}
              <SimpleCard totalVotes={totalVotes} id={id}></SimpleCard>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

function SimpleCard(props) {
  const useStyles = makeStyles({
    root: {
      minWidth: 275,
      height: "50%",
      boxShadow: "3px 6px 13px 1px #ddd",
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 16,
      fontWeight: "bold",
    },
    pos: {
      marginBottom: 12,
    },
    share: {
      display: "flex",
      alignItems: "center",
      height: "2.5rem",
      backgroundColor: "#25D366",
      borderRadius: "5px",
      paddingLeft: "3px",
      margin: "20px",
      color: "white",
      width: "80%",
      justifyContent: "center",
      boxShadow: "0 10px 20px -8px rgba(0, 0, 0,.7)",
      cursor: "pointer",
      transition: "all 0.5s",
      "&:hover": {
        boxShadow: "none",
        paddingRight: "24px",
        paddingLeft: "8px",
      },
    },
  });

  const classes = useStyles();
  const url = `https://live-polling.netlify.app/poll/${props.id}`;
  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Total Votes
        </Typography>
        <Typography variant="h5" component="h2" style={{ fontWeight: "bold" }}>
          {props.totalVotes}
        </Typography>
      </CardContent>
      <div>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
          style={{ paddingLeft: "15px" }}
        >
          Share
        </Typography>
      </div>

      <div>
        <div className={classes.share} style={{ backgroundColor: "#36B9FF" }}>
          <TwitterIcon style={{ marginRight: "4px" }} size={20}></TwitterIcon>
          <TwitterShareButton title="Share poll" url={props.id}>
            Share on Twitter
          </TwitterShareButton>
        </div>
        <div className={classes.share}>
          <WhatsappIcon style={{ marginRight: "4px" }} size={20}></WhatsappIcon>
          <WhatsappShareButton
            title="Hey! This is an invitation to poll, you can participate using this link"
            url={url}
          >
            Share on whatsapp
          </WhatsappShareButton>
        </div>
        <div className={classes.share} style={{ backgroundColor: "#2CA5E0" }}>
          <TelegramIcon style={{ marginRight: "4px" }} size={20}></TelegramIcon>
          <TelegramShareButton title="Share poll" url={props.id}>
            Share on Telegram
          </TelegramShareButton>
        </div>
        <div className={classes.share} style={{ backgroundColor: "#2B5586" }}>
          <LinkedinIcon style={{ marginRight: "4px" }} size={20}></LinkedinIcon>
          <LinkedinShareButton title="Share poll" url={props.id}>
            Share on LinkedIn
          </LinkedinShareButton>
        </div>
      </div>
    </Card>
  );
}

function LinearDeterminate(props) {
  const useStyles = makeStyles({
    root: {
      width: "100%",
      color: "aqua",
    },
    colorPrimary: {
      backgroundColor: "#41eb3b",
    },
  });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <LinearProgress
        variant="determinate"
        value={props.progress}
        style={{
          borderRadius: "20px",
          height: "10px",
          backgroundColor: "#ddd",
          color: "#41eb3b",
        }}
      />
    </div>
  );
}
