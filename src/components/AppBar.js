import React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import DateAndTimePickers from './DateTimePicker';

const styles = theme => ({
	root: {
		width: '100%',
	},
	grow: {
		flexGrow: 1,
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20,
	},
	title: {
		display: 'none',
		[theme.breakpoints.up('sm')]: {
			display: 'block',
		},
	},
	inputRoot: {
		color: 'inherit',
		width: '100%',
	},
	inputInput: {
		paddingTop: theme.spacing.unit,
		paddingRight: theme.spacing.unit,
		paddingBottom: theme.spacing.unit,
		paddingLeft: theme.spacing.unit * 10,
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('md')]: {
			width: 200,
		},
	},
	sectionDesktop: {
		display: 'none',
		[theme.breakpoints.up('md')]: {
			display: 'flex',
		},
	},
	sectionMobile: {
		display: 'flex',
		[theme.breakpoints.up('md')]: {
			display: 'none',
		},
	},
});

class GeigerChartAppBar extends React.Component {
	state = {
		anchorEl: null,
	};

	handleMainMenuOpen = event => {
		this.setState({ anchorEl: event.currentTarget });
	};

	handleMainMenuClose = () => {
		this.setState({ anchorEl: null });
	};

	render() {
		const { anchorEl } = this.state;
		const { classes, startDateTime, endDateTime, handleStartDate, handleEndDate } = this.props;
		const isMainMenuOpen = Boolean(anchorEl);

		const renderMainMenu = (
			<Menu
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={isMainMenuOpen}
				onClose={this.handleMainMenuClose}
			>
				<MenuItem>
					<DateAndTimePickers
						defaultValue={startDateTime}
						color="inherit"
						label="begin"
						handler={handleStartDate}
					/>
				</MenuItem>
				<MenuItem>
					<DateAndTimePickers
						defaultValue={endDateTime}
						color="inherit"
						label="end"
						handler={handleEndDate}
					/>
				</MenuItem>
			</Menu>
		);

		return (
			<div className={classes.root}>
				<AppBar position="static">
					<Toolbar>
						<IconButton
							className={classes.menuButton}
							color="inherit"
							aria-label="Open drawer"
							onClick={this.handleMainMenuOpen}
						>
							<MenuIcon />
						</IconButton>
						<Typography className={classes.title} variant="h6" color="inherit" noWrap>
							Geiger Chart
						</Typography>
						<div className={classes.grow} />
						<div className={classes.sectionDesktop}>
							<DateAndTimePickers
								defaultValue={startDateTime}
								color="inherit"
								label="begin"
								handler={handleStartDate}
							/>
							<DateAndTimePickers
								defaultValue={endDateTime}
								color="inherit"
								label="end"
								handler={handleEndDate}
							/>
						</div>
					</Toolbar>
				</AppBar>
				{renderMainMenu}
			</div>
		);
	}
}

GeigerChartAppBar.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GeigerChartAppBar);
