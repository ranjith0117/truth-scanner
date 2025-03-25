
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

// Simulated scan function that returns results after a delay
export const simulateScan = async (file: File): Promise<ScanResult> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Extract basic file info
  const { name, type, size, lastModified } = file;
  
  // Determine if this is an image or document
  const isImage = type.startsWith('image/');
  const isPDF = type === 'application/pdf';
  
  // Generate a random authenticity score between 30 and 100
  let authenticityScore: number;
  
  // Randomly decide if the file is authentic or not
  const isAuthentic = Math.random() > 0.3;
  
  if (isAuthentic) {
    // Higher score for authentic files (85-100)
    authenticityScore = Math.floor(Math.random() * 16) + 85;
  } else {
    // Lower score for non-authentic files (30-84)
    authenticityScore = Math.floor(Math.random() * 55) + 30;
  }
  
  // Generate manipulations based on authenticity score
  const manipulations: Manipulation[] = [];
  const anomalies: Anomaly[] = [];
  
  if (authenticityScore < 85) {
    // Add some manipulations for non-authentic files
    if (isImage) {
      // Image-specific manipulations
      if (authenticityScore < 50) {
        manipulations.push({
          type: 'pixel_manipulation',
          severity: 'high',
          description: 'Significant pixel alterations detected in multiple areas',
          confidence: Math.random() * 20 + 80, // 80-100% confidence
        });
        
        manipulations.push({
          type: 'ai_generation',
          severity: 'high',
          description: 'AI generation artifacts detected',
          confidence: Math.random() * 15 + 80, // 80-95% confidence
        });
        
        anomalies.push({
          type: 'inconsistent_lighting',
          description: 'Lighting inconsistencies detected across the image',
          confidence: Math.random() * 20 + 75, // 75-95% confidence
        });
      } else {
        manipulations.push({
          type: 'clone_stamp',
          severity: 'medium',
          description: 'Possible clone stamp tool usage detected',
          confidence: Math.random() * 30 + 60, // 60-90% confidence
        });
        
        anomalies.push({
          type: 'metadata_mismatch',
          description: 'Image metadata does not match content characteristics',
          confidence: Math.random() * 25 + 65, // 65-90% confidence
        });
      }
    } else if (isPDF) {
      // PDF-specific manipulations
      if (authenticityScore < 50) {
        manipulations.push({
          type: 'text_modification',
          severity: 'high',
          description: 'Text has been modified or replaced',
          confidence: Math.random() * 15 + 80, // 80-95% confidence
        });
        
        manipulations.push({
          type: 'signature_forgery',
          severity: 'high',
          description: 'Possible signature forgery detected',
          confidence: Math.random() * 10 + 85, // 85-95% confidence
        });
        
        anomalies.push({
          type: 'inconsistent_fonts',
          description: 'Font inconsistencies detected throughout document',
          confidence: Math.random() * 15 + 80, // 80-95% confidence
        });
      } else {
        manipulations.push({
          type: 'page_manipulation',
          severity: 'medium',
          description: 'Possible page content alteration',
          confidence: Math.random() * 30 + 60, // 60-90% confidence
        });
        
        anomalies.push({
          type: 'metadata_alteration',
          description: 'Document metadata appears to have been modified',
          confidence: Math.random() * 20 + 70, // 70-90% confidence
        });
      }
    }
  } else {
    // For authentic files, sometimes add a low-confidence, low-severity possible manipulation
    if (Math.random() > 0.7) {
      if (isImage) {
        manipulations.push({
          type: 'compression_artifacts',
          severity: 'low',
          description: 'Normal compression artifacts detected',
          confidence: Math.random() * 40 + 30, // 30-70% confidence
        });
      } else if (isPDF) {
        manipulations.push({
          type: 'standard_editing',
          severity: 'low',
          description: 'Standard PDF editing patterns detected',
          confidence: Math.random() * 40 + 30, // 30-70% confidence
        });
      }
    }
  }
  
  // Generate mock metadata
  const metadata: Record<string, any> = {
    fileFormat: type,
    fileSize: size,
    creationDate: new Date(lastModified).toISOString(),
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
    metadata.pageCount = Math.floor(Math.random() * 10) + 1; // 1-10 pages
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
  };
};

// Export some example data for testing UI components
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
    dimensions: '1920x1080',
    colorSpace: 'RGB',
    bitDepth: 24,
    compressionType: 'JPEG',
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
};
