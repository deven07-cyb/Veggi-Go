import React from "react";

export default function ImageUploadView({ images, onRemove, onChange, name, error }) {
  return (
    <div className="image-upload-view">
      <div className="image-preview-list">
        {images && images.length > 0 && images.map((img, idx) => (
          <div key={idx} className="image-preview-item">
            <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="preview" style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }} />
            <button type="button" className="remove-btn" onClick={() => onRemove(idx)}>Remove</button>
          </div>
        ))}
      </div>
      <input type="file" name={name} multiple onChange={onChange} />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}