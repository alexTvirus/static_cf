import React, { useState, useEffect } from 'react';
import Toast from '../../../components/ux/toast/Toast';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { actionChangePassword, actionUpdateUser } from '../../../redux/features/auth/authSlice';
import OverlayComponent from '../../../components/OverLay'

const ChangePasswordPanel = ({isLoading, userDetails }) => {

  const [isEditMode, setIsEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const dispatch = useDispatch()

  const handleEditClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleCancelClick = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSaveClick = async () => {
    const updatedUserDetails = {
      password: password,
      password_confirmation: passwordConfirmation,
    };
    await dispatch(actionChangePassword(updatedUserDetails))
    setIsEditMode(false);
  };


  return (<>
    <OverlayComponent
      isLoading={isLoading}
    ></OverlayComponent>
    <div className="bg-white shadow sm:rounded-lg flex flex-col">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-xl leading-6 font-medium text-gray-900">
          Thay đổi mật khẩu
        </h3>
        <p className="mt-1 max-w-2xl text-gray-500">

        </p>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {isEditMode ? (
            // Editable fields
            <>
              <TextField
                label="Mật khẩu"
                value={password}
                onChange={setPassword}
              />
              <TextField
                label="Xác nhận mật khẩu"
                value={passwordConfirmation}
                onChange={setPasswordConfirmation}
              />
            </>
          ) : (
            // Display fields
            <>
              <DisplayField label="Mật khẩu cũ" value={"********"} />
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
  </>
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

export default ChangePasswordPanel;
