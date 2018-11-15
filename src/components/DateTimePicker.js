import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
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
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25),
		},
	},
});

function DateAndTimePickers(props) {
	const { classes, handler, label, defaultValue } = props;

	return (
		<form className={classes.container} noValidate>
			<TextField
				id="datetime-local"
				label={label}
				type="datetime-local"
				defaultValue={defaultValue}
				className={classes.textField}
				InputLabelProps={{
					shrink: true,
				}}
				onBlur={handler}
			/>
		</form>
	);
}

DateAndTimePickers.propTypes = {
	classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateAndTimePickers);
