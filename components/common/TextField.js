'use client';

import React from "react";
import { Field } from "formik";

const TextField = ({
  name,
  label,
  required = false,
  className = "form-control style-1",
  wrapperClass = "box box-fieldset",
  type = "text",
  ...rest
}) => {
  return (
    <fieldset className={wrapperClass}>
      <label htmlFor={name}>
        {label}
        {required && <span>*</span>}
      </label>
      <Field
        id={name}
        name={name}
        type={type}
        className={className}
        {...rest}
      />
    </fieldset>
  );
};

export default TextField;
