import * as Yup from 'yup';
const phoneRegExp = /^\d{10}$/;

class ValidationSchema {
  static email = Yup.string().email('Invalid email').required('Required');
}

class Schemas extends ValidationSchema {
  static signupSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
      last_name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: ValidationSchema.email,
    phone: Yup.string()
      .matches(phoneRegExp, 'Phone number is not valid')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .required('Required'),
      password_confirmation: Yup.string().required('Required'),
  });
}

export default Schemas;
