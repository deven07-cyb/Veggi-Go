'use client';

import React from "react";
import { Field, useFormikContext } from "formik";

const CurrencyPriceField = ({
  label = "Price",
  required = true,
  currencyList = [],
  currencyCode,
  setCurrencyCode,
  setFieldValue,
}) => {
  const { values } = useFormikContext(); // Access Formik state directly
  return (
    <fieldset className="box-fieldset">
      <label htmlFor="price">
        {label}
        {required && <span>*</span>}:
      </label>
      <div className="phone-and-country-code">
        <Field
          as="select"
          name="currency_id"
          className="nice-select country-code"
          id="currency-code"
          value={currencyCode || values.currency_id || "DH"}
          onChange={(e) => {
            const selectedCurrency = e.target.value;
            setCurrencyCode?.(selectedCurrency); // optional, if passed
            setFieldValue("currency_id", selectedCurrency);
          }}
        >
          <option value="">Select Currency</option>
          {currencyList?.length > 0 &&
            currencyList.map((currency) => (
              <option key={currency.id} value={currency.id}>
                {currency.name}
              </option>
            ))}
        </Field>

        <Field
          type="text"
          id="price"
          name="price"
          className="form-control style-1"
        />
      </div>
    </fieldset>
  );
};

export default CurrencyPriceField;
