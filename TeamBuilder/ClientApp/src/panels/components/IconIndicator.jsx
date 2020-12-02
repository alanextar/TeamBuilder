import React from 'react';
import PropTypes from 'prop-types';

export default class IconIndicator extends React.Component {
	constructor(props) {
		super(props);
	}

	showIndicator() {
		return this.props.isShow || this.props.counter > 0;
	}

	render() {
		return (
			<div style={{ position: "relative" }}>
				{this.showIndicator() &&
					<div className="indicator" style={this.props.style}>
						{this.props.counter}
					</div>}
				{this.props.children}
			</div>
		);
	}
}

IconIndicator.propTypes = {
	isShow: PropTypes.bool,
	counter: PropTypes.number,
	children: PropTypes.node.isRequired,
}