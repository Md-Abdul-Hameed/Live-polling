import React from "react";

export default function PollResult(props) {
	const {
		match: {
			params: { id },
		},
	} = props;
	console.log(id);
	return <div>Poll Result</div>;
}
