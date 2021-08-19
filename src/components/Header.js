import React from "react";
import {useHistory} from "react-router-dom"

export default function Header(props) {
  const history = useHistory()
  return (
    <>
      <div className="top-strip"></div>
      <div className="header">
        <h1 className="title" style={{cursor:"pointer"}} onClick={()=>history.push("/")}>
          <i class="fas fa-bolt" ></i>Live Poll
        </h1>
        <p className="tagline">Create fast anonymous polls for free</p>
      </div>
    </>
  );
}
