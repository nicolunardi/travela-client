import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Collapse,
  IconButton,
  Typography,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import { Box } from '@mui/system';
import { RatingContainer, CardMainIcons, CardAmenityContainer, CardDropdownMenu } from '.';
import defaultHouse from '../../assets/images/defaultHouse.jpeg';

const styles = {
  cardStyle: { width: '100%', maxWidth: 320, minWidth: 320, mx: 'auto', minHeight: 400 },
  imgContainer: { position: 'relative' },
  cardMainInfo: { display: 'flex', justifyContent: 'space-between' },
  cardContent: { display: 'flex', justifyContent: 'start', alignItems: 'center' },
  collapse: { maxWidth: '100%' },
  liveChip: { position: 'absolute', top: 0, right: 0 },
};

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const UserListingCard = ({ listing, setListings, listings }) => {
  const {
    reviews,
    metadata,
    metadata: { amenities },
  } = listing;
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Grid item>
      <Card sx={styles.cardStyle}>
        <CardHeader
          action={
            <CardDropdownMenu
              aria-label="more options"
              listingId={listing.id}
              setListings={setListings}
              listings={listings}
              published={listing.published}
            ></CardDropdownMenu>
          }
          title={<Typography variant="h6">{listing.title}</Typography>}
          subheader={`$${listing.price} per night`}
        />
        <Box sx={styles.imgContainer}>
          <CardMedia
            component="img"
            height="194"
            image={listing.thumbnail || defaultHouse}
            alt="house thumbnail"
          />
          {listing.published && (
            <Chip
              icon={<CheckCircleOutlinedIcon />}
              color="success"
              label="Live"
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
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardContent>
        <Collapse in={expanded} timeout="auto" unmountOnExit sx={styles.collapse}>
          <CardAmenityContainer amenities={amenities}></CardAmenityContainer>
        </Collapse>
      </Card>
    </Grid>
  );
};

UserListingCard.propTypes = {
  listing: PropTypes.object,
  setListings: PropTypes.func,
  listings: PropTypes.array,
};

export default UserListingCard;
