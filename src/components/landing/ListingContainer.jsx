import { Container, Grid } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { ListingCard } from '.';
import homeLoading from '../../assets/svg/homeLoading.svg';
import { LoadingContainer } from '../loading';

const styles = {
  container: { my: 4 },
};

const ListingContainer = ({ bookedListings, otherListings, showBookedListings, dateRange }) => {
  const loadedContent = (
    <>
      {showBookedListings &&
        bookedListings &&
        bookedListings.map((listing, idx) => (
          <ListingCard key={idx} listing={listing} isBooked dateRange={dateRange}></ListingCard>
        ))}
      {otherListings &&
        otherListings.map((listing, idx) => (
          <ListingCard key={idx} listing={listing} dateRange={dateRange}></ListingCard>
        ))}
    </>
  );

  return (
    <Container sx={styles.container}>
      <Grid container spacing={2} justifyContent="center">
        {(bookedListings || otherListings) && loadedContent}
        {!bookedListings && !otherListings && (
          <LoadingContainer image={homeLoading}></LoadingContainer>
        )}
      </Grid>
    </Container>
  );
};

ListingContainer.propTypes = {
  bookedListings: PropTypes.array,
  otherListings: PropTypes.array,
  showBookedListings: PropTypes.bool,
  dateRange: PropTypes.object,
};

export default ListingContainer;
