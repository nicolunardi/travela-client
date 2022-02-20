import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Tooltip } from '@mui/material';
import { Box } from '@mui/system';
import KingBedIcon from '@mui/icons-material/KingBed';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import BathtubIcon from '@mui/icons-material/Bathtub';

const styles = {
  box: { display: 'flex', mr: 2 },
};

const CardMainIcons = ({ metadata }) => {
  return (
    <>
      <Box sx={styles.box}>
        <Tooltip title="Beds">
          <KingBedIcon aria-label="beds" />
        </Tooltip>
        <Typography ml={1} variant="body2" color="initial">
          {metadata.bedsTotal}
        </Typography>
      </Box>
      <Box sx={styles.box}>
        <Tooltip title="Bathrooms">
          <BathtubIcon aria-label="bathrooms" />
        </Tooltip>
        <Typography ml={1} variant="body2" color="initial">
          {metadata.bathrooms}
        </Typography>
      </Box>
      <Box sx={styles.box}>
        <Tooltip title="Parking">
          <DirectionsCarIcon aria-label="parking" />
        </Tooltip>
        <Typography ml={1} variant="body2" color="initial">
          {metadata.parking}
        </Typography>
      </Box>
    </>
  );
};

CardMainIcons.propTypes = {
  metadata: PropTypes.object,
};

export default CardMainIcons;
