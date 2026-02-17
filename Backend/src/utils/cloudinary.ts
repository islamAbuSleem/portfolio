import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';

/**
 * Configure Cloudinary SDK
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export { cloudinary };

/**
 * Upload an image to Cloudinary
 * @param filePath - Path to the file or base64 string
 * @param folder - Folder name in Cloudinary (e.g., 'projects', 'profile')
 * @param options - Additional upload options
 */
export const uploadImage = async (
  filePath: string,
  folder: string,
  options: Record<string, any> = {}
): Promise<{ url: string; publicId: string }> => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `portfolio/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 1920, crop: 'limit' }, // Max width 1920px
        { quality: 'auto:good' },      // Auto-optimize quality
        { fetch_format: 'auto' },      // Auto-select best format (WebP, JPEG, etc.)
      ],
      ...options,
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image');
  }
};

/**
 * Upload multiple images
 * @param files - Array of file paths
 * @param folder - Folder name in Cloudinary
 */
export const uploadMultipleImages = async (
  files: string[],
  folder: string
): Promise<Array<{ url: string; publicId: string }>> => {
  const uploadPromises = files.map(file => uploadImage(file, folder));
  return await Promise.all(uploadPromises);
};

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image');
  }
};

/**
 * Generate optimized image URL with transformations
 * @param url - Original image URL
 * @param width - Desired width
 * @param height - Desired height (optional)
 * @param crop - Crop mode (optional)
 */
export const getOptimizedUrl = (
  url: string,
  width?: number,
  height?: number,
  crop: string = 'fill'
): string => {
  if (!url || !url.includes('cloudinary')) return url;

  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);
  transformations.push('q_auto:good', 'f_auto');

  return url.replace('/upload/', `/upload/${transformations.join(',')}/`);
};
