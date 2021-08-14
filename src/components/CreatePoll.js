import React, { useState } from 'react'
import { database } from '../firebase/firebaseConfig';
import {Link} from "react-router-dom"

export default function CreatePoll() {
    const [question,setQuestion] = useState("");
    const [options,setOptions] = useState(["",""])
    const [currentpollId,setCurrentPollId] = useState("")
    const [loader,setLoader] = useState(true)

    const handleCreate=async ()=>{
        let poll = {
            question,
            options,
            totalVotes:0,
            votesToEachOption:[]
        }
        try{
            let resp = await database.polls.doc()
            let pollId = resp.id;
            setCurrentPollId(pollId)
            await resp.set(poll);
            let iop = JSON.parse(localStorage.getItem("pollIds"))
             let oldPollIds = iop == null?[]:iop
             oldPollIds.push(pollId)
             console.log(oldPollIds);
             localStorage.setItem("pollIds",JSON.stringify(oldPollIds))
             setLoader(false)
        }catch(err){
            console.log("Error :",err)
        }
    }

    return (
        <div>
           <input placeholder="question" onChange={(e)=>setQuestion(e.target.value)}></input>
           <input placeholder="option1" onChange={(e)=>{
               let tempArr = [...options]
               tempArr[0] = e.target.value;
               setOptions(tempArr)
           }}></input>
        <input placeholder="option2"onChange={(e)=>{
               let tempArr = [...options]
               tempArr[1] = e.target.value;
               setOptions(tempArr)
           }}></input>
           <Link to = {`/poll/${currentpollId}`}>
           <button onClick={handleCreate}>Create</button>

           </Link>
        </div>
    )
}
