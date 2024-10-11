import * as Yup from 'yup';
const phoneRegExp = /^\d{10}$/;
const emailRegExp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

class ValidationSchema {
  static email = Yup.string().matches(emailRegExp, 'Email sai định dạng').required('Bắt buộc')
}

class Schemas extends ValidationSchema {
  static signupSchema = Yup.object().shape({
    first_name: Yup.string()
      .min(2, 'Phải trên 2 kí tự!')
      .max(50, 'Phải dưới 50 kí tự!')
      .required('Bắt buộc'),
    last_name: Yup.string()
      .min(2, 'Phải trên 2 kí tự!')
      .max(50, 'Phải dưới 50 kí tự!')
      .required('Bắt buộc'),
    email: ValidationSchema.email,
    phone: Yup.string()
      .matches(phoneRegExp, 'Phone number không đúng')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Password quá ngắn - phải trên 6 kí tự')
      .required('Bắt buộc'),
    password_confirmation: Yup.string().required('Bắt buộc'),
  });

  static loginSchema = Yup.object().shape({
    email: ValidationSchema.email,
    password: Yup.string()
      .min(6, 'Password quá ngắn - phải trên 6 kí tự')
      .required('Bắt buộc')
  });
}

export default Schemas;
