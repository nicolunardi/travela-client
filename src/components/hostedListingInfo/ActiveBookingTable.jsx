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
import { ActiveBookingTableRow } from '.';
import { declineBooking, acceptBooking } from '../../service/api';

const styles = {
  paper: { width: { xs: '100%', sm: '100%' }, my: 2 },
  table: {
    width: { xs: '100%', sm: '100%' },
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

/**
 *  Table containing information for all pending booking for a particular listing.
 *  Allows user to accept or decline a booking. The Accept button will be disabled
 *  if the booking dates fall outside of the listings availability ranges
 */
const ActiveBookingTable = ({ bookings, setBookings, allBookings }) => {
  const handleAcceptBooking = async (id, dateRange) => {
    const res = await acceptBooking(id);
    if (res.status === 200) {
      const newBooking = allBookings.map((booking) => {
        if (booking.id === id) {
          return { ...booking, status: 'accepted' };
        } else {
          return booking;
        }
      });
      setBookings(newBooking);
    } else {
      // handle errors
    }
  };

  const handleDeclineBooking = async (id) => {
    const res = await declineBooking(id);
    if (res.status === 200) {
      const newBooking = allBookings.map((booking) => {
        if (booking.id === id) {
          return { ...booking, status: 'declined' };
        } else {
          return booking;
        }
      });
      setBookings(newBooking);
    } else {
      // handle errors
    }
  };

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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <ActiveBookingTableRow
                  key={booking.id}
                  booking={booking}
                  handleAcceptBooking={handleAcceptBooking}
                  handleDeclineBooking={handleDeclineBooking}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {!bookings.length && (
        <Typography align="left" sx={styles.empty}>
          There are currently no pending bookings for this listing.
        </Typography>
      )}
    </>
  );
};

ActiveBookingTable.propTypes = {
  bookings: PropTypes.array,
  setBookings: PropTypes.func,
  allBookings: PropTypes.array,
};

export default ActiveBookingTable;
