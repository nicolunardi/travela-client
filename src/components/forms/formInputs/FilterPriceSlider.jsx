import React from 'react';
import PropTypes from 'prop-types';
import { DialogContentText, Slider } from '@mui/material';

const FilterPriceSlider = ({ minValue, maxValue, setMinValue, setMaxValue }) => {
  const setPriceText = (price) => {
    return price === 2000 ? `> $ ${price}` : `$ ${price}`;
  };

  const setValues = (e, newValue) => {
    setMinValue(newValue[0]);
    setMaxValue(newValue[1]);
  };
  return (
    <div>
      <DialogContentText>Name your price</DialogContentText>
      <Slider
        getAriaLabel={() => 'price range'}
        value={[minValue, maxValue]}
        step={50}
        min={0}
        max={2000}
        onChange={setValues}
        valueLabelDisplay="auto"
        valueLabelFormat={setPriceText}
        getAriaValueText={(price) => `$${price}`}
      />
    </div>
  );
};

FilterPriceSlider.propTypes = {
  minValue: PropTypes.number,
  maxValue: PropTypes.number,
  setMinValue: PropTypes.func,
  setMaxValue: PropTypes.func,
};

export default FilterPriceSlider;
