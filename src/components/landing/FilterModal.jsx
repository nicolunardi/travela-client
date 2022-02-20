import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import FilterForm from '../forms/FilterForm';

const FilterModal = ({
  isOpen,
  setIsOpen,
  filteredListings,
  setFilteredListings,
  searchTerms,
  setIsFiltered,
  otherListings,
  setDateRange,
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Filter the Results</DialogTitle>
        <FilterForm
          handleClose={handleClose}
          setFilteredListings={setFilteredListings}
          filteredListings={filteredListings}
          searchTerms={searchTerms}
          setIsFiltered={setIsFiltered}
          otherListings={otherListings}
          setDateRange={setDateRange}
        ></FilterForm>
      </Dialog>
    </div>
  );
};

FilterModal.propTypes = {
  isOpen: PropTypes.bool,
  setIsOpen: PropTypes.func,
  setFilteredListings: PropTypes.func,
  setIsFiltered: PropTypes.func,
  filteredListings: PropTypes.array,
  searchTerms: PropTypes.string,
  otherListings: PropTypes.array,
  setDateRange: PropTypes.func,
};

export default FilterModal;
