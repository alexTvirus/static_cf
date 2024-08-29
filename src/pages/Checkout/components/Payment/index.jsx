import { useState } from "react";


const validationSchema = {
    email: (value) => /\S+@\S+\.\S+/.test(value),
    nameOnCard: (value) => value.trim() !== '',
    cardNumber: (value) => /^\d{16}$/.test(value), // Simplistic validation: just check if it has 16 digits.
    expiry: (value) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value), // MM/YY format
    cvc: (value) => /^\d{3,4}$/.test(value), // 3 or 4 digits
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
        setFormData
    }) => {

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        debugger
        const { name, value } = e.target;
        const isValid = validationSchema[name](value);
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: !isValid });
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
                    label="Address"
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Street Address"
                    required={true}
                    error={errors.address}
                />
                <InputField
                    label="City"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required={true}
                    error={errors.city}
                />
                <div className="flex mb-4 justify-between">
                    <InputField
                        label="State / Province"
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required={true}
                        error={errors.state}
                    />
                    <InputField
                        label="Postal code"
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Postal Code"
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
                        Submit
                    </button>
                </div>
            </form>

        </div>
    </>)
}

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