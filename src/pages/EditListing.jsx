import { Typography } from '@mui/material';
import React from 'react';
import { EditListingForm } from '../components/editListings';

const EditListing = () => {
  return (
    <>
      <Typography variant="h2" align="center" color="initial">
        Edit Listing
      </Typography>
      <EditListingForm></EditListingForm>
    </>
  );
};

export default EditListing;
