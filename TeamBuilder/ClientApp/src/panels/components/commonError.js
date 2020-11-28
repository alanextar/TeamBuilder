import React from 'react'

export const CommonError = ({ text }) => {
	return (
		<div className="error">
			<p>{text}</p>
		</div>
	)
}