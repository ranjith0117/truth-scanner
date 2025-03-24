
import * as ExifParser from 'exif-parser';
import { PDFExtract, PDFExtractResult } from 'pdf.js-extract';

interface ExtractedMetadata {
  creationDate: Date | null;
  modificationDate: Date | null;
  software?: string;
  device?: string;
  make?: string;
  model?: string;
  author?: string;
  fileType: string;
  fileSize: string;
  dimensions?: {
    width: number;
    height: number;
  };
  additionalInfo?: Record<string, any>;
}

// Simple file size formatter
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

export const extractImageMetadata = async (file: File): Promise<ExtractedMetadata> => {
  return new Promise((resolve, reject) => {
    console.log('Starting image metadata extraction');
    const reader = new FileReader();

    reader.onload = function(e) {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        console.log('File read successful, parsing EXIF data');
        const buffer = e.target.result as ArrayBuffer;
        
        try {
          const parser = ExifParser.create(buffer);
          const result = parser.parse();

          console.log('Extracted EXIF data:', result);

          let dimensions;
          if (result.imageSize && result.imageSize.width && result.imageSize.height) {
            dimensions = {
              width: result.imageSize.width,
              height: result.imageSize.height
            };
          }

          let creationDate = null;
          let modificationDate = null;

          if (result.tags && result.tags.DateTimeOriginal) {
            creationDate = new Date(result.tags.DateTimeOriginal * 1000);
          } else if (result.tags && result.tags.DateTime) {
            creationDate = new Date(result.tags.DateTime * 1000);
          }

          if (result.tags && result.tags.ModifyDate) {
            modificationDate = new Date(result.tags.ModifyDate * 1000);
          }

          if (!creationDate) creationDate = new Date(file.lastModified);
          if (!modificationDate) modificationDate = new Date(file.lastModified);

          const metadata: ExtractedMetadata = {
            creationDate,
            modificationDate,
            fileType: file.type || 'image',
            fileSize: formatFileSize(file.size),
            make: result.tags?.Make,
            model: result.tags?.Model,
            software: result.tags?.Software,
            device: result.tags?.Model ? `${result.tags.Make || ''} ${result.tags.Model}`.trim() : undefined,
            dimensions,
            additionalInfo: {
              orientation: result.tags?.Orientation,
              flash: result.tags?.Flash,
              focalLength: result.tags?.FocalLength,
              exposureTime: result.tags?.ExposureTime,
              iso: result.tags?.ISO,
              gpsLatitude: result.tags?.GPSLatitude,
              gpsLongitude: result.tags?.GPSLongitude,
            }
          };

          console.log('Image metadata extracted successfully', metadata);
          resolve(metadata);
        } catch (exifError) {
          console.warn('Error parsing EXIF data, falling back to basic metadata', exifError);
          // Fallback to basic file metadata
          const basicMetadata: ExtractedMetadata = {
            creationDate: new Date(file.lastModified),
            modificationDate: new Date(file.lastModified),
            fileType: file.type || 'image',
            fileSize: formatFileSize(file.size),
          };
          resolve(basicMetadata);
        }
      } catch (error) {
        console.error('General error in image metadata extraction', error);
        const fallbackMetadata: ExtractedMetadata = {
          creationDate: new Date(file.lastModified),
          modificationDate: new Date(file.lastModified),
          fileType: file.type || 'image',
          fileSize: formatFileSize(file.size),
        };
        resolve(fallbackMetadata);
      }
    };

    reader.onerror = function(error) {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const extractPdfMetadata = async (file: File): Promise<ExtractedMetadata> => {
  return new Promise((resolve, reject) => {
    console.log('Starting PDF metadata extraction');
    const reader = new FileReader();

    reader.onload = async function(e) {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }

        console.log('PDF file read successful, parsing metadata');
        const arrayBuffer = e.target.result as ArrayBuffer;
        const uint8Array = new Uint8Array(arrayBuffer);

        try {
          const pdfExtract = new PDFExtract();
          
          // Convert Uint8Array to Buffer (workaround for TypeScript error)
          // Using a more reliable approach instead of direct casting
          console.log('Extracting PDF data');
          
          // Fix: Use async/await and proper error handling
          let pdfData: PDFExtractResult;
          try {
            // Use extractBuffer properly with await
            pdfData = await pdfExtract.extractBuffer(uint8Array as unknown as Buffer);
            console.log('PDF data extracted:', pdfData);
          } catch (pdfExtractError) {
            console.error('Error extracting PDF data:', pdfExtractError);
            throw pdfExtractError;
          }

          // Extract metadata from the PDF
          let creationDate = null;
          let modificationDate = null;
          let author = undefined;
          let producer = undefined;

          // If metadata is available in the extracted PDF data
          if (pdfData && pdfData.metadata && pdfData.metadata._metadata) {
            const meta = pdfData.metadata._metadata;
            
            // Try to parse creation date
            if (meta.creationDate) {
              try {
                creationDate = new Date(meta.creationDate);
              } catch (dateError) {
                console.warn('Error parsing PDF creation date', dateError);
              }
            }
            
            // Try to parse modification date
            if (meta.modDate) {
              try {
                modificationDate = new Date(meta.modDate);
              } catch (dateError) {
                console.warn('Error parsing PDF modification date', dateError);
              }
            }
            
            author = meta.author;
            producer = meta.producer;
          }

          // Fallback to file system dates if needed
          if (!creationDate) creationDate = new Date(file.lastModified);
          if (!modificationDate) modificationDate = new Date(file.lastModified);

          const metadata: ExtractedMetadata = {
            creationDate,
            modificationDate,
            fileType: 'PDF Document',
            fileSize: formatFileSize(file.size),
            author,
            software: producer,
            additionalInfo: {
              pageCount: pdfData && pdfData.pages ? pdfData.pages.length : 0,
              isEncrypted: false,
              // Add other PDF-specific info here
            }
          };

          console.log('PDF metadata extracted successfully:', metadata);
          resolve(metadata);
        } catch (pdfError) {
          console.warn('Error parsing PDF, falling back to basic metadata', pdfError);
          const basicMetadata: ExtractedMetadata = {
            creationDate: new Date(file.lastModified),
            modificationDate: new Date(file.lastModified),
            fileType: 'PDF Document',
            fileSize: formatFileSize(file.size),
          };
          resolve(basicMetadata);
        }
      } catch (error) {
        console.error('General error in PDF metadata extraction', error);
        const fallbackMetadata: ExtractedMetadata = {
          creationDate: new Date(file.lastModified),
          modificationDate: new Date(file.lastModified),
          fileType: 'PDF Document',
          fileSize: formatFileSize(file.size),
        };
        resolve(fallbackMetadata);
      }
    };

    reader.onerror = function(error) {
      console.error('FileReader error:', error);
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
};

export const extractMetadata = async (file: File): Promise<ExtractedMetadata> => {
  console.log('Starting metadata extraction for file:', file.name, file.type, file.size);

  try {
    if (file.type.startsWith('image/')) {
      console.log('Processing as image file');
      return await extractImageMetadata(file);
    } else if (file.type === 'application/pdf') {
      console.log('Processing as PDF file');
      return await extractPdfMetadata(file);
    } else {
      console.log('Unknown file type, using basic metadata');
      return {
        creationDate: new Date(file.lastModified),
        modificationDate: new Date(file.lastModified),
        fileType: file.type || 'Unknown',
        fileSize: formatFileSize(file.size),
      };
    }
  } catch (error) {
    console.error('Error in extractMetadata:', error);
    // Fallback to very basic metadata
    return {
      creationDate: new Date(file.lastModified),
      modificationDate: new Date(file.lastModified),
      fileType: file.type || 'Unknown',
      fileSize: formatFileSize(file.size),
    };
  }
};
