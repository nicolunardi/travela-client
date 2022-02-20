import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemText, Paper } from '@mui/material';
import { getDaysBooked, getLiveTime, getReadableAddress, getTotalProfit } from '../../utils/helper';

const styles = {
  paper: { width: '100%', my: 2 },
};

const InfoContainer = ({ listing, bookings }) => {
  return (
    <Paper sx={styles.paper}>
      <List dense>
        <ListItem>
          <ListItemText primary={`Title: ${listing.title}`} />
        </ListItem>
        <ListItem>
          <ListItemText primary={`Address: ${getReadableAddress(listing.address)}`} />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Live time: ${
              listing.published ? getLiveTime(listing.postedOn) + ' day/s' : 'not live'
            }`}
            secondary="How many days the listing has been live for this year."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Days booked: ${bookings.length ? getDaysBooked(bookings) : 'No data yet'}`}
            secondary="How many days the listing has been booked for this year. Counts accepted bookings only."
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary={`Profit: $${bookings.length ? getTotalProfit(bookings) : 0}`}
            secondary="How much profit this listing has made you this year."
          />
        </ListItem>
      </List>
    </Paper>
  );
};

InfoContainer.propTypes = {
  listing: PropTypes.object,
  bookings: PropTypes.array,
};

export default InfoContainer;
