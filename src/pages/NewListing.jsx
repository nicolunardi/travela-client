import { Typography } from '@mui/material';
import React from 'react';
import { NewListingForm } from '../components/newListings';

const newListing = () => {
  return (
    <>
      <Typography variant="h2" align="center" color="initial">
        New Listing
      </Typography>
      <NewListingForm></NewListingForm>
    </>
  );
};

export default newListing;
