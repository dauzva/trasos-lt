// src/lib/mega.js
import mega from 'mega';
const { Storage } = mega;

// Initialize Mega Storage client
// You will need to set MEGA_EMAIL and MEGA_PASSWORD in your Netlify environment variables
// For local development, add them to your .env.local file
const storage = new Storage({
  email: process.env.MEGA_EMAIL || import.meta.env.VITE_MEGA_EMAIL,
  password: process.env.MEGA_PASSWORD || import.meta.env.VITE_MEGA_PASSWORD,
});

export async function uploadImage(fileName, fileBuffer) {
  try {
    await storage.ready; // Ensure storage is ready (logged in)
    const file = await storage.upload(fileName, fileBuffer).complete;
    console.log(`Uploaded ${fileName} to Mega.nz. File ID: ${file.fileId}`);
    // Mega.nz does not provide direct public URLs easily without sharing.
    // For public access, you might need to manually share the folder/file and get a public link,
    // or use a different service like Cloudinary/S3 for public serving.
    // For now, we'll return a placeholder or the file ID.
    return `mega.nz/file/${file.fileId}`;
  } catch (error) {
    console.error("Error uploading to Mega.nz:", error);
    throw error;
  }
}


