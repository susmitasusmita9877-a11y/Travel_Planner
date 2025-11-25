import React, { useState } from 'react';
import { FaFile, FaUpload, FaDownload, FaTrash } from 'react-icons/fa';

export default function DocumentManager({ tripId, documents = [], onUpdate }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    // Convert to base64
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await api.post('/uploads', { 
          image: reader.result,
          filename: file.name 
        });
        const newDoc = {
          name: file.name,
          url: res.data.url,
          type: file.type,
          uploadedAt: new Date().toISOString()
        };
        onUpdate([...documents, newDoc]);
      } catch (err) {
        alert('Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = (index) => {
    const updated = documents.filter((_, i) => i !== index);
    onUpdate(updated);
  };

  return (
    <div className="space-y-4">
      <div className="card bg-gray-50">
        <label className="flex flex-col items-center gap-3 cursor-pointer">
          <FaUpload size={32} className="text-gray-400" />
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload document'}
          </span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
            disabled={uploading}
          />
        </label>
      </div>

      <div className="space-y-2">
        {documents.map((doc, idx) => (
          <div key={idx} className="card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFile className="text-primary-500" />
              <div>
                <div className="font-medium">{doc.name}</div>
                <div className="text-xs text-gray-500">
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary text-sm">
                <FaDownload />
              </a>
              <button onClick={() => handleDelete(idx)} className="btn btn-danger text-sm">
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}