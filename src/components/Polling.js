import React from "react";

export default function Polling(props) {
	const {
		match: {
			params: { id },
		},
	} = props;
	console.log(id);
	return <div>Vote Poll with id: {id}</div>;
}
