
// Import the real scanning service
import { ScanResult, scanDocument } from './scanService';

// This function now calls the real scanning service
export const simulateScan = async (file: File): Promise<ScanResult> => {
  console.log('Starting real document scan analysis:', file.name);
  
  try {
    // Use the real scanning service
    const result = await scanDocument(file);
    console.log('Scan complete with result:', result);
    
    // Store the result in sessionStorage for the Results page
    sessionStorage.setItem('scanResult', JSON.stringify(result));
    sessionStorage.setItem('fileName', file.name);
    sessionStorage.setItem('fileLastModified', file.lastModified.toString());
    
    return result;
  } catch (error) {
    console.error('Error during document scanning:', error);
    // Return a fallback result in case of error
    const fallbackResult: ScanResult = {
      authenticity: 0,
      status: 'Suspicious',
      metadata: {
        fileType: file.type || 'Unknown',
        fileSize: `${Math.round(file.size / 1024)} KB`,
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
      },
      issues: [
        {
          type: 'Critical',
          description: 'Error analyzing document. The file may be corrupted or in an unsupported format.',
        }
      ]
    };
    
    // Store the fallback result in sessionStorage
    sessionStorage.setItem('scanResult', JSON.stringify(fallbackResult));
    sessionStorage.setItem('fileName', file.name);
    sessionStorage.setItem('fileLastModified', file.lastModified.toString());
    
    return fallbackResult;
  }
};

// Export the ScanResult type for use in other files
export type { ScanResult };

// Keep a simplified example for reference or testing
export const exampleScanResult: ScanResult = {
  authenticity: 85,
  status: 'Suspicious',
  metadata: {
    fileType: 'image/jpeg',
    fileSize: '1.2 MB',
    dateCreated: '2024-03-15T10:30:45.000Z',
    dateModified: '2024-04-01T14:22:18.000Z',
    software: 'Adobe Photoshop 22.3',
    device: 'iPhone 13 Pro',
    dimensions: {
      width: 3024,
      height: 4032
    }
  },
  issues: [
    {
      type: 'Warning',
      description: 'File was modified after creation, which may indicate some alterations.',
    },
    {
      type: 'Warning',
      description: 'File was edited with Adobe Photoshop, which is commonly used for image manipulation.',
    }
  ]
};
