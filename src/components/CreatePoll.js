import React, { useState } from "react";
import { database } from "../firebase/firebaseConfig";

export default function CreatePoll(props) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]); 

  const handleCreate = async () => {
    let poll = {
      question,
      options,
      totalVotes: 0,
      votesToEachOption: [0, 0],
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
    let UpdatedOptions = []
    for(let i = 0; i < tempOptions.length; i++){
        if(i != idx){
            UpdatedOptions.push(tempOptions[i])
        }
    }
    setOptions(UpdatedOptions);
};

  return (
    <div>
      <input
        placeholder="question"
        onChange={(e) => setQuestion(e.target.value)}
      ></input>
      {options.map((option, idx) => {
        return (
          <div key={idx} id={idx}>
            <input
              placeholder="option"
              value={option}
              onChange={(e) => {
                let tempArr = [...options];
                tempArr[idx] = e.target.value;
                setOptions(tempArr);
              }}
            ></input>
            {options.length > 2 ? (
              <button onClick={handleDelete}>delete</button>
            ) : null}
          </div>
        );
      })}
      <button onClick={handleAddOption}>Add Option</button>
      <button onClick={handleCreate}>Create</button>
    </div>
  );
}
