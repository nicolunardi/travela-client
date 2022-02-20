import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';
import { Grid, Card, CardHeader, CardMedia, CardContent, Typography, Chip } from '@mui/material';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { Box } from '@mui/system';
import { RatingContainer, CardMainIcons } from '../hostedListings';

const styles = {
  cardStyle: {
    width: '100%',
    maxWidth: 320,
    minWidth: 320,
    mx: 'auto',
    minHeight: 400,
    cursor: 'pointer',
  },
  imgContainer: { position: 'relative' },
  cardMainInfo: { display: 'flex', justifyContent: 'space-between' },
  cardContent: { display: 'flex', justifyContent: 'start', alignItems: 'center' },
  collapse: { maxWidth: '100%' },
  liveChip: { position: 'absolute', top: 0, right: 0 },
};

const ListingCard = ({ listing, isBooked, dateRange }) => {
  const history = useHistory();
  const { reviews, metadata } = listing;

  return (
    <Grid item>
      <Card
        sx={styles.cardStyle}
        onClick={() =>
          history.push(
            `/listings/${listing.id}/${dateRange ? dateRange.start + '/' + dateRange.end : ''}`,
          )
        }
      >
        <CardHeader
          title={<Typography variant="h6">{listing.title}</Typography>}
          subheader={`$${listing.price} per night`}
        />
        <Box sx={styles.imgContainer}>
          <CardMedia component="img" height="194" image={listing.thumbnail} alt="house thumbnail" />
          {isBooked && (
            <Chip
              icon={<CheckCircleOutlinedIcon />}
              color="success"
              label="Booked"
              sx={styles.liveChip}
            />
          )}
        </Box>
        <CardContent sx={{ pb: 0 }}>
          <Box sx={styles.cardMainInfo}>
            <Typography variant="body2" color="text.secondary">
              {metadata.type}
            </Typography>
            <RatingContainer reviews={reviews}></RatingContainer>
          </Box>
        </CardContent>
        <CardContent sx={styles.cardContent}>
          <CardMainIcons metadata={metadata}></CardMainIcons>
        </CardContent>
      </Card>
    </Grid>
  );
};

ListingCard.propTypes = {
  listing: PropTypes.object,
  isBooked: PropTypes.bool,
  dateRange: PropTypes.object,
};

export default ListingCard;
