import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { getBookings, getListing } from '../service/api';
import { checkDatesAgainstAvailability, getBookingsByListing } from '../utils/helper';
import {
  ActiveBookingTable,
  BookingsHistoryTable,
  InfoContainer,
} from '../components/hostedListingInfo';
import { Container, Typography } from '@mui/material';

const styles = {
  container: {
    px: { xs: 0, sm: 4 },
  },
};

const HostedListingInfo = () => {
  const { user } = useContext(UserContext);
  const { id } = useParams();
  const history = useHistory();
  const [listing, setListing] = useState(null);
  const [bookings, setBookings] = useState(null);

  useEffect(async () => {
    const listingIn = await getListing(id);
    if (listingIn.status >= 200 && listingIn.status < 300) {
      // check that the user is the owner of the listing
      if (listingIn.data.owner_id !== parseInt(user.id)) {
        history.push('/');
        return;
      }
      setListing(listingIn.data);
      const bookings = await getBookings();
      if (bookings.status >= 200 && bookings.status < 300) {
        let listingBookings = getBookingsByListing(bookings.data.bookings, listingIn.data.id);
        // check that the booking date is within the availability of the listing
        listingBookings = listingBookings.map((booking) => {
          if (
            checkDatesAgainstAvailability(listingIn.data.availability, {
              start: booking.start,
              end: booking.end,
            })
          ) {
            return { ...booking, isValid: true };
          } else {
            return { ...booking, isValid: false };
          }
        });
        setBookings(listingBookings);
      }
    }
  }, []);

  return (
    <>
      <Container sx={styles.container} align="center">
        {listing && bookings && (
          <InfoContainer
            listing={listing}
            bookings={bookings.filter((booking) => booking.status === 'accepted')}
          ></InfoContainer>
        )}
        {bookings && (
          <>
            <Typography align="left" variant="h4">
              Active Bookings
            </Typography>
            <ActiveBookingTable
              listing={listing}
              setBookings={setBookings}
              allBookings={bookings}
              bookings={bookings.filter((booking) => booking.status === 'pending')}
            ></ActiveBookingTable>
            <Typography align="left" variant="h4">
              Bookings History
            </Typography>
            <BookingsHistoryTable
              bookings={bookings.filter((booking) => booking.status !== 'pending')}
            ></BookingsHistoryTable>
          </>
        )}
      </Container>
    </>
  );
};

export default HostedListingInfo;
