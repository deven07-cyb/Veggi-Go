'use client';

import React, { useState, useEffect } from "react";
import { insertMultipleUploadImage } from "@/components/common/imageUpload";

const SingleFileUpload = ({ selectedImages = null, onChange, label = "Icon Images" }) => {
  const [image, setImage] = useState(null);
  useEffect(() => {
    setImage(selectedImages);
  }, [selectedImages]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const response = await insertMultipleUploadImage("image", [file]);

    if (response.files?.length > 0) {
      const uploadedUrl = response.files[0].url;
      setImage(uploadedUrl);
      onChange && onChange(uploadedUrl);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    onChange && onChange(null);
  };
  return (
    <div className="upload-container-sec">
      <label className="upload-title">{label}</label>
      <div className="upload-row">
        <div className="upload-left">
          <label className="upload-button">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="upload-hidden-input"
            />
            Choose Files
          </label>
        </div>

        <div className="upload-right">
          {image && (
            <div className="image-wrapper">
              <img
                src={typeof image === 'string' ? image : image.url}
                alt="Uploaded"
                className="preview-image"
              />
              <button className="delete-icon" onClick={handleRemoveImage}>
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleFileUpload;
