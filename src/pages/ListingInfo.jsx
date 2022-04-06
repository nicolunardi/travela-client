import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Grid, Divider, Button } from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import { getBookings, getListing, newReview } from '../service/api';
import { ImageItem, ReviewContainer } from '../components/listingInfo';
import {
  capitalize,
  findBooking,
  getReadableAddress,
  getTotalCost,
  getUserBookingsObjects,
} from '../utils/helper';
import { CardAmenityContainer, RatingContainer } from '../components/hostedListings';
import { BookingForm } from '../components/forms';
import { UserContext } from '../contexts/UserContext';
import { Box } from '@mui/system';
import { ReviewModal } from '../components/modals';
import DefaultHouseImg from '../assets/images/defaultHouse.jpeg';

const styles = {
  carouselContainer: {
    minHeight: '200px !important',
  },
  box: {
    display: 'flex',
    justifyContent: 'space-between',
  },
};

const bookingStatusText = {
  pending: { text: 'Your booking is pending', color: 'primary.main' },
  accepted: { text: 'Your booking has been accepted', color: 'success.main' },
  declined: { text: 'Your booking has been declined', color: 'error.main' },
};

const ListingInfo = () => {
  const { id, start, end } = useParams();
  const { user } = useContext(UserContext);
  const [listing, setListing] = useState(null);
  const [startDate, setStartDate] = useState(start ? new Date(start) : null);
  const [endDate, setEndDate] = useState(end ? new Date(end) : null);
  const [userBooking, setUserBooking] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(async () => {
    const res = await getListing(id);
    if (res.status >= 200 && res.status < 300) {
      // get the user booking info for the listing if it exists
      if (user.token) {
        const res = await getBookings();
        if (res.status >= 200 && res.status < 300) {
          const bookings = getUserBookingsObjects(res.data.bookings);
          const userBooking = findBooking(bookings, id);
          if (userBooking) {
            setUserBooking(userBooking);
          }
        }
      }
      const allImages = [];
      if (res.data.thumbnail) {
        allImages.push(res.data.thumbnail);
      }
      if (res.data.metadata.images.length > 0) {
        for (const image of res.data.metadata.images) {
          allImages.push(image.image);
        }
      }
      if (allImages.length === 0) {
        allImages.push(DefaultHouseImg);
      }
      setImages(allImages);
      setListing(res.data);
    }
  }, []);

  // opens the review modal to leave a review
  const handleOpenReviewModal = () => {
    setShowReviewModal(true);
  };

  const handlePostReview = async (rating, message) => {
    if (rating && message) {
      const body = { review: { text: message, rating: rating } };
      const res = await newReview(id, userBooking.id, body);
      if (res.status >= 200 && res.status < 300) {
        const newReviews = listing.reviews.concat(res.data);
        setShowReviewModal(false);
        setListing({ ...listing, reviews: newReviews });
      }
    }
  };

  return (
    <>
      {listing && (
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="h4">{capitalize(listing.title)}</Typography>
              <RatingContainer reviews={listing.reviews} />
              <Carousel sx={styles.carouselContainer}>
                {images.map((image, idx) => (
                  <ImageItem key={idx} image={image}></ImageItem>
                ))}
              </Carousel>
              <Typography variant="caption">
                {capitalize(listing.metadata.type)} Hosted by {capitalize(listing.owner_name)}
              </Typography>
              <Typography variant="caption"> at {getReadableAddress(listing.address)}</Typography>
              <Divider light></Divider>
              <Typography>
                {listing.metadata.total_bedrooms} Bedrooms · {listing.metadata.total_beds} Beds ·{' '}
                {listing.metadata.bathrooms} Bathrooms · {listing.metadata.parking} Parking
              </Typography>
              <Divider light></Divider>
              <Typography>
                $
                {startDate && endDate
                  ? `${getTotalCost(listing.price, {
                      start: startDate,
                      end: endDate,
                    })} for the stay`
                  : `${listing.price} per night`}
              </Typography>
              <Divider light></Divider>
              {user.token && userBooking && (
                <Typography color={bookingStatusText[userBooking.status].color}>
                  {bookingStatusText[userBooking.status].text}
                </Typography>
              )}
              <Typography variant="h6">Amenities</Typography>
              <CardAmenityContainer amenities={listing.metadata.amenities}></CardAmenityContainer>
            </Grid>
            <Grid item xs={12} sm={6}>
              <BookingForm
                start={start}
                end={end}
                price={listing.price}
                listingId={id}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider light></Divider>
              <Box sx={styles.box}>
                <Typography my={2} variant="h6">
                  Reviews
                </Typography>
                {userBooking.status === 'accepted' && (
                  <Button onClick={handleOpenReviewModal}>Write Review</Button>
                )}
              </Box>
              {!listing.reviews.length && <Typography>No reviews yet</Typography>}
              {!!listing.reviews.length &&
                listing.reviews.map((review, idx) => <ReviewContainer key={idx} review={review} />)}
            </Grid>
            {showReviewModal && (
              <ReviewModal
                isOpen={showReviewModal}
                setIsOpen={setShowReviewModal}
                handlePost={handlePostReview}
              ></ReviewModal>
            )}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default ListingInfo;
