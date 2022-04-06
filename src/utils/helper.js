import {
  format,
  differenceInCalendarDays,
  compareAsc,
  differenceInCalendarYears,
  lastDayOfYear,
  isWithinInterval,
} from 'date-fns';
import { IGNORED_TERMS } from './ignoredTerms';

export const fileToDataUrl = (file) => {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
};

export const calculateRating = (reviews) => {
  if (!reviews.length) {
    return 0;
  }
  const total = reviews.reduce((prev, next) => prev + next.rating, 0);
  const rating = total / reviews.length;
  return Math.round(rating * 10) / 10;
};

/**
 * Calculates the total number of beds and bedrooms in a listing
 *
 * @param {Object} bedrooms - the bedrooms object of a listing
 * @return {*}
 */
export const getBedroomTotals = (bedrooms) => {
  const bedroomInfo = { beds: 0, bedrooms: 0 };
  for (const bedroom of bedrooms) {
    bedroomInfo.beds += bedroom.beds;
    bedroomInfo.bedrooms++;
  }
  return bedroomInfo;
};
/**
 * Checks if the date ranges are valid. If the first date is after or
 * equal to the second date it returns false, else true
 *
 * @param {Date} date1 - First Date Object to compare
 * @param {Date} date2 - Second Date Object to compare
 * @return {Bool}
 */
export const isValidDateRange = (date1, date2) => {
  return compareAsc(date1, date2) < 0;
};

/**
 *  filters the bookings array by the logged in user and returns the
 * listing ids associated with each booking
 *
 * @param {Array} bookings - the array of all bookings
 */
export const getUserBookings = (bookings) => {
  const owner = localStorage.getItem('id');
  const userBookings = bookings.filter((booking) => booking.owner_id === parseInt(owner));
  return userBookings.map((booking) => booking.listing_id);
};

/**
 * searches the array of bookings, to find a booking that matched the listing id
 *
 * @param {array} bookings - array of bookings objects
 * @param {string} listingId - the listing id to search booking for
 * @return {object} - returns the booking if found
 */
export const findBooking = (bookings, listingId) => {
  const allUserBookings = bookings.filter((booking) => booking.listing_id === parseInt(listingId));
  if (allUserBookings.length) {
    const acceptedBooking = allUserBookings.find((booking) => booking.status === 'accepted');
    if (acceptedBooking) {
      return acceptedBooking;
    }
  } else {
    return undefined;
  }
};

/**
 *  filters the bookings array by the logged in user and returns the
 * bookings
 *
 * @param {Array} bookings - the array of all bookings
 */
export const getUserBookingsObjects = (bookings) => {
  const owner = localStorage.getItem('id');
  return bookings.filter((booking) => booking.owner_id === parseInt(owner));
};

/**
 *  filters the bookings array by the listing id
 *
 * @param {array} bookings - the array of all bookings
 * @param {string} listingId - listing id to filter with
 * @return {array} - array of all the bookings associated with a listing
 */
export const getBookingsByListing = (bookings, listingId) => {
  return bookings.filter((booking) => booking.listing_id === listingId);
};

/**
 *  sorts newListings by title alphabetically
 *
 * @param {Array} listings - array of listings
 */
export const sortListingsAlphabetically = (listings) => {
  const newListings = [...listings];
  newListings.sort((listing1, listing2) =>
    listing1.title.toUpperCase() > listing2.title.toUpperCase() ? 1 : -1,
  );
  return newListings;
};

/**
 *  Matches the term against properties of a listing and returns true if any match
 *
 * @param {object} listing - the listing object
 * @param {string} term - the search term
 * @return {Bool}
 */
const matchedSearchCriteria = (listing, term) => {
  // return if the search term is in the ignored terms array
  if (IGNORED_TERMS.includes(term) || term.length <= 2) {
    return false;
  }
  const {
    title,
    address: { street_name: street, suburb, state, country },
  } = listing;

  return (
    title.toLowerCase().includes(term) ||
    street.toLowerCase().includes(term) ||
    suburb.toLowerCase().includes(term) ||
    state.toLowerCase().includes(term) ||
    country.toLowerCase().includes(term)
  );
};

/**
 * Matches search terms against certain properties of a listing and filters the listing.
 * Returns the filtered listings
 *
 * @param {Array} listings - array containing all listings
 * @param {string} searchTerms - a string containing all the search terms
 */
export const filterResultsFromSearch = (listings, searchTerms) => {
  const terms = searchTerms.toLowerCase().split(' ');
  listings = listings.filter((listing) => {
    let found = false;
    for (const term of terms) {
      if (matchedSearchCriteria(listing, term)) {
        found = true;
        break;
      } else {
        found = false;
      }
    }
    return found;
  });
  return listings;
};

/**
 *  sorts the listings array by their ratings
 *
 * @param {array} listings - array of listings to sort
 * @param {string} order - the order to be sorted by
 * @return {array} - the sorted listings array, sorted by rating
 */
export const sortByRating = (listings, order) => {
  const newListings = [...listings];
  newListings.sort(
    (listing1, listing2) => calculateRating(listing1.reviews) - calculateRating(listing2.reviews),
  );
  if (order === 'descending') {
    newListings.reverse();
  }
  return newListings;
};

/**
 * Returns a readable address from the address object in the listing
 *
 * @param {Object} {
 *   street_number: number,
 *   street_name: street,
 *   suburb,
 *   state,
 *   country,
 * }
 * @return {string}
 */
export const getReadableAddress = ({
  street_number: number,
  street_name: street,
  suburb,
  state,
  country,
}) => {
  const address = `${number} ${street}, ${suburb}${state ? ', ' + state : ''}, ${country}`;
  return capitalize(address);
};

/**
 *  Takes a series of words and capitalizes the first letter of each word
 *
 * @param {string} string - the string to capitalize
 * @return {string} - the capitalized string
 */
export const capitalize = (string) => {
  let words = string.split(' ');
  words = words.map((word) => `${word[0].toUpperCase()}${word.slice(1)}`);
  return words.join(' ');
};

/**
 * calculates the total cost for the stay period
 *
 * @param {number} price - the price per night for the listing
 * @param {object} dateRange - the dates to book for, start and end.
 * @return {number} - returns the total cost for the booking
 */
export const getTotalCost = (price, dateRange) => {
  return getDuration(dateRange) * price;
};

/**
 * gets the difference between last date and first date
 *
 * @param {object} dateRange - the dates to book for, start and end.
 * @return {number} - the duration of the stay
 */
export const getDuration = (dateRange) => {
  const duration = differenceInCalendarDays(dateRange.end, dateRange.start);
  return duration;
};

/**
 * returns a readable date in the form of dd/mm/yyyy
 *
 * @param {Date} date - a date object
 * @return {string} - formatted string representing the date
 */
export const formatDate = (date) => {
  return format(date, 'dd/MM/yyyy');
};

/**
 * calculate the number of days a listing has been live for
 *
 * @param {string} postedOn - ISO string of date the listing was posted on
 * @return {number} - number of days the listing has been live
 */
export const getLiveTime = (postedOn) => {
  const start = new Date(postedOn);
  const end = new Date(Date.now());
  return differenceInCalendarDays(end, start);
};

/**
 * Calculates the number of days a listing has been booked for this year
 *
 * @param {array} bookings - list of all bookings
 * @return {number} - the number of days a listing has been booked
 */
export const getDaysBooked = (bookings) => {
  return bookings.reduce((prev, curr) => {
    const start = new Date(curr.start);
    const end = new Date(curr.end);
    // used to check that the booking is within the current year
    const yearEnd = lastDayOfYear(new Date());
    if (differenceInCalendarYears(yearEnd, start) !== 0) {
      return 0;
    } else {
      return prev + differenceInCalendarDays(end, start);
    }
  }, 0);
};

/**
 *  calculates the profit made from bookings for the current year
 *
 * @param {array} bookings - list of all bookings
 * @return {number} - profit made
 */
export const getTotalProfit = (bookings) => {
  return bookings.reduce((prev, curr) => {
    // check the booking falls within the current year
    const start = new Date(curr.start);
    const yearEnd = lastDayOfYear(new Date());
    if (differenceInCalendarYears(yearEnd, start) !== 0) {
      return 0;
    } else {
      return prev + curr.total;
    }
  }, 0);
};

/**
 *  checks if a date falls within a particular range of dates
 *
 * @param {object} dateRange - the dateRange object
 * @param {string} date - the date to check if it falls within the dateRange
 * @return {bool}
 */
export const isDateWithinRange = (dateRange, date) => {
  dateRange.start = new Date(dateRange.start);
  dateRange.end = new Date(dateRange.end);
  date = new Date(date);
  dateRange.start.setHours(0, 0, 0, 0);
  dateRange.end.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  const x = isWithinInterval(date, dateRange);
  return x;
};

/**
 * Checks if the booking date range falls within any of the dates
 * within the availability list of the listing
 *
 * @param {array} availability - the availability list for the listing
 * @param {object} dateRange - the date range of the booking
 * @return {bool}
 */
export const checkDatesAgainstAvailability = (availability, dateRange) => {
  for (const dates of availability) {
    if (isDateWithinRange(dates, dateRange.start) && isDateWithinRange(dates, dateRange.end)) {
      return true;
    }
  }
  return false;
};

export const getDatefromDatetime = (datetime) => {
  return datetime.toISOString().split('T')[0];
};
