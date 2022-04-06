import React, { useState } from 'react';
import { addDays, isWithinInterval } from 'date-fns';
import PropTypes from 'prop-types';
import DateAdapter from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
  Button,
  DialogContent,
  DialogContentText,
  Divider,
  DialogActions,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { isValidDateRange, filterResultsFromSearch, sortByRating } from '../../utils/helper';
import { FilterPriceSlider, FilterBedroomSlider, FilterDatePicker } from './formInputs';

const styles = {
  select: {
    my: 2,
  },
};

const FilterForm = ({
  handleClose,
  setFilteredListings,
  filteredListings,
  searchTerms,
  setIsFiltered,
  otherListings,
  setDateRange,
}) => {
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [maxBedrooms, setMaxBedrooms] = useState(3);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(550);
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(addDays(new Date(Date.now()), 3));
  const [sortBy, setSortBy] = useState('');
  const [errors, setErrors] = useState({ error: false, message: 'Enter valid dates' });

  const handleFilter = () => {
    if (!filteredListings.length) return;
    if (validateDates()) {
      let newListings = [...filteredListings];
      if (searchTerms) {
        newListings = filterResultsFromSearch(newListings, searchTerms);
      }
      newListings = filterByPrice(newListings);
      newListings = filterByBedrooms(newListings);
      newListings = filterByDate(newListings);
      if (sortBy) {
        newListings = sortByRating(newListings, sortBy);
      }
      setFilteredListings(newListings);
      setIsFiltered(true);
      setDateRange({ start: startDate, end: endDate });
      handleClose();
    }
  };

  const filterByPrice = (listings) => {
    if (!listings.length) {
      return listings;
    }
    return listings.filter(
      (listing) =>
        listing.price >= minPrice &&
        (maxPrice === 2000
          ? listing.price >= maxPrice || listing.price <= maxPrice
          : listing.price <= maxPrice),
    );
  };

  const filterByBedrooms = (listings) => {
    if (!listings.length) {
      return listings;
    }
    return listings.filter(
      (listing) =>
        listing.metadata.total_bedrooms >= minBedrooms &&
        (maxBedrooms === 5
          ? listing.metadata.total_bedrooms ||
            listing.metadata.total_bedrooms <= maxBedrooms >= maxBedrooms
          : listing.metadata.total_bedrooms <= maxBedrooms),
    );
  };

  const filterByDate = (listings) => {
    if (!listings.length) {
      return listings;
    }
    return listings.filter((listing) => {
      // check if the dates picked by the user lie within the availability of
      // each listing
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      let valid = false;
      for (const date of listing.availability) {
        const date1 = new Date(date.start);
        const date2 = new Date(date.end);
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);
        if (
          isWithinInterval(start, { start: date1, end: date2 }) &&
          isWithinInterval(end, { start: date1, end: date2 })
        ) {
          valid = true;
          break;
        } else {
          valid = false;
        }
      }
      return valid;
    });
  };

  // checks that the dates provided are valid, ie. first date comes before
  // second date and not empty
  const validateDates = () => {
    const newErrors = { ...errors };
    let noErrors = true;
    if (!isValidDateRange(new Date(startDate), new Date(endDate))) {
      newErrors.error = true;
      noErrors = false;
    } else {
      newErrors.error = false;
    }
    setErrors(newErrors);
    return noErrors;
  };

  const resetFilters = () => {
    setFilteredListings(otherListings);
    setDateRange(null);
    handleClose();
  };

  return (
    <>
      <DialogContent>
        <Container>
          <div>
            <LocalizationProvider dateAdapter={DateAdapter}>
              <DialogContentText>When would you like to go?</DialogContentText>
              <FilterDatePicker
                errors={errors}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                startDate={startDate}
                endDate={endDate}
              ></FilterDatePicker>
            </LocalizationProvider>
          </div>
          <FilterPriceSlider
            minValue={minPrice}
            maxValue={maxPrice}
            setMinValue={setMinPrice}
            setMaxValue={setMaxPrice}
          />
          <FilterBedroomSlider
            minValue={minBedrooms}
            maxValue={maxBedrooms}
            setMinValue={setMinBedrooms}
            setMaxValue={setMaxBedrooms}
          />
          <FormControl sx={styles.select} fullWidth>
            <InputLabel id="sort-by-rating-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-rating-label"
              id="sort-by-rating"
              value={sortBy}
              label="Sort by"
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="descending">Descending</MenuItem>
              <MenuItem value="ascending">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Container>
      </DialogContent>
      <Divider light />
      <DialogActions>
        <Button color="error" onClick={resetFilters}>
          Reset
        </Button>
        <Button color="success" onClick={handleFilter}>
          Submit
        </Button>
      </DialogActions>
    </>
  );
};

FilterForm.propTypes = {
  handleClose: PropTypes.func,
  setFilteredListings: PropTypes.func,
  setIsFiltered: PropTypes.func,
  filteredListings: PropTypes.array,
  searchTerms: PropTypes.string,
  otherListings: PropTypes.array,
  setDateRange: PropTypes.func,
};

export default FilterForm;
