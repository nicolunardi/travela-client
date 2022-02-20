import React from 'react';
import PropTypes from 'prop-types';
import { DialogContentText, Slider } from '@mui/material';

const FilterBedroomSlider = ({ minValue, maxValue, setMinValue, setMaxValue }) => {
  const setBedroomsText = (bedrooms) => {
    return bedrooms === 5 ? `> ${bedrooms}` : `${bedrooms}`;
  };

  const setValues = (e, newValue) => {
    setMinValue(newValue[0]);
    setMaxValue(newValue[1]);
  };
  return (
    <div>
      <DialogContentText>How many bedrooms</DialogContentText>
      <Slider
        getAriaLabel={() => 'bedroom range'}
        value={[minValue, maxValue]}
        step={1}
        min={0}
        max={5}
        onChange={setValues}
        valueLabelDisplay="auto"
        valueLabelFormat={setBedroomsText}
        getAriaValueText={(bedrooms) => `${bedrooms}`}
      />
    </div>
  );
};

FilterBedroomSlider.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  setMinValue: PropTypes.func,
  setMaxValue: PropTypes.func,
};

export default FilterBedroomSlider;
