import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useHistory } from 'react-router';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { editListingSchema } from '../../validation/schema/validationSchemas';
import { AlertMsg } from '../alerts';
import { propertyTypes } from '../../utils/propertyTypes';
import amenityList from '../../utils/amenityList';
import { Box } from '@mui/system';
import { fileToDataUrl, getBedroomTotals } from '../../utils/helper';
import { createListing } from '../../service/api';

const styles = {
  paper: {
    padding: 5,
    height: 'fit-content',
    margin: '20px auto',
    width: {
      sm: '600px',
      md: '769px',
    },
  },
  inputLarge: { my: 2 },
  inputSmall: {
    my: 2,
    mr: 2,
    width: { xs: '100%', sm: '20ch' },
  },
  headings: { mt: 2 },
  stack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    spacing: 2,
  },
  amenities: {
    padding: 3,
  },
  amenity: {
    width: '150px',
  },
  thumbnail: {
    width: '100%',
  },
  imgContainer: {
    width: '150px',
    position: 'relative',
    m: 2,
  },
  thumbnailEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  alert: {
    position: 'fixed',
    top: 50,
  },
  saveBtn: {
    width: '100%',
  },
};

const NewListingForm = () => {
  const history = useHistory();
  // alert to show for errors and on success
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  //   form values
  const [price, setPrice] = useState(0);
  const [bathrooms, setBathrooms] = useState(0);
  const [parking, setParking] = useState(0);
  const [type, setType] = useState('house');
  const [state, setState] = useState('');
  const [bedrooms, setBedrooms] = useState([]);
  const [amenities, setAmenities] = useState(amenityList.map((amenity) => ({ [amenity]: false })));
  const [thumbnail, setThumbnail] = useState('');
  const [imagesList, setImagesList] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editListingSchema),
  });
  const updateBeds = (e, idx) => {
    const newBeds = [...bedrooms];
    newBeds[idx].beds = parseInt(e.target.value) || 0;
    setBedrooms(newBeds);
  };

  const addBed = () => {
    const newBeds = [...bedrooms];
    newBeds.push({ beds: 0 });
    setBedrooms(newBeds);
  };

  const removeBed = (idx) => {
    let newBeds = [...bedrooms];
    newBeds = bedrooms.filter((bed, index) => index !== parseInt(idx));
    setBedrooms(newBeds);
  };

  const updateAmenities = (name, value) => {
    const newAmenities = amenities.map((amenity) => {
      const [key] = Object.keys(amenity);
      if (key === name) {
        amenity[key] = !value;
        return amenity;
      } else {
        return amenity;
      }
    });
    setAmenities(newAmenities);
  };

  const updateThumbnail = async (e) => {
    const file = e.target.files[0];
    const img = await fileToDataUrl(file);
    setThumbnail(img);
  };

  const addImage = async (e) => {
    const newImagesList = [...imagesList];
    const images = e.target.files;
    let newImages = await Object.entries(images).map(async ([_idx, img]) => {
      const imgUrl = await fileToDataUrl(img);
      return imgUrl;
    });
    newImages = await Promise.all(newImages);
    newImagesList.push(...newImages);
    setImagesList(newImagesList);
    e.target.value = null;
  };

  const deleteImage = (idx) => {
    const newImageList = [...imagesList];
    newImageList.splice(idx, 1);
    setImagesList(newImageList);
  };

  const onSubmit = async (data) => {
    const { title, number, street, suburb, country } = data;
    const { beds, bedrooms: totalBedrooms } = getBedroomTotals(bedrooms);
    // convert amenities to an object
    let amenitiesObj = amenities.flatMap(Object.entries);
    amenitiesObj = Object.fromEntries(amenitiesObj);
    const newListing = {
      title: title,
      address: {
        street_number: number,
        street_name: street,
        suburb: suburb,
        state: state,
        country: country,
      },
      thumbnail: thumbnail,
      price: price,
      metadata: {
        bedroomsTotal: totalBedrooms,
        bedsTotal: beds,
        type: type,
        bathrooms: bathrooms,
        parking: parking,
        imagesList: imagesList,
        amenities: amenitiesObj,
        bedrooms: bedrooms,
      },
    };
    const res = await createListing(newListing);
    if (res.status === 200) {
      setAlertMessage('Listing successfully saved!');
      setSuccess(true);
      setShowAlert(true);
      setTimeout(() => history.push('/user/listings'), 1000);
    } else {
      setAlertMessage(res.data.error);
      setSuccess(false);
      setShowAlert(true);
    }
  };
  return (
    <>
      <AlertMsg
        message={alertMessage}
        isOpen={showAlert}
        setIsOpen={setShowAlert}
        success={success}
        style={styles.alert}
      ></AlertMsg>
      <Container>
        <Paper elevation={10} sx={styles.paper}>
          <form
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit(onSubmit)();
              }
            }}
          >
            <Typography variant="h6" color="initial">
              Details
            </Typography>
            <Divider light />
            <TextField
              required
              name="title"
              label="Title"
              fullWidth
              variant="standard"
              sx={styles.inputLarge}
              error={!!errors.title}
              helperText={errors.title?.message}
              {...register('title')}
            />
            <div>
              <TextField
                name="price"
                label="Price"
                value={price}
                variant="standard"
                onChange={(e) => setPrice(parseInt(e.target.value) || 0)}
                sx={styles.inputSmall}
                type="text"
                required
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <TextField
                required
                name="bathrooms"
                label="Bathrooms"
                value={bathrooms}
                variant="standard"
                onChange={(e) => setBathrooms(parseInt(e.target.value) || 0)}
                sx={styles.inputSmall}
                type="text"
              />
              <TextField
                name="parking"
                required
                label="Parking"
                value={parking}
                variant="standard"
                onChange={(e) => setParking(parseInt(e.target.value) || 0)}
                sx={styles.inputSmall}
                type="text"
              />
              <FormControl variant="standard" sx={styles.inputSmall}>
                <InputLabel id="property-type">Property Type</InputLabel>
                <Select
                  labelId="add-property-type"
                  id="addPropertyType"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  label="Property Type"
                >
                  {propertyTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <Typography variant="h6" color="initial">
              Address
            </Typography>
            <Divider light />
            <TextField
              required
              name="number"
              label="Number"
              variant="standard"
              sx={styles.inputSmall}
              error={!!errors.number}
              helperText={errors.number?.message}
              {...register('number')}
            />
            <TextField
              required
              name="Street"
              label="Street name"
              variant="standard"
              sx={styles.inputSmall}
              error={!!errors.street}
              helperText={errors.street?.message}
              {...register('street')}
            />
            <TextField
              required
              name="suburb"
              label="Suburb"
              variant="standard"
              sx={styles.inputSmall}
              error={!!errors.suburb}
              helperText={errors.suburb?.message}
              {...register('suburb')}
            />
            <TextField
              name="state"
              label="State"
              value={state}
              variant="standard"
              onChange={(e) => setState(e.target.value)}
              sx={styles.inputSmall}
              type="text"
            />
            <TextField
              required
              name="country"
              label="Country"
              variant="standard"
              sx={styles.inputSmall}
              error={!!errors.country}
              helperText={errors.country?.message}
              {...register('country')}
            />
            <Typography variant="h6" color="initial">
              Bedrooms
            </Typography>
            <Divider light />
            <Grid container>
              {bedrooms.map((bedroom, idx) => (
                <div key={idx}>
                  <Stack sx={styles.stack}>
                    <Typography variant="body1" color="initial">
                      Bedroom {idx + 1}
                    </Typography>
                    <IconButton aria-label="remove bedroom" onClick={() => removeBed(idx)}>
                      <DeleteIcon fontSize="small"></DeleteIcon>
                    </IconButton>
                  </Stack>
                  <TextField
                    name={`bedroom${idx + 1}`}
                    label="beds"
                    value={bedrooms[idx].beds}
                    variant="standard"
                    onChange={(e) => updateBeds(e, idx)}
                    sx={styles.inputSmall}
                    type="text"
                  />
                </div>
              ))}
            </Grid>
            <Button
              id="newBedroomBtn"
              sx={{ mt: 2 }}
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addBed}
            >
              Add Bed
            </Button>
            <Typography variant="h6" color="initial" sx={styles.headings}>
              Amenities
            </Typography>
            <Divider light />
            <FormGroup>
              <Grid container sx={styles.amenities}>
                {amenities.map((amenity) => {
                  const [name, value] = Object.entries(amenity)[0];
                  return (
                    <FormControlLabel
                      sx={styles.amenity}
                      key={name}
                      control={<Checkbox checked={value} />}
                      label={name}
                      onChange={() => updateAmenities(name, value)}
                    />
                  );
                })}
              </Grid>
            </FormGroup>
            <Typography variant="h6" color="initial">
              Thumbnail
            </Typography>
            <Divider light />
            <Grid container justifyContent="center">
              {thumbnail && (
                <Grid item sx={styles.imgContainer}>
                  <Box component="img" src={thumbnail} sx={styles.thumbnail}></Box>
                  <label htmlFor="newListingUpdateThumbnail">
                    <input
                      onChange={(e) => updateThumbnail(e)}
                      accept="image/*"
                      id="newListingUpdateThumbnail"
                      type="file"
                      hidden
                    />
                    <IconButton
                      color="primary"
                      aria-label="edit thumbnail"
                      component="span"
                      sx={styles.thumbnailEdit}
                    >
                      <EditIcon />
                    </IconButton>
                  </label>
                </Grid>
              )}
              {!thumbnail && (
                <Grid item sx={styles.imgContainer} align="center">
                  <Button
                    variant="contained"
                    component="label"
                    startIcon={<CameraAltIcon></CameraAltIcon>}
                    aria-label="add thumbnail"
                  >
                    Upload
                    <input type="file" hidden onChange={(e) => updateThumbnail(e)} />
                  </Button>
                </Grid>
              )}
            </Grid>
            <Typography variant="h6" color="initial">
              Image List
            </Typography>
            <Divider light />
            <Grid container justifyContent="center">
              {imagesList.length !== 0 &&
                imagesList.map((image, idx) => (
                  <Grid key={idx} item sx={styles.imgContainer}>
                    <Box component="img" src={image} sx={styles.thumbnail}></Box>
                    <IconButton
                      color="error"
                      aria-label="delete image"
                      component="span"
                      sx={styles.thumbnailEdit}
                      onClick={() => deleteImage(idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                ))}
              <Grid item sx={styles.imgContainer} align="center">
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CameraAltIcon></CameraAltIcon>}
                >
                  Upload
                  <input name="thumbnailUpload" type="file" hidden onChange={(e) => addImage(e)} multiple />
                </Button>
              </Grid>
            </Grid>
          </form>
          <Divider light />
          <Grid container sx={{ mt: 2 }} justifyContent="center">
            <Button
            id="submitNewListingBtn"
              size="large"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
              sx={styles.saveBtn}
            >
              Save
            </Button>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default NewListingForm;
