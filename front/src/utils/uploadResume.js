export async function uploadResumeToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'raw');
  
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
  
    const data = await res.json();
  
    if (!res.ok) {
      throw new Error(data.error?.message || 'Resume upload failed');
    }
  
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  }
  