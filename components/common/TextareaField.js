'use client';

import React, { useRef, useEffect } from 'react';
import { useField, useFormikContext } from 'formik';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { successToast, errorToast, multiErrorToast } from "@/components/common/Toast";
// Dynamically import ReactQuill (for SSR compatibility in Next.js)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const TextareaField = ({
  name,
  label,
  required = false,
  className = '',
  wrapperClass = 'box-fieldset',
  editorHeight = 200,
  editorConfig = {},
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue, setFieldTouched } = useFormikContext();

  return (
    <fieldset className={wrapperClass}>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true">*</span>}
      </label>

      <div className="editor-container">
        <ReactQuill
          value={field.value || ''}
          onChange={(val) => setFieldValue(name, val)}
          onBlur={() => setFieldTouched(name, true)}
          style={{ height: editorHeight }}
          theme="snow"
          {...editorConfig}
        />
      </div>

      {meta.touched && meta.error && (
        errorToast(meta.error)
      )}
    </fieldset>
  );
};

export default TextareaField;
