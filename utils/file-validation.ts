export const ALLOWED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { isValid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  const fileType = Object.entries(ALLOWED_FILE_TYPES).find(([mimeType, extensions]) => {
    return file.type === mimeType || extensions.some(ext => file.name.toLowerCase().endsWith(ext));
  });

  if (!fileType) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload PDF, JPG, PNG, DOC, or DOCX files.'
    };
  }

  return { isValid: true };
}
