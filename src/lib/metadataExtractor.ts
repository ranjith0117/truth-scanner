
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

// Add custom interface to extend PDFExtractResult with the fields we need
interface EnhancedPDFExtractResult extends Omit<PDFExtractResult, 'pdfInfo'> {
  metadata?: {
    _metadata?: {
      creationdate?: string;
      moddate?: string;
      author?: string;
      producer?: string;
      creator?: string;
      keywords?: string;
      title?: string;
    }
  };
  pdfInfo: {
    numPages: number;
    fingerprint: string;
    version?: string;
    isEncrypted?: boolean;
  };
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
};

/**
 * Extract metadata from image files using ExifParser
 */
export const extractImageMetadata = async (file: File): Promise<ExtractedMetadata> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = function(e) {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const buffer = e.target.result as ArrayBuffer;
        const parser = ExifParser.create(buffer);
        const result = parser.parse();
        
        console.log('Extracted EXIF data:', result);
        
        // Get image dimensions from EXIF if available
        let dimensions;
        if (result.imageSize && result.imageSize.width && result.imageSize.height) {
          dimensions = {
            width: result.imageSize.width,
            height: result.imageSize.height
          };
        }
        
        // Extract creation and modification dates
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
        
        // Fallback to file lastModified if EXIF data not available
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
        
        resolve(metadata);
      } catch (error) {
        console.warn('Error parsing EXIF data, falling back to basic metadata', error);
        // Fallback to basic metadata
        const metadata: ExtractedMetadata = {
          creationDate: new Date(file.lastModified),
          modificationDate: new Date(file.lastModified),
          fileType: file.type || 'image',
          fileSize: formatFileSize(file.size),
        };
        resolve(metadata);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extract metadata from PDF files using pdf.js-extract
 */
export const extractPdfMetadata = async (file: File): Promise<ExtractedMetadata> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async function(e) {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const pdfExtract = new PDFExtract();
        const arrayBuffer = e.target.result as ArrayBuffer;
        
        try {
          // Create a proper Buffer-like object that pdf.js-extract can work with
          // Use type assertion to work around the TypeScript error
          const dataPromise = pdfExtract.extractBuffer(
            // @ts-ignore - the library actually accepts Uint8Array despite TypeScript definition
            new Uint8Array(arrayBuffer), 
            {}
          ) as Promise<EnhancedPDFExtractResult>;
          
          const data = await dataPromise;
          console.log('Extracted PDF data:', data);
          
          // Try to extract creation and modification dates
          let creationDate = null;
          let modificationDate = null;
          let author = undefined;
          let producer = undefined;
          
          // Use optional chaining with our enhanced type
          if (data?.metadata?._metadata) {
            if (data.metadata._metadata.creationdate) {
              const dateStr = data.metadata._metadata.creationdate;
              try {
                // PDF dates are often in format: D:YYYYMMDDHHmmSSOHH'mm'
                if (dateStr.startsWith('D:')) {
                  const parsedDate = new Date(
                    parseInt(dateStr.substring(2, 6)),   // Year
                    parseInt(dateStr.substring(6, 8)) - 1, // Month (0-indexed)
                    parseInt(dateStr.substring(8, 10)),  // Day
                    parseInt(dateStr.substring(10, 12)), // Hour
                    parseInt(dateStr.substring(12, 14)), // Minute
                    parseInt(dateStr.substring(14, 16))  // Second
                  );
                  
                  if (!isNaN(parsedDate.getTime())) {
                    creationDate = parsedDate;
                  }
                }
              } catch (error) {
                console.warn('Error parsing PDF creation date', error);
              }
            }
            
            if (data.metadata._metadata.moddate) {
              const dateStr = data.metadata._metadata.moddate;
              try {
                if (dateStr.startsWith('D:')) {
                  const parsedDate = new Date(
                    parseInt(dateStr.substring(2, 6)),
                    parseInt(dateStr.substring(6, 8)) - 1,
                    parseInt(dateStr.substring(8, 10)),
                    parseInt(dateStr.substring(10, 12)),
                    parseInt(dateStr.substring(12, 14)),
                    parseInt(dateStr.substring(14, 16))
                  );
                  
                  if (!isNaN(parsedDate.getTime())) {
                    modificationDate = parsedDate;
                  }
                }
              } catch (error) {
                console.warn('Error parsing PDF modification date', error);
              }
            }
            
            // Extract author and producer if available
            if (data.metadata._metadata.author) {
              author = data.metadata._metadata.author;
            }
            
            if (data.metadata._metadata.producer) {
              producer = data.metadata._metadata.producer;
            }
          }
          
          // Fallback to file lastModified if PDF metadata not available
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
              pageCount: data.pages?.length || 0,
              pdfVersion: data.pdfInfo?.version,
              creator: data.metadata?._metadata?.creator,
              keywords: data.metadata?._metadata?.keywords,
              title: data.metadata?._metadata?.title,
              isEncrypted: data.pdfInfo?.isEncrypted,
            }
          };
          
          resolve(metadata);
        } catch (error) {
          console.warn('Error parsing PDF with pdf.js-extract', error);
          // Fallback to basic metadata
          const metadata: ExtractedMetadata = {
            creationDate: new Date(file.lastModified),
            modificationDate: new Date(file.lastModified),
            fileType: 'PDF Document',
            fileSize: formatFileSize(file.size),
          };
          resolve(metadata);
        }
      } catch (error) {
        console.error('Error reading PDF file', error);
        // Fallback to basic metadata
        const metadata: ExtractedMetadata = {
          creationDate: new Date(file.lastModified),
          modificationDate: new Date(file.lastModified),
          fileType: 'PDF Document',
          fileSize: formatFileSize(file.size),
        };
        resolve(metadata);
      }
    };
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Main function to extract metadata based on file type
 */
export const extractMetadata = async (file: File): Promise<ExtractedMetadata> => {
  console.log('Extracting metadata for file:', file);
  
  if (file.type.startsWith('image/')) {
    return extractImageMetadata(file);
  } else if (file.type === 'application/pdf') {
    return extractPdfMetadata(file);
  } else {
    // For unsupported file types, return basic metadata
    return {
      creationDate: new Date(file.lastModified),
      modificationDate: new Date(file.lastModified),
      fileType: file.type || 'Unknown',
      fileSize: formatFileSize(file.size),
    };
  }
};
