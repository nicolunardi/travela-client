import React from 'react';
import PropTypes from 'prop-types';
import { IconButton, TableCell, TableRow, Tooltip, Typography } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { formatDate } from '../../utils/helper';

const styles = {
  text: {
    width: { xs: 60, sm: '100%' },
    fontSize: { xs: '0.7rem', sm: '1rem' },
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  cell: { fontSize: { xs: '0.7rem', sm: '1rem' } },
  name: { pr: { xs: 0, sm: 2 } },
};

const ActiveBookingTableRow = ({
  booking: { id, owner, dateRange, totalPrice, status, isValid },
  handleAcceptBooking,
  handleDeclineBooking,
}) => {
  return (
    <TableRow key={id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
      <TableCell component="th" scope="row" sx={{ ...styles.cell, ...styles.name }}>
        <Typography sx={styles.text}>{owner}</Typography>
      </TableCell>
      <TableCell sx={styles.cell} align="right">
        {formatDate(new Date(dateRange.start))}
      </TableCell>
      <TableCell sx={styles.cell} align="right">
        {formatDate(new Date(dateRange.end))}
      </TableCell>
      <TableCell sx={styles.cell} align="right">
        {totalPrice}
      </TableCell>
      <TableCell sx={styles.cell} align="right">
        <Tooltip title="Decline">
          <IconButton onClick={() => handleDeclineBooking(id)} aria-label="deny booking">
            <CancelIcon fontSize="small" color="error"></CancelIcon>
          </IconButton>
        </Tooltip>
        <Tooltip
          title={
            isValid
              ? 'Accept'
              : 'The dates for this booking fall outside of the listing availability.'
          }
        >
          <span>
            <IconButton
              onClick={() => handleAcceptBooking(id, dateRange)}
              aria-label="accept booking"
              disabled={!isValid}
            >
              <CheckCircleIcon fontSize="small" color={isValid ? 'success' : ''}></CheckCircleIcon>
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

ActiveBookingTableRow.propTypes = {
  booking: PropTypes.object,
  handleAcceptBooking: PropTypes.func,
  handleDeclineBooking: PropTypes.func,
};

export default ActiveBookingTableRow;
