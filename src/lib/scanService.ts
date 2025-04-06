
import { extractMetadata } from './metadataExtractor';

export interface ScanIssue {
  type: 'Critical' | 'Warning' | 'Info';
  description: string;
  location?: string;
}

export interface ScanResult {
  authenticity: number;
  status: 'Secure' | 'Suspicious' | 'Forged';
  metadata?: {
    fileType: string;
    fileSize: string;
    dateCreated: string;
    dateModified: string;
    author?: string;
    software?: string;
    device?: string;
    dimensions?: {
      width: number;
      height: number;
    };
  };
  issues: ScanIssue[];
}

/**
 * Analyzes an image or document for signs of manipulation
 */
export async function scanDocument(file: File): Promise<ScanResult> {
  console.log('Starting real document scan for:', file.name);
  
  // Extract real metadata from the file
  const metadata = await extractMetadata(file);
  console.log('Extracted metadata:', metadata);

  // Initialize scan result
  const result: ScanResult = {
    authenticity: 100, // Default to 100%, will be reduced based on findings
    status: 'Secure',
    metadata: {
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
      dateCreated: metadata.creationDate ? metadata.creationDate.toISOString() : new Date().toISOString(),
      dateModified: metadata.modificationDate ? metadata.modificationDate.toISOString() : new Date().toISOString(),
      author: metadata.author,
      software: metadata.software,
      device: metadata.device,
    },
    issues: []
  };

  if (metadata.dimensions) {
    result.metadata!.dimensions = metadata.dimensions;
  }

  // Analyze creation and modification dates
  const creationDate = new Date(result.metadata!.dateCreated);
  const modificationDate = new Date(result.metadata!.dateModified);
  const timeDiff = modificationDate.getTime() - creationDate.getTime();
  
  // Check for time discrepancies
  if (timeDiff > 24 * 60 * 60 * 1000) { // More than a day
    result.authenticity -= 30;
    result.issues.push({
      type: 'Critical', 
      description: 'File was modified significantly after creation, suggesting potential tampering.'
    });
  } else if (timeDiff > 60 * 60 * 1000) { // More than an hour
    result.authenticity -= 15;
    result.issues.push({
      type: 'Warning', 
      description: 'File was modified after creation, which may indicate some alterations.'
    });
  }

  // Check for software used (potential manipulation tools)
  if (metadata.software) {
    const manipulationSoftware = ['photoshop', 'gimp', 'lightroom', 'illustrator', 'pixlr', 'midjourney'];
    const lowerSoftware = metadata.software.toLowerCase();
    
    if (manipulationSoftware.some(software => lowerSoftware.includes(software))) {
      result.authenticity -= 10;
      result.issues.push({
        type: 'Warning',
        description: `File was edited with ${metadata.software}, which is commonly used for image manipulation.`,
      });
    }
  }

  // Analyze file type for potential conversion issues
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    // JPEG compression can hide manipulation artifacts
    // Check if JPEG quality is very low (indicating potential manipulation hiding)
    if (file.size < 100 * 1024 && metadata.dimensions && 
        metadata.dimensions.width > 800 && metadata.dimensions.height > 800) {
      result.authenticity -= 15;
      result.issues.push({
        type: 'Warning',
        description: 'Image has unusually small file size for its dimensions, suggesting aggressive compression that could hide manipulation artifacts.',
      });
    }
  }

  // In a real scenario, here you would:
  // 1. Perform error level analysis (ELA)
  // 2. Check for clone detection (copy-paste within image)
  // 3. Look for inconsistent lighting and shadows
  // 4. Check for noise inconsistencies
  // 5. Verify metadata integrity
  // etc.

  // For PDF documents
  if (file.type === 'application/pdf') {
    // Check if the PDF has been merged from multiple sources
    if (metadata.additionalInfo && metadata.additionalInfo.pageCount > 1) {
      result.issues.push({
        type: 'Info',
        description: 'Multi-page PDF detected. Consider reviewing each page separately for consistency.',
      });
    }
  }

  // Calculate final authenticity score and determine status
  if (result.authenticity < 60) {
    result.status = 'Forged';
  } else if (result.authenticity < 90) {
    result.status = 'Suspicious';
  } else {
    result.status = 'Secure';
  }

  return result;
}
