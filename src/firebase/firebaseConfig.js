import firebase from "firebase/app";
import "firebase/firestore";

const object = require("./secrets");
firebase.initializeApp(object);

export const db = firebase.firestore();

export const database = {
	polls: db.collection("polls"),
	getTimeStamp: firebase.firestore.FieldValue.serverTimestamp,
};
