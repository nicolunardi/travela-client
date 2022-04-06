import { Button, Grid } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { ListingContainer, SearchBar } from '../components/landing/';
import { UserContext } from '../contexts/UserContext';
import { getBookings, getListing, getListings } from '../service/api';
import { getUserBookings, sortListingsAlphabetically } from '../utils/helper';
import { FilterModal } from '../components/landing';

const Landing = () => {
  const { user } = useContext(UserContext);
  const [otherListings, setOtherListings] = useState(null);
  const [bookedListings, setBookedListings] = useState(null);
  const [filteredListings, setFilteredListings] = useState(null);
  const [searchedListings, setSearchedListings] = useState(null);
  const [showBookedListings, setShowBookedListings] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [searchTerms, setSearchTerms] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);
  const [dateRange, setDateRange] = useState(null);

  useEffect(async () => {
    let bookings = [];
    let listings = [];
    const booked = [];
    const others = [];

    const res = await getListings();
    if (res.status >= 200 && res.status < 300) {
      for (const listing of res.data.listings) {
        const res = await getListing(listing.id);
        if (res.status >= 200 && res.status < 300) {
          listings.push({ ...res.data, id: listing.id });
          listings = listings.filter((listing) => listing.published);
          listings = sortListingsAlphabetically(listings);
        } else {
          //   TODO ERROR POPUP
        }
      }
      // if user is logged in, get booked listings and show them first
      if (user.token) {
        const res = await getBookings();
        if (res.status >= 200 && res.status < 300) {
          bookings = getUserBookings(res.data.bookings);
          if (bookings.length) {
            for (const listing of listings) {
              if (bookings.includes(listing.id)) {
                booked.push(listing);
              } else {
                others.push(listing);
              }
            }
          } else {
            others.push(...listings);
          }
        } else {
          // todo error popup
        }
      } else {
        others.push(...listings);
      }
      setOtherListings(others);
      setBookedListings(booked);
    } else {
      //   TODO ERROR POPUP
    }
  }, [user]);

  return (
    <>
      <Grid align="center">
        <Button onClick={() => setShowBookedListings(!showBookedListings)}>
          {showBookedListings ? 'Hide booked' : 'Show booked'}
        </Button>
        <Button align="center" onClick={() => setShowFilterModal(!showFilterModal)}>
          Show filters
        </Button>
      </Grid>
      <SearchBar
        listings={isFiltered ? filteredListings : otherListings}
        setFilteredListings={setFilteredListings}
        searchTerms={searchTerms}
        setSearchTerms={setSearchTerms}
        setSearchedListings={setSearchedListings}
      ></SearchBar>
      <ListingContainer
        bookedListings={bookedListings}
        otherListings={searchedListings || filteredListings || otherListings}
        showBookedListings={showBookedListings}
        dateRange={dateRange}
      ></ListingContainer>
      {showFilterModal && (
        <FilterModal
          isOpen={showFilterModal}
          setIsOpen={setShowFilterModal}
          setFilteredListings={setFilteredListings}
          filteredListings={otherListings}
          searchTerms={searchTerms}
          setIsFiltered={setIsFiltered}
          otherListings={otherListings}
          setDateRange={setDateRange}
        ></FilterModal>
      )}
    </>
  );
};

export default Landing;
