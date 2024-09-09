import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ux/toast/Toast';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { actionUpdateUser } from '../../../redux/features/auth/authSlice';

const ProfileDetailsPanel = ({ userDetails }) => {

  const [isEditMode, setIsEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);


  const dispatch = useDispatch()

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveClick = async () => {
    if (
      firstName === userDetails.first_name &&
      lastName === userDetails.last_name &&
      phoneNumber === userDetails.phone
    ) {
      setIsEditMode(false);
      return;
    }

    const updatedUserDetails = {
      id:userDetails.id,
      first_name:firstName,
      last_name:lastName,
      phone:phoneNumber,
      birthday:dateOfBirth,
    };
    await dispatch(actionUpdateUser(updatedUserDetails))
    // Call the API to update the user details
    // const response = '/api/users/update-profile'
    // if (response && response.data.status) {
    //   setToastMessage({
    //     type: 'success',
    //     message: response.data.status,
    //   });
    // } else {
    //   // revert to original state
    //   setFirstName(userDetails.first_name);
    //   setLastName(userDetails.last_name);
    //   setPhoneNumber(userDetails.phone);
    //   setNationality(userDetails.country);
    //   setToastMessage({
    //     type: 'error',
    //     message: 'Oops, something went wrong. Please try again later.',
    //   });
    // }

    setIsEditMode(false);
  };

  // effect to set initial state of user details
  useEffect(() => {
    if (userDetails) {
      setFirstName(userDetails.first_name || '');
      setLastName(userDetails.last_name || '');
      setEmail(userDetails.email || '');
      setPhoneNumber(userDetails.phone || '');
      setIsEmailVerified(userDetails.email_verified_at || '');
      setIsPhoneVerified(userDetails.phone_verified_at || '');
      setDateOfBirth(userDetails.birthday || '');
    }
  }, [userDetails]);

  return (
    <div className="bg-white shadow sm:rounded-lg flex flex-col">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900">
          Thông tin chi tiết
        </h3>
        <p className="mt-1 max-w-2xl text-gray-500">
          Thông tin cá nhân
        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {isEditMode ? (
            // Editable fields
            <>
              <TextField
                label="Họ"
                value={firstName}
                onChange={setFirstName}
              />
              <TextField
                label="Tên"
                value={lastName}
                onChange={setLastName}
              />
              <TextField
                label="Phone number"
                type="tel"
                value={phoneNumber}
                onChange={setPhoneNumber}
              />
              <TextField
                label="Ngày sinh"
                type="date"
                value={dateOfBirth}
                onChange={setDateOfBirth}
              />
            </>
          ) : (
            // Display fields
            <>
              <DisplayField label="Họ" value={firstName} />
              <DisplayField label="Tên" value={lastName} />
              <DisplayField
                label="Email address"
                value={email}
                verified={isEmailVerified}
              />
              <DisplayField
                label="Phone number"
                value={phoneNumber || 'Nhập phone number của bạn'}
                verified={isPhoneVerified}
              />
              <DisplayField
                label="Ngày sinh"
                value={dateOfBirth || 'Nhập ngày sinh của bạn'}
              />
            </>
          )}
        </dl>
      </div>
      <div className="flex justify-between px-4 py-3 bg-gray-50 text-right sm:px-6">
        {isEditMode ? (
          <>
            <button
              onClick={handleCancelClick}
              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Hoàn tác
            </button>
            <button
              onClick={handleSaveClick}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Lưu
            </button>
          </>
        ) : (
          <button
            onClick={handleEditClick}
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Sửa
          </button>
        )}
      </div>

    </div>
  );
};

const DisplayField = ({ label, value, verified }) => (
  <div
    className={`bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${verified ? 'bg-gray-50' : ''
      }`}
  >
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-gray-900 sm:mt-0 sm:col-span-2">
      {value}{' '}
      {verified && <span className="text-green-500 font-medium">Verified</span>}
    </dd>
  </div>
);

const TextField = ({
  label,
  value,
  onChange,
  type = 'text',
  isSelectable,
  selectableData,
}) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
    <dt className="font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 sm:mt-0 sm:col-span-2">
      {isSelectable ? (
        <Select
          options={selectableData}
          value={selectableData.find((country) => country.value === value)}
          onChange={(selectedOption) => onChange(selectedOption.value)}
        />
      ) : (
        <input
          type={type}
          className="mt-1 border py-1 px-2 focus:ring-indigo-500 focus:border-indigo-500 block w-full text-sm md:text-base  rounded-md"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </dd>
  </div>
);

export default ProfileDetailsPanel;
