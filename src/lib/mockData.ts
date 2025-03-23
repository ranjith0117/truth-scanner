import { extractMetadata } from './metadataExtractor';

export interface ScanResult {
  authenticity: number;
  status: 'Secure' | 'Suspicious' | 'Forged';
  metadata: {
    fileName: string;
    fileType: string;
    fileSize: string;
    dateCreated: string;
    dateModified: string;
  };
  issues: {
    type: 'Warning' | 'Critical' | 'Info';
    description: string;
    location?: string;
  }[];
  manipulationAreas?: {
    x: number;
    y: number;
    width: number;
    height: number;
    type: 'Clone' | 'Edited' | 'Added' | 'Removed';
    confidence: number;
  }[];
}

export const generateMockScanResult = (isForged: boolean = false, fileLastModified?: number): ScanResult => {
  const authenticity = isForged 
    ? Math.random() * 40 + 10
    : Math.random() * 5 + 95;

  const status = authenticity > 90 
    ? 'Secure' 
    : authenticity > 50 
      ? 'Suspicious' 
      : 'Forged';

  const now = new Date();
  
  let created, modified;
  
  if (fileLastModified) {
    const fileModDate = new Date(fileLastModified);
    
    if (isForged) {
      created = new Date(fileModDate.getTime() - (1000 * 60 * 60 * 24 * Math.random() * 30));
      modified = fileModDate;
    } else {
      created = fileModDate;
      modified = fileModDate;
    }
  } else {
    if (isForged) {
      created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365);
      modified = new Date(created.getTime() + (1000 * 60 * 60 * 24) + Math.random() * 1000 * 60 * 60 * 24 * 29);
    } else {
      created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30);
      modified = Math.random() > 0.5 
        ? new Date(created.getTime())
        : new Date(created.getTime() + Math.random() * 1000 * 60 * 5);
    }
  }

  const issues = [];
  
  if (isForged) {
    issues.push({
      type: 'Critical',
      description: 'Pixel inconsistencies detected in image',
      location: 'Bottom right quadrant'
    });
    
    if (modified.getTime() - created.getTime() > 1000 * 60 * 60 * 12) {
      issues.push({
        type: 'Warning',
        description: 'Metadata timestamp anomalies: modified date significantly later than creation date',
        location: 'File properties'
      });
    }
    
    issues.push({
      type: 'Critical',
      description: 'Unnatural pixel transitions detected at edit boundaries',
      location: 'Multiple areas of image'
    });
    
    if (Math.random() > 0.3) {
      issues.push({
        type: 'Critical',
        description: 'Digital signature mismatch detected',
        location: 'Document metadata'
      });
    }
    
    if (Math.random() > 0.5) {
      issues.push({
        type: 'Critical',
        description: 'Basic editing software artifacts detected (MS Paint-like patterns)',
        location: 'Throughout image'
      });
    }
  } else if (Math.random() > 0.9) {
    issues.push({
      type: 'Info',
      description: 'Compression artifacts present but consistent with file format',
      location: 'Throughout image'
    });
  }

  const manipulationTypes: ('Clone' | 'Edited' | 'Added' | 'Removed')[] = ['Clone', 'Edited', 'Added', 'Removed'];
  
  const manipulationAreas = isForged ? [
    {
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      type: manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)],
      confidence: Math.random() * 10 + 90
    },
    {
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 15 + 5,
      height: Math.random() * 15 + 5,
      type: 'Edited' as const,
      confidence: Math.random() * 5 + 95
    }
  ] : undefined;
  
  if (isForged && Math.random() > 0.3) {
    const randomType = manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)];
    manipulationAreas?.push({
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      type: randomType,
      confidence: Math.random() * 10 + 90
    });
  }

  return {
    authenticity: Math.round(authenticity * 10) / 10,
    status,
    metadata: {
      fileName: 'document.jpg',
      fileType: 'JPEG Image',
      fileSize: `${Math.floor(Math.random() * 10) + 1}.${Math.floor(Math.random() * 100)}MB`,
      dateCreated: created.toISOString(),
      dateModified: modified.toISOString()
    },
    issues,
    manipulationAreas
  };
};

export const simulateScan = async (file: File): Promise<ScanResult> => {
  console.log(`Starting scan simulation for file: ${file.name}`);
  
  const metadata = await extractMetadata(file);
  console.log('Extracted metadata:', metadata);
  
  const authenticity = Math.floor(Math.random() * 100);
  
  let status: 'Secure' | 'Suspicious' | 'Forged';
  if (authenticity >= 90) {
    status = 'Secure';
  } else if (authenticity >= 60) {
    status = 'Suspicious';
  } else {
    status = 'Forged';
  }
  
  const issues: Issue[] = [];
  
  if (authenticity < 60) {
    issues.push({
      type: 'Critical',
      description: 'Significant metadata inconsistencies detected. This file appears to have been manipulated.',
      location: 'File metadata'
    });
    
    const potentialIssues = [
      {
        type: 'Critical',
        description: 'Digital signature verification failed. The file has been modified after signing.',
        location: 'Digital signature'
      },
      {
        type: 'Critical',
        description: 'Pixel manipulation detected in multiple regions. Evidence of digital alteration.',
        location: 'Image content'
      },
      {
        type: 'Warning',
        description: 'Inconsistent compression patterns detected. Possible sign of splicing or content replacement.',
        location: 'Image data'
      }
    ];
    
    const numIssues = Math.floor(Math.random() * 3) + 1;
    for (let i = 0; i < numIssues; i++) {
      const issueIndex = Math.floor(Math.random() * potentialIssues.length);
      issues.push(potentialIssues[issueIndex]);
      potentialIssues.splice(issueIndex, 1);
      if (potentialIssues.length === 0) break;
    }
  } else if (authenticity < 90) {
    issues.push({
      type: 'Warning',
      description: 'Minor inconsistencies detected in file metadata. The file may have been edited.',
      location: 'File metadata'
    });
    
    const potentialIssues = [
      {
        type: 'Warning',
        description: 'Software artifacts detected. This document was processed with editing software.',
        location: 'Document properties'
      },
      {
        type: 'Warning',
        description: 'Timestamp anomalies detected. Creation and modification dates show unusual patterns.',
        location: 'Metadata'
      },
      {
        type: 'Info',
        description: 'File saved with different software than it was created with. May indicate editing.',
        location: 'Software information'
      }
    ];
    
    const numIssues = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numIssues; i++) {
      const issueIndex = Math.floor(Math.random() * potentialIssues.length);
      issues.push(potentialIssues[issueIndex]);
      potentialIssues.splice(issueIndex, 1);
      if (potentialIssues.length === 0) break;
    }
  }
  
  const formattedMetadata = {
    fileType: metadata.fileType,
    fileSize: metadata.fileSize,
    dateCreated: metadata.creationDate?.toISOString() || new Date().toISOString(),
    dateModified: metadata.modificationDate?.toISOString() || new Date().toISOString(),
    software: metadata.software || 'Unknown',
    device: metadata.device || 'Unknown',
    dimensions: metadata.dimensions 
      ? `${metadata.dimensions.width}×${metadata.dimensions.height}`
      : 'Unknown',
    additionalMetadata: metadata.additionalInfo || {}
  };
  
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500));
  
  return {
    status,
    authenticity,
    metadata: formattedMetadata,
    issues
  };
};
