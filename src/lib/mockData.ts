
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
  
  // For authentic documents, created and modified dates should be identical or very close
  // For forged documents, create a noticeable time gap
  let created, modified;
  
  if (isForged) {
    // For forged documents, create dates with suspicious gaps
    created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 365); // Up to a year ago
    // Add a significant gap for forged documents (at least 1 day, up to 30 days)
    modified = new Date(created.getTime() + (1000 * 60 * 60 * 24) + Math.random() * 1000 * 60 * 60 * 24 * 29);
  } else {
    // For authentic documents, dates should be same or very close (within minutes)
    created = new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 30); // Up to a month ago
    // Either exact same date or very small difference (0-5 minutes) for legitimate files
    modified = Math.random() > 0.5 
      ? new Date(created.getTime()) // Exact same timestamp
      : new Date(created.getTime() + Math.random() * 1000 * 60 * 5); // 0-5 minute difference
  }

  const issues = [];
  
  if (isForged) {
    // Add standard forgery issues
    issues.push({
      type: 'Critical',
      description: 'Pixel inconsistencies detected in image',
      location: 'Bottom right quadrant'
    });
    
    // Only add timestamp anomaly issue if there's a significant gap
    if (modified.getTime() - created.getTime() > 1000 * 60 * 60 * 12) { // If gap is > 12 hours
      issues.push({
        type: 'Warning',
        description: 'Metadata timestamp anomalies: modified date significantly later than creation date',
        location: 'File properties'
      });
    }
    
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
