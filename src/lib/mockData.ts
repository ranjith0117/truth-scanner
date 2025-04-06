
// This file contains mock data and simulation functions for the TruthScan application

// Define the shape of scan results
export interface ScanResult {
  authenticity: number;
  manipulations: Manipulation[];
  metadata: Record<string, any>;
  fileName: string;
  fileType: string;
  fileSize: number;
  lastModified: number;
  anomalies: Anomaly[];
  timestamp: number;
  status: 'Secure' | 'Suspicious' | 'Forged'; // Add status property
  issues: Issue[]; // Add issues property
}

export interface Manipulation {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  location?: string;
  confidence: number;
}

export interface Anomaly {
  type: string;
  description: string;
  confidence: number;
}

// Add new Issue interface for the issues property
export interface Issue {
  type: 'Critical' | 'Warning' | 'Info';
  description: string;
  location?: string;
}

// Create a pseudo-random number generator with a fixed seed of 42
const createRandomGenerator = () => {
  let seed = 42;
  return () => {
    // Simple LCG algorithm
    seed = (seed * 1664525 + 1013904223) % 2147483648;
    return seed / 2147483648;
  };
};

// Generate random number between min and max using our seeded random function
const getRandomNumber = (() => {
  const random = createRandomGenerator();
  return (min: number, max: number) => {
    return min + random() * (max - min);
  };
})();

// Simulated scan function that returns results after a delay
export const simulateScan = async (file: File): Promise<ScanResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract basic file info
  const { name, type, size, lastModified } = file;
  
  // Determine if this is an image or document
  const isImage = type.startsWith('image/');
  const isPDF = type === 'application/pdf';
  
  // Generate a authenticity score using our seeded random generator
  let authenticityScore: number;
  
  // Randomly decide if the file is authentic or not
  const isAuthentic = getRandomNumber(0, 1) > 0.3;
  
  if (isAuthentic) {
    // Higher score for authentic files (85-100)
    authenticityScore = Math.floor(getRandomNumber(85, 101));
  } else {
    // Lower score for non-authentic files (30-84)
    authenticityScore = Math.floor(getRandomNumber(30, 85));
  }

  // Determine status based on authenticity score
  let status: 'Secure' | 'Suspicious' | 'Forged';
  if (authenticityScore >= 85) {
    status = 'Secure';
  } else if (authenticityScore >= 60) {
    status = 'Suspicious';
  } else {
    status = 'Forged';
  }
  
  // Generate manipulations based on authenticity score
  const manipulations: Manipulation[] = [];
  const anomalies: Anomaly[] = [];
  const issues: Issue[] = [];
  
  if (authenticityScore < 85) {
    // Add some manipulations for non-authentic files
    if (isImage) {
      // Image-specific manipulations
      if (authenticityScore < 50) {
        manipulations.push({
          type: 'pixel_manipulation',
          severity: 'high',
          description: 'Significant pixel alterations detected in multiple areas',
          confidence: getRandomNumber(80, 100), // 80-100% confidence
        });
        
        manipulations.push({
          type: 'ai_generation',
          severity: 'high',
          description: 'AI generation artifacts detected',
          confidence: getRandomNumber(80, 95), // 80-95% confidence
        });
        
        anomalies.push({
          type: 'inconsistent_lighting',
          description: 'Lighting inconsistencies detected across the image',
          confidence: getRandomNumber(75, 95), // 75-95% confidence
        });

        // Add corresponding issues
        issues.push({
          type: 'Critical',
          description: 'Significant pixel alterations detected in multiple areas',
          location: 'Throughout image'
        });

        issues.push({
          type: 'Critical',
          description: 'AI generation artifacts detected',
        });
      } else {
        manipulations.push({
          type: 'clone_stamp',
          severity: 'medium',
          description: 'Possible clone stamp tool usage detected',
          confidence: getRandomNumber(60, 90), // 60-90% confidence
        });
        
        anomalies.push({
          type: 'metadata_mismatch',
          description: 'Image metadata does not match content characteristics',
          confidence: getRandomNumber(65, 90), // 65-90% confidence
        });

        // Add corresponding issues
        issues.push({
          type: 'Warning',
          description: 'Possible clone stamp tool usage detected',
          location: 'Lower right quadrant'
        });

        issues.push({
          type: 'Warning',
          description: 'Image metadata does not match content characteristics',
        });
      }
    } else if (isPDF) {
      // PDF-specific manipulations
      if (authenticityScore < 50) {
        manipulations.push({
          type: 'text_modification',
          severity: 'high',
          description: 'Text has been modified or replaced',
          confidence: getRandomNumber(80, 95), // 80-95% confidence
        });
        
        manipulations.push({
          type: 'signature_forgery',
          severity: 'high',
          description: 'Possible signature forgery detected',
          confidence: getRandomNumber(85, 95), // 85-95% confidence
        });
        
        anomalies.push({
          type: 'inconsistent_fonts',
          description: 'Font inconsistencies detected throughout document',
          confidence: getRandomNumber(80, 95), // 80-95% confidence
        });

        // Add corresponding issues
        issues.push({
          type: 'Critical',
          description: 'Text has been modified or replaced',
          location: 'Page 2, paragraph 3'
        });

        issues.push({
          type: 'Critical',
          description: 'Possible signature forgery detected',
          location: 'Last page'
        });
      } else {
        manipulations.push({
          type: 'page_manipulation',
          severity: 'medium',
          description: 'Possible page content alteration',
          confidence: getRandomNumber(60, 90), // 60-90% confidence
        });
        
        anomalies.push({
          type: 'metadata_alteration',
          description: 'Document metadata appears to have been modified',
          confidence: getRandomNumber(70, 90), // 70-90% confidence
        });

        // Add corresponding issues
        issues.push({
          type: 'Warning',
          description: 'Possible page content alteration',
          location: 'Page 1'
        });

        issues.push({
          type: 'Warning',
          description: 'Document metadata appears to have been modified',
        });
      }
    }
  } else {
    // For authentic files, sometimes add a low-confidence, low-severity possible manipulation
    if (getRandomNumber(0, 1) > 0.7) {
      if (isImage) {
        manipulations.push({
          type: 'compression_artifacts',
          severity: 'low',
          description: 'Normal compression artifacts detected',
          confidence: getRandomNumber(30, 70), // 30-70% confidence
        });

        // Add corresponding issue
        issues.push({
          type: 'Info',
          description: 'Normal compression artifacts detected',
        });
      } else if (isPDF) {
        manipulations.push({
          type: 'standard_editing',
          severity: 'low',
          description: 'Standard PDF editing patterns detected',
          confidence: getRandomNumber(30, 70), // 30-70% confidence
        });

        // Add corresponding issue
        issues.push({
          type: 'Info',
          description: 'Standard PDF editing patterns detected',
        });
      }
    }
  }
  
  // Generate mock metadata
  const metadata: Record<string, any> = {
    fileFormat: type,
    fileSize: size,
    creationDate: new Date(lastModified).toISOString(),
    // Add creation and modification dates
    dateCreated: new Date(lastModified - getRandomNumber(0, 30 * 24 * 60 * 60 * 1000)).toISOString(), // Random date within last 30 days
    dateModified: new Date(lastModified).toISOString(),
    fileType: type
  };
  
  // Add image-specific metadata
  if (isImage) {
    metadata.dimensions = '1920x1080'; // Mock dimensions
    metadata.colorSpace = 'RGB';
    metadata.bitDepth = 24;
    metadata.compressionType = type === 'image/jpeg' ? 'JPEG' : (type === 'image/png' ? 'PNG' : 'Unknown');
  }
  
  // Add PDF-specific metadata
  if (isPDF) {
    metadata.pageCount = Math.floor(getRandomNumber(1, 11)); // 1-10 pages
    metadata.pdfVersion = '1.7';
    metadata.author = 'Unknown';
    metadata.creationSoftware = 'Adobe Acrobat';
  }
  
  return {
    authenticity: authenticityScore,
    manipulations,
    metadata,
    fileName: name,
    fileType: type,
    fileSize: size,
    lastModified,
    anomalies,
    timestamp: Date.now(),
    status,
    issues,
  };
};

// Update the example data to match our fixed random seed approach
export const exampleScanResult: ScanResult = {
  authenticity: 42,
  manipulations: [
    {
      type: 'pixel_manipulation',
      severity: 'high',
      description: 'Significant pixel alterations detected across multiple regions',
      confidence: 92.3,
    },
    {
      type: 'ai_generation',
      severity: 'high',
      description: 'AI generation artifacts detected throughout image',
      confidence: 87.8,
    }
  ],
  metadata: {
    fileFormat: 'image/jpeg',
    fileSize: 2345678,
    creationDate: '2023-05-15T10:30:45.000Z',
    dateCreated: '2023-05-10T08:45:21.000Z',
    dateModified: '2023-05-15T10:30:45.000Z',
    dimensions: '1920x1080',
    colorSpace: 'RGB',
    bitDepth: 24,
    compressionType: 'JPEG',
    fileType: 'image/jpeg'
  },
  fileName: 'suspect_image.jpg',
  fileType: 'image/jpeg',
  fileSize: 2345678,
  lastModified: 1684144245000,
  anomalies: [
    {
      type: 'noise_pattern',
      description: 'Inconsistent noise patterns detected',
      confidence: 88.5,
    },
    {
      type: 'lighting_inconsistency',
      description: 'Lighting angles inconsistent across the image',
      confidence: 79.3,
    }
  ],
  timestamp: 1684144245000,
  status: 'Forged',
  issues: [
    {
      type: 'Critical',
      description: 'Significant pixel alterations detected across multiple regions',
      location: 'Throughout image'
    },
    {
      type: 'Critical',
      description: 'AI generation artifacts detected throughout image'
    },
    {
      type: 'Warning',
      description: 'Lighting angles inconsistent across the image'
    }
  ]
};
