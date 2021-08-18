import React, { useEffect } from "react";
import { useState } from "react";
import { database } from "../firebase/firebaseConfig";
import Header from "./Header";
import Footer from "./Footer";
import { makeStyles } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { Button } from "@material-ui/core";
import WhatsAppIcon from '@material-ui/icons/WhatsApp';

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
  },
  percentage: {
    position: "absolute",
    right: "1em",
    color: "#41eb3b",
  },
  parent: {
    display: "flex",
    backgroundColor: "#faf8f5",
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
	  console.log("useeffect")
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
              {eachOptionVotes.map((option, id) => {
                return (
                  <div key={id} className={classes.option}>
                    {id == 0 ? (
                      <h1 className={classes.percentage}>
						  {totalVotes == 0  ? 0 +"%":(Math.round(((option.votes / totalVotes) * 100 )*10)/10) + "%" }
                      </h1>
                    ) : (
                      <h1
                        className={classes.percentage}
                        style={{ color: "#c2ffd3" }}
                      >
                        {totalVotes == 0  ? 0 +"%":(Math.round(((option.votes / totalVotes) * 100 )*10)/10)+ "%" }
                      </h1>
                    )}
                    <h2>{option.optionName}</h2>
                    <span>votes : {option.votes}</span>
                  </div>
                );
              })}
            </div>
            {/* <div style={{display:"flex",flexDirection:"column",padding:"5rem"}}>
						<h3 style={{margin:"0px"}}>Total Votes: {totalVotes}</h3>
						<h5>You voted: {options[myVote]}</h5>
					</div> */}
            <div>
			{options[myVote]!=null  ? <h4 style={{backgroundColor:"rgba(190,227,248,255)",padding:"4px",borderRadius:"5px",textAlign:"center"}}>You Voted : {options[myVote]}</h4>:
			<Button variant = "outlined" color="secondary" onClick={props.history.goBack}>Submit your vote</Button>}
              <SimpleCard totalVotes={totalVotes}></SimpleCard>
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
    },
    bullet: {
      display: "inline-block",
      margin: "0 2px",
      transform: "scale(0.8)",
    },
    title: {
      fontSize: 16,
	  fontWeight:"bold"
    },
    pos: {
      marginBottom: 12,
    },
  });

  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
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
        <Typography variant="h5" component="h2" style={{fontWeight:"bold"}}>
          {props.totalVotes}
        </Typography>
        
      </CardContent>
      <CardActions>
        <Button  startIcon={<WhatsAppIcon/> } iconSize="large" variant = "contained" style={{backgroundColor:"#41eb3b",textTransform:"lowercase",color:"white",}} >Share On Whatsapp</Button>
      </CardActions>
    </Card>
  );
}
