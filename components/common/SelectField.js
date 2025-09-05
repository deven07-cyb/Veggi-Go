'use client';

import React from "react";
import { Field } from "formik";

const SelectField = ({
  name,
  label,
  required = false,
  options = [],
  valueKey = "id",
  labelKey = "name",
  placeholder = "Select",
  onChange,
  setFieldValue,
  wrapperClass = "box box-fieldset",
  selectClass = "nice-select country-code",
}) => {
  const handleChange = (e) => {
    const selected = e.target.value;
    if (setFieldValue) setFieldValue(name, selected);
    onChange && onChange(selected);
  };

  return (
    <fieldset className={wrapperClass}>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      <Field as="select" name={name} className={selectClass} onChange={handleChange}>
        <option value="">{placeholder} {label}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </Field>
    </fieldset>
  );
};

export default SelectField;
