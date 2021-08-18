import React from "react";

export default function Header() {
	return (
		<>
			<div className="top-strip"></div>
			<div className="header">
				<h1 className="title">
					<i className="fas fa-bolt"></i>Live Poll
				</h1>
				<p className="tagline">Create fast anonymous polls for free</p>
			</div>
		</>
	);
}
