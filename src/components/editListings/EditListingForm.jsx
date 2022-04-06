import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
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
import { getListing, updateListing } from '../../service/api';
import { editListingSchema } from '../../validation/schema/validationSchemas';
import defaultImage from '../../assets/images/emptyImage.png';
import { Box } from '@mui/system';
import { fileToDataUrl, getBedroomTotals } from '../../utils/helper';
import { AlertMsg } from '../alerts';
import { propertyTypes } from '../../utils/propertyTypes';

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
};

const EditListingForm = () => {
  const { id } = useParams();
  const history = useHistory();
  // alert to show for errors and on success
  const [success, setSuccess] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [listing, setListing] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(editListingSchema),
  });

  useEffect(async () => {
    const response = await getListing(id);
    if (response.status >= 200 && response.status < 300) {
      setListing(response.data);
    }
  }, []);

  const updateBeds = (e, idx) => {
    const newBeds = { ...listing };
    listing.metadata.bedrooms[idx].beds = parseInt(e.target.value) || 0;
    setListing(newBeds);
  };

  const addBed = () => {
    const newListing = { ...listing };
    newListing.metadata.bedrooms.push({ beds: 0 });
    setListing(newListing);
  };

  const removeBed = (idx) => {
    const newListing = { ...listing };
    newListing.metadata.bedrooms = newListing.metadata.bedrooms.filter(
      (bed, index) => index !== parseInt(idx),
    );
    setListing(newListing);
  };

  const updateAmenities = (amenity) => {
    const newListing = { ...listing };
    newListing.metadata.amenities[amenity[0]] = !amenity[1];
    setListing(newListing);
  };

  const updateThumbnail = async (e) => {
    const file = e.target.files[0];
    const img = await fileToDataUrl(file);
    setListing({ ...listing, thumbnail: img });
  };

  const addImage = async (e) => {
    const newListing = { ...listing };
    const images = e.target.files;
    let newImages = await Object.entries(images).map(async ([_idx, img]) => {
      const imgUrl = await fileToDataUrl(img);
      return { image: imgUrl };
    });
    newImages = await Promise.all(newImages);
    newListing.metadata.images.push(...newImages);
    setListing(newListing);
    e.target.value = null;
  };

  const deleteImage = (idx) => {
    const newListing = { ...listing };
    const images = listing.metadata.images;
    images.splice(idx, 1);
    newListing.metadata.images = images;
    setListing(newListing);
  };

  const onSubmit = async (data) => {
    const { title, number, street, suburb, country, postCode, state } = data;
    // data contains the data from the validated inputs
    const { thumbnail, price, metadata, address } = listing;
    const { beds, bedrooms } = getBedroomTotals(metadata.bedrooms);
    const updatedListing = {
      title: title,
      address: {
        ...address,
        street_number: number,
        street_name: street,
        suburb: suburb,
        post_code: postCode,
        country: country,
        state: state,
      },
      price: price,
      thumbnail: thumbnail,
      ...metadata,
      total_bedrooms: bedrooms,
      total_beds: beds,
    };

    const res = await updateListing(id, updatedListing);
    if (res.status >= 200 && res.status < 300) {
      setAlertMessage('Listing successfully saved!');
      setSuccess(true);
      setShowAlert(true);
      setTimeout(() => history.push('/user/listings'), 1000);
    } else {
      setAlertMessage(res.data.detail);
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
          {listing && (
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
                defaultValue={listing.title}
                variant="standard"
                sx={styles.inputLarge}
                error={!!errors.title}
                helperText={errors.title?.message}
                {...register('title')}
              />
              <div>
                <TextField
                  label="Price"
                  value={listing.price}
                  variant="standard"
                  onChange={(e) => setListing({ ...listing, price: parseInt(e.target.value) || 0 })}
                  sx={styles.inputSmall}
                  type="text"
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
                <TextField
                  required
                  label="Bathrooms"
                  value={listing.metadata.bathrooms}
                  variant="standard"
                  onChange={(e) =>
                    setListing({
                      ...listing,
                      metadata: { ...listing.metadata, bathrooms: parseInt(e.target.value) || 0 },
                    })
                  }
                  sx={styles.inputSmall}
                  type="text"
                />
                <TextField
                  required
                  label="Parking"
                  value={listing.metadata.parking}
                  variant="standard"
                  onChange={(e) =>
                    setListing({
                      ...listing,
                      metadata: { ...listing.metadata, parking: parseInt(e.target.value) || 0 },
                    })
                  }
                  sx={styles.inputSmall}
                  type="text"
                />
                <FormControl variant="standard" sx={styles.inputSmall}>
                  <InputLabel id="property-type">Property Type</InputLabel>
                  <Select
                    labelId="edit-property-type"
                    id="editPropertyType"
                    value={listing.metadata.type}
                    onChange={(e) =>
                      setListing({
                        ...listing,
                        metadata: { ...listing.metadata, type: e.target.value },
                      })
                    }
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
                defaultValue={listing.address.street_number}
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
                defaultValue={listing.address.street_name}
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
                defaultValue={listing.address.suburb}
                variant="standard"
                sx={styles.inputSmall}
                error={!!errors.suburb}
                helperText={errors.suburb?.message}
                {...register('suburb')}
              />
              <TextField
                required
                name="state"
                label="State"
                defaultValue={listing.address.state}
                variant="standard"
                sx={styles.inputSmall}
                error={!!errors.state}
                helperText={errors.state?.message}
                {...register('state')}
              />
              <TextField
                required
                name="postCode"
                label="Post code"
                defaultValue={listing.address.post_code}
                variant="standard"
                sx={styles.inputSmall}
                error={!!errors.postCode}
                helperText={errors.postCode?.message}
                {...register('postCode')}
              />
              <TextField
                required
                name="country"
                label="Country"
                defaultValue={listing.address.country}
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
                {listing.metadata.bedrooms.map((bedroom, idx) => (
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
                      label="beds"
                      value={listing.metadata.bedrooms[idx].beds}
                      variant="standard"
                      onChange={(e) => updateBeds(e, idx)}
                      sx={styles.inputSmall}
                      type="text"
                    />
                  </div>
                ))}
              </Grid>
              <Button
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
                  {Object.entries(listing.metadata.amenities).map((amenity) => (
                    <FormControlLabel
                      sx={styles.amenity}
                      key={amenity}
                      control={<Checkbox checked={amenity[1]} />}
                      label={amenity[0].toLowerCase()}
                      onChange={() => updateAmenities(amenity)}
                    />
                  ))}
                </Grid>
              </FormGroup>
              <Typography variant="h6" color="initial">
                Thumbnail
              </Typography>
              <Divider light />
              <Grid container justifyContent="center">
                <Grid item sx={styles.imgContainer}>
                  <Box
                    component="img"
                    src={listing.thumbnail || defaultImage}
                    sx={styles.thumbnail}
                  ></Box>
                  <label htmlFor="icon-button-file">
                    <input
                      onChange={(e) => updateThumbnail(e)}
                      accept="image/*"
                      id="icon-button-file"
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
              </Grid>
              <Typography variant="h6" color="initial">
                Image List
              </Typography>
              <Divider light />
              <Grid container justifyContent="center">
                {listing.metadata.images.length !== 0 &&
                  listing.metadata.images.map((image, idx) => (
                    <Grid key={idx} item sx={styles.imgContainer}>
                      <Box component="img" src={image.image} sx={styles.thumbnail}></Box>
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
                    <input type="file" hidden onChange={(e) => addImage(e)} multiple />
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
          <Divider light />
          <Grid container sx={{ mt: 2 }} justifyContent="center">
            <Button
              id="saveEditListingBtn"
              size="large"
              variant="contained"
              color="primary"
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>
          </Grid>
        </Paper>
      </Container>
    </>
  );
};

export default EditListingForm;
