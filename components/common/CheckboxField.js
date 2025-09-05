'use client';

import React from "react";
import { Field } from "formik";

const CheckboxField = ({
  name,
  label,
  checked = false,
  onChange,
  fieldClass = "tf-checkbox style-1 primary",
  wrapperClass = "amenities-item",
  labelClass = "text-cb-amenities",
}) => {
  return (
    <fieldset className={wrapperClass}>
      <Field
        type="checkbox"
        name={name}
        className={fieldClass}
        checked={checked}
        onChange={onChange}
      />
      {(label != "")?
      <label htmlFor={name} className={labelClass}>
        {label}
      </label>
      :null}
    </fieldset>
  );
};

export default CheckboxField;
