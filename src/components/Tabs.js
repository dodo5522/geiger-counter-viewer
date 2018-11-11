import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import NoSsr from '@material-ui/core/NoSsr';
import Tab from '@material-ui/core/Tab';
import DateAndTimePickers from './DateTimePicker';

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
		tab: 0,
	};

	tabSelector = (event, tab) => {
		this.setState({ tab });
	};

	render() {
		const { classes, handlerStartDate, handlerEndDate } = this.props;
		const { tab } = this.state;

		return (
			<NoSsr>
				<div className={classes.root}>
					<AppBar position="fixed" color="primary" className={classes.appBar}>
						<Tabs fullWidth value={tab} onChange={this.tabSelector}>
							<LinkTab label="分単位" href="minutely" />
							<LinkTab label="時間平均" href="hourly" disabled />
							<LinkTab label="日平均" href="daily" disabled />
							<LinkTab label="週平均" href="weekly" disabled />
							<LinkTab label="月平均" href="monthly" disabled />
							<DateAndTimePickers label="start" handler={handlerStartDate} />
							<DateAndTimePickers label="end" handler={handlerEndDate} />
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
