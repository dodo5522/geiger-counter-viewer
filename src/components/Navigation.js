import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';

function LinkTab(props) {
	return (
		<Tab component="a" onClick={event => event.preventDefault()} {...props} />
	);
}

const styles = theme => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},
  appBar: {
    top: 'auto',
    bottom: 0,
  },
});

class NavTabs extends React.Component {
	state = {
		value: 0,
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="fixed" color="primary" className={classes.appBar}>
						<Tabs fullWidth value={value} onChange={this.handleChange}>
							<LinkTab label="分毎" href="minute" />
							<LinkTab label="週平均" href="week" disabled />
							<LinkTab label="月平均" href="month" disabled />
							<LinkTab label="年平均" href="year" disabled />
						</Tabs>
					</AppBar>
				</div>
			</NoSsr>
		);
	}
}

NavTabs.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NavTabs);
