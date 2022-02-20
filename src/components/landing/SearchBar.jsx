import React from 'react';
import PropTypes from 'prop-types';
import { Container, TextField } from '@mui/material';
import { filterResultsFromSearch } from '../../utils/helper';

const styles = {
  container: { my: 2 },
  searchBar: { width: { xs: '100%', sm: 400 } },
  input: { borderRadius: '25px', px: 2 },
};

const SearchBar = ({ listings, searchTerms, setSearchTerms, setSearchedListings }) => {
  const handleValueChange = ({ target: { value } }) => {
    setSearchTerms(value);
    // only filter results if the search is longer than 2 characters
    if (value.length > 2) {
      const searchResults = filterResultsFromSearch(listings, value);
      setSearchedListings(searchResults);
    } else {
      setSearchedListings(null);
    }
  };

  return (
    <Container sx={styles.container} align="center">
      <TextField
        label="Search"
        value={searchTerms}
        onChange={(e) => handleValueChange(e)}
        sx={styles.searchBar}
        InputProps={{ sx: styles.input }}
      />
    </Container>
  );
};

SearchBar.propTypes = {
  listings: PropTypes.array,
  searchTerms: PropTypes.string,
  setSearchTerms: PropTypes.func,
  setSearchedListings: PropTypes.func,
};

export default SearchBar;
