import React from 'react';
import PropTypes from 'prop-types';
import {
  Paper,
  Table,
  TableRow,
  TableHead,
  TableContainer,
  TableCell,
  TableBody,
  Typography,
} from '@mui/material';
import { formatDate } from '../../utils/helper';

const styles = {
  paper: { width: '100%', my: 2 },
  table: {
    width: '100%',
  },
  cell: { fontSize: { xs: '0.7rem', sm: '1rem' } },
  header: { fontSize: { xs: '0.8rem', sm: '1rem' } },
  name: { pr: { xs: 0, sm: 2 } },
  text: {
    width: { xs: 60, sm: '100%' },
    fontSize: { xs: '0.7rem', sm: '1rem' },
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
  empty: { my: 2 },
};

const BookingsHistoryTable = ({ bookings }) => {
  return (
    <>
      {!!bookings.length && (
        <TableContainer sx={styles.paper} component={Paper}>
          <Table sx={styles.table} aria-label="active bookings">
            <TableHead>
              <TableRow>
                <TableCell sx={styles.header}>By</TableCell>
                <TableCell sx={styles.header} align="right">
                  Start
                </TableCell>
                <TableCell sx={styles.header} align="right">
                  End
                </TableCell>
                <TableCell sx={styles.header} align="right">
                  Price ($)
                </TableCell>
                <TableCell sx={styles.header} align="right">
                  status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row" sx={{ ...styles.cell, ...styles.name }}>
                    <Typography sx={styles.text}>{booking.owner_id}</Typography>
                  </TableCell>
                  <TableCell sx={styles.cell} align="right">
                    {formatDate(new Date(booking.start))}
                  </TableCell>
                  <TableCell sx={styles.cell} align="right">
                    {formatDate(new Date(booking.end))}
                  </TableCell>
                  <TableCell sx={styles.cell} align="right">
                    {booking.total}
                  </TableCell>
                  <TableCell sx={styles.cell} align="right">
                    {booking.status}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!bookings.length && (
        <Typography align="left" sx={styles.empty}>
          There is currently no history for this listing.
        </Typography>
      )}
    </>
  );
};

BookingsHistoryTable.propTypes = {
  bookings: PropTypes.array,
};

export default BookingsHistoryTable;
