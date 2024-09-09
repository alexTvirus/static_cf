import { useState } from "react";

const PaymentInFo = (
    {
        formData,
    }) => {


    return (<>
        <div className="relative bg-white  px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto mt-4">
            <InputField
                label="email"
                type="text"
                name="email"
                value={formData.email}
                onChange={() => { }}
                readOnly={true}
            />
            <InputField
                label="Địa chỉ"
                type="text"
                name="address"
                value={formData.address}
                onChange={() => { }}
                readOnly={true}
            />
            <InputField
                label="Thành phố"
                type="text"
                name="city"
                value={formData.city}
                onChange={() => { }}
                readOnly={true}
            />
            <div className="flex mb-4 justify-between">
                <InputField
                    label="Quận/Huyện"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={() => { }}
                    readOnly={true}
                />
                <InputField
                    label="Mã vùng"
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={() => { }}
                    readOnly={true}
                />
            </div>
        </div>
    </>)
}

const InputField = ({
    label,
    type,
    name,
    value,
    readOnly
}) => (
    <div className="mb-4">
        <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor={name}
        >
            {label}
        </label>
        <input
            className={`cursor-default shadow border-gray-300 rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline`}
            id={name}
            type={type}
            name={name}
            value={value}
            readOnly={readOnly}
        />
    </div>
);

export default PaymentInFo