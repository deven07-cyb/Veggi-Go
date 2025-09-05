import React, { useState, useEffect } from "react";
import { insertMultipleUploadImage } from "@/components/common/imageUpload";

const MultipleFileUpload = ({ selectedImages = [], onChange, label = "" }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    setImages(selectedImages);
  }, [selectedImages]);

  const handleUpload = async (event) => {
    const files = Array.from(event.target.files);
    const response = await insertMultipleUploadImage("image", files);

    if (response.files?.length > 0) {
      const uploadedImages = response.files.map((file) => (file.url));

      setImages((prev) => {
        const updated = [...prev, ...uploadedImages];
        onChange && onChange(updated);
        return updated;
      });
    }
  };

  const handleImageChange = (newImages) => {
    setImages(newImages);
    onChange(newImages);  // Or similar call to parent
  };

  const handleRemoveImage = (indexToRemove) => {
    setImages((prev) => {
      const updated = prev.filter((_, i) => i !== indexToRemove);
      onChange && onChange(updated);
      return updated;
    });
  };

  const moveImage = (from, to) => {
    setImages((prev) => {
      if (to < 0 || to >= prev.length) return prev;
      const updated = [...prev];
      const [moved] = updated.splice(from, 1);
      updated.splice(to, 0, moved);
      onChange && onChange(updated);
      return updated;
    });
  };

  return (
    <>
      <div className="upload-container-sec">
        <h6 class="title">{label}</h6>
        <div className="upload-container-inner-sec">
          <div className="upload-container">
            <label className="upload-input">
              Drag and drop files here or{" "}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUpload}
                style={{ display: "none" }}
              />
              <span style={{ color: "#4f46e5", textDecoration: "underline", cursor: "pointer" }}>
                choose files
              </span>
            </label>
          </div>
          <div className="images-list">
            {images.length === 0 ? (
              <div className="empty-image-list" style={{ fontSize: 14, color: "#888", textAlign: "center", padding: "10px" }}>
                <strong>No image uploaded right now</strong>
              </div>
            ) : (
              images.map((img, index) => (
                <div className="image-item" key={img.id}>
                  <img className="image-preview" src={img.url || img} alt="" />
                  <div className="image-meta">
                    <strong>{img.name}</strong>
                    <div style={{ fontSize: 12, color: "#555" }}>
                      Uploaded: {img.name} on {new Date(img.uploadTime).toLocaleString()}
                    </div>
                  </div>

                  <div className="image-actions">
                    <button type="button" onClick={() => moveImage(index, index - 1)} disabled={index === 0} className="image-button">⬆</button>
                    <button type="button" onClick={() => moveImage(index, index + 1)} disabled={index === images.length - 1} className="image-button">⬇</button>
                  </div>

                  <button type="button" onClick={() => handleRemoveImage(index)} className="delete-button">
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
          </div>
        </div>
      </>
      );
};

      export default MultipleFileUpload;
