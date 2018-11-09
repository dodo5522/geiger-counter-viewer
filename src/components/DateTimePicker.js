import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
	container: {
		display: 'flex',
		flexWrap: 'wrap',
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 200,
	},
});

function DateAndTimePickers(props) {
	const { classes, handler, label } = props;

	return (
		<form className={classes.container} noValidate>
			<TextField
				id="datetime-local"
				label={label}
				type="datetime-local"
				defaultValue={(new Date()).toISOString().split(":").splice(0, 2).join(":")}
				className={classes.textField}
				InputLabelProps={{
					shrink: true,
				}}
				onChange={handler}
			/>
		</form>
	);
}

DateAndTimePickers.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateAndTimePickers);
