'use client';

import React from "react";
import { Field } from "formik";

const NumberField = ({
  name,
  label,
  required = false,
  min = 0,
  onChange,
  wrapperClass = "box box-fieldset",
  inputClass = "box-fieldset",
}) => {
  const handleChange = (event) => {
    const value = event.target.value;
    onChange && onChange(name, value);
  };

  return (
    <fieldset className={wrapperClass}>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      <Field
        type="number"
        name={name}
        min={min}
        className={inputClass}
        onChange={handleChange}
      />
    </fieldset>
  );
};

export default NumberField;
