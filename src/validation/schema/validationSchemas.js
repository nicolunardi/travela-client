import * as Yup from 'yup';

const editListingSchema = Yup.object().shape({
  title: Yup.string()
    .max(30, "Title can't be longer than 30 characters")
    .required('Title is required'),
  number: Yup.number().typeError('Must be a number').required('Street number is required'),
  street: Yup.string().required('Street name is required'),
  suburb: Yup.string().required('Suburb name is required'),
  postCode: Yup.number().typeError('Must be a number').required('Post code is required'),
  state: Yup.string().required('State is required'),
  country: Yup.string().required('Country is required'),
});

export { editListingSchema };
