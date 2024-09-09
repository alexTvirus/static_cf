import { useEffect, useState } from "react";
import { Select } from 'antd';
import Loader from '../../../../components/ux/loader/loader';
import { useDispatch, useSelector } from "react-redux";
import { actionGetDistrics } from "../../../../redux/features/room/roomSlice";

const validationSchema = {
    email: (value) => /\S+@\S+\.\S+/.test(value),
    address: (value) => value.trim() !== '',
    city: (value) => value.trim() !== '',
    state: (value) => value.trim() !== '',
    postalCode: (value) => /^\d{5}(-\d{4})?$/.test(value),
};


const Payment = (
    {
        handleSubmit,
        isSubmitDisabled,
        formData,
        setFormData,
    }) => {

    const dispatch = useDispatch()
    const { cities, districs } = useSelector(state => {
        return state.room
    })

    const [citiesOption, setCitiesOption] = useState({
        isLoading: true,
        data: [],
    });

    const [districsOption, setDistricsOption] = useState({
        isLoading: true,
        data: [],
    });

    useEffect(() => {
        if (cities && cities.length > 0) {
            setCitiesOption({
                isLoading: false,
                data: cities.map((city, index) => {
                    return {
                        label: city.name,
                        value: city.code,
                    }
                })
            })
        }
    }, [cities])

    useEffect(() => {
        if (districs && districs.length > 0) {
            setDistricsOption({
                isLoading: false,
                data: districs.map((city, index) => {
                    return {
                        label: city.name,
                        value: city.code,
                    }
                })
            })
        }
    }, [districs])

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const isValid = validationSchema[name](value);
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: !isValid });
    };

    const handleCitySelect = (e,option) => {
        setFormData({ ...formData, city: option.label });
        dispatch(actionGetDistrics(option.value))
    };

    
    const handleDistricSelect = (e,option) => {
        setFormData({ ...formData, state: option.label });
    };

    const preHandleSubmit = (e) => {
        e.preventDefault();

        let isValid = true;
        const newErrors = {};

        Object.keys(formData).forEach((field) => {
            const isFieldValid = validationSchema[field](formData[field]);
            newErrors[field] = !isFieldValid;
            isValid = isValid && isFieldValid;
        });

        setErrors(newErrors);

        if (!isValid) {
            return;
        }
        handleSubmit(e)
    }

    return (<>
        <div className="relative bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto mt-4">
            {citiesOption.isLoading && (
                <Loader
                    isFullScreen={true}
                    loaderText={'Payment in progress, hold tight!'}
                />
            )}
            <form
                onSubmit={preHandleSubmit}
            >
                <InputField
                    label="Email address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required={true}
                    error={errors.email}
                />
                <InputField
                    label="Địa chỉ"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Địa chỉ"
                    required={true}
                    error={errors.address}
                />

                <SelectField
                    label="Thành phố"
                    name="city"
                    onChange={handleCitySelect}
                    placeholder="Thành phố"
                    required={true}
                    error={errors.city}
                    options={citiesOption.data}
                />
                <div className="flex mb-4 justify-between">
                    <SelectField
                        label="Quận/Huyện"
                        name="state"
                        onChange={handleDistricSelect}
                        placeholder="Quận/Huyện"
                        required={true}
                        error={errors.state}
                        options={districsOption.data}
                    />
                    <InputField
                        label="Mã vùng"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Mã vùng"
                        required={true}
                        error={errors.postalCode}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className={`bg-brand hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition duration-300 ${isSubmitDisabled
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                            }`}
                        type="submit"
                        disabled={isSubmitDisabled}
                    >
                        Tiếp tục
                    </button>
                </div>
            </form>

        </div>
    </>)
}

const SelectField = ({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    required,
    error,
    options
}) => (
    <div className="mb-4 md:flex-1">
        <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={name}
        >
            {label}
        </label>

        <Select
            showSearch
            className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'
                } rounded w-full 
                    py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}

            placeholder={placeholder}
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
            }
            options={options}

            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
        />


        {error && (
            <p className="text-red-500 text-xs my-1">Please check this field.</p>
        )}
    </div>)

const InputField = ({
    label,
    type,
    name,
    value,
    onChange,
    placeholder,
    required,
    error,
}) => (
    <div className="mb-4">
        <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={name}
        >
            {label}
        </label>
        <input
            className={`shadow appearance-none border ${error ? 'border-red-500' : 'border-gray-300'
                } rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
        />
        {error && (
            <p className="text-red-500 text-xs my-1">Please check this field.</p>
        )}
    </div>
);

export default Payment