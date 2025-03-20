
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
  // Generate a more polarized authenticity score - either very high or much lower for forged
  const authenticity = isForged 
    ? Math.random() * 40 + 10 // 10-50% for forged documents (lower score than before)
    : Math.random() * 5 + 95; // 95-100% for authentic documents (higher score than before)

  // Make status thresholds stricter
  const status = authenticity > 90 
    ? 'Secure' 
    : authenticity > 50 
      ? 'Suspicious' 
      : 'Forged';

  const now = new Date();
  const created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365);
  
  // Always create a time gap for modified vs created dates on forged documents
  const modified = isForged 
    ? new Date(created.getTime() + Math.random() * 1000 * 60 * 60 * 24 * 30 + 1000 * 60 * 60) 
    : created;

  const issues = [];
  
  if (isForged) {
    // Add standard forgery issues
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
    
    // Add more detailed forgery issues
    issues.push({
      type: 'Critical',
      description: 'Unnatural pixel transitions detected at edit boundaries',
      location: 'Multiple areas of image'
    });
    
    // Add additional issues for forged documents
    if (Math.random() > 0.3) { // Increased probability of showing this issue
      issues.push({
        type: 'Critical',
        description: 'Digital signature mismatch detected',
        location: 'Document metadata'
      });
    }
    
    // Add MS Paint specific detection
    if (Math.random() > 0.5) {
      issues.push({
        type: 'Critical',
        description: 'Basic editing software artifacts detected (MS Paint-like patterns)',
        location: 'Throughout image'
      });
    }
  } else if (Math.random() > 0.9) { // Reduced chance of issues in secure documents
    issues.push({
      type: 'Info',
      description: 'Compression artifacts present but consistent with file format',
      location: 'Throughout image'
    });
  }

  const manipulationTypes: ('Clone' | 'Edited' | 'Added' | 'Removed')[] = ['Clone', 'Edited', 'Added', 'Removed'];
  
  // Create more manipulation areas for forged images
  const manipulationAreas = isForged ? [
    {
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      type: manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)],
      confidence: Math.random() * 10 + 90 // Higher confidence (90-100%)
    },
    {
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 15 + 5,
      height: Math.random() * 15 + 5,
      type: 'Edited' as const, // Always include at least one "Edited" area
      confidence: Math.random() * 5 + 95 // Very high confidence (95-100%)
    }
  ] : undefined;
  
  // Add additional manipulation areas for heavily forged documents
  if (isForged && Math.random() > 0.3) { // Increased probability of additional manipulation areas
    const randomType = manipulationTypes[Math.floor(Math.random() * manipulationTypes.length)];
    manipulationAreas?.push({
      x: Math.random() * 70 + 10,
      y: Math.random() * 70 + 10,
      width: Math.random() * 20 + 10,
      height: Math.random() * 20 + 10,
      type: randomType, // Fixed: Explicitly use a typed value from the array
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

export const simulateScan = (file: File): Promise<ScanResult> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Fix: Change back to a more reasonable probability (40% chance of detecting forgery)
      // This means 60% of scans will show legitimate results for unedited documents
      const isForged = Math.random() < 0.4;
      resolve(generateMockScanResult(isForged));
    }, 3000);
  });
};
