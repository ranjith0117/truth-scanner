
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

export const generateMockScanResult = (isForged: boolean = false): ScanResult => {
  // Generate a random authenticity score
  const authenticity = isForged 
    ? Math.random() * 60 + 20 // 20-80% for forged documents
    : Math.random() * 10 + 90; // 90-100% for authentic documents

  const status = authenticity > 90 
    ? 'Secure' 
    : authenticity > 60 
      ? 'Suspicious' 
      : 'Forged';

  const now = new Date();
  const created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365);
  const modified = isForged 
    ? new Date(created.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30) 
    : created;

  const issues = [];
  
  if (isForged) {
    issues.push({
      type: 'Critical',
      description: 'Pixel inconsistencies detected in image',
      location: 'Bottom right quadrant'
    });
    issues.push({
      type: 'Warning',
      description: 'Metadata timestamp anomalies',
      location: 'File properties'
    });
    
    // Add additional issues for forged documents
    if (Math.random() > 0.5) {
      issues.push({
        type: 'Critical',
        description: 'Digital signature mismatch detected',
        location: 'Document metadata'
      });
    }
  } else if (Math.random() > 0.7) {
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
      confidence: Math.random() * 20 + 80
    }
  ] : undefined;
  
  // Add additional manipulation areas for heavily forged documents
  if (isForged && authenticity < 40 && Math.random() > 0.5) {
    manipulationAreas?.push({
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      type: manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)],
      confidence: Math.random() * 20 + 80
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

export const simulateScan = (file: File): Promise<ScanResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Increase probability of forged documents to 60% instead of 30%
      const isForged = Math.random() > 0.4;
      resolve(generateMockScanResult(isForged));
    }, 3000);
  });
};
