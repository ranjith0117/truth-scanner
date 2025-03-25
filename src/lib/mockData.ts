import { extractMetadata } from './metadataExtractor';

export interface ScanResult {
  status: string;
  authenticity: number;
  issues: { type: string; description: string; location?: string }[];
  metadata?: {
    dateCreated: string;
    dateModified: string;
    fileType: string;
    fileSize: string;
    dimensions?: string;
    software?: string;
  };
}

const mockIssues = {
  Critical: [
    "Inconsistencies detected in file metadata",
    "Evidence of digital alteration found",
    "File structure anomalies indicate potential tampering",
    "Critical security risks detected",
    "Suspected forgery: signature mismatch"
  ],
  Warning: [
    "Minor discrepancies in file timestamps",
    "Presence of unusual metadata entries",
    "Slight variations from original file format",
    "Potential data loss or corruption",
    "Unverified digital signature"
  ],
  Info: [
    "File contains standard metadata",
    "No immediate security threats detected",
    "Document adheres to common formatting standards",
    "Metadata is consistent with file type",
    "Digital signature is present but not verified"
  ]
};

const mockLocations = [
  "Header Section",
  "Footer Section",
  "Metadata Block",
  "Image Pixels",
  "Embedded Objects"
];

const mockSoftware = [
  "Adobe Photoshop",
  "GIMP",
  "ImageMagick",
  "Microsoft Word",
  "LibreOffice Writer"
];

function getRandomIssue(type: string): string {
  const issueList = mockIssues[type as keyof typeof mockIssues];
  return issueList[Math.floor(Math.random() * issueList.length)];
}

function getRandomLocation(): string | undefined {
  return mockLocations[Math.floor(Math.random() * mockLocations.length)];
}

export const simulateScan = async (file: File): Promise<ScanResult> => {
  // Simulate a scan with a delay
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  console.log("Simulating scan for file:", file.name);
  
  try {
    // Extract real metadata from the file
    const extractedMetadata = await extractMetadata(file);
    console.log("Extracted metadata:", extractedMetadata);
    
    // Generate a random authenticity score
    const randomScore = Math.floor(Math.random() * 100) + 1;
    
    // Determine status based on score
    let status = 'Secure';
    if (randomScore < 60) {
      status = 'Forged';
    } else if (randomScore < 90) {
      status = 'Suspicious';
    }
    
    // Generate random issues based on the score
    const issues = [];
    
    if (randomScore < 90) {
      const issueCount = Math.floor((100 - randomScore) / 20) + 1;
      
      for (let i = 0; i < issueCount; i++) {
        const issueType = randomScore < 60 ? 'Critical' : 'Warning';
        
        // Add a random issue
        issues.push({
          type: issueType,
          description: getRandomIssue(issueType),
          location: getRandomLocation()
        });
      }
    }
    
    // Create a metadata object from the extracted real metadata
    const metadata = {
      dateCreated: extractedMetadata.creationDate ? extractedMetadata.creationDate.toISOString() : new Date().toISOString(),
      dateModified: extractedMetadata.modificationDate ? extractedMetadata.modificationDate.toISOString() : new Date().toISOString(),
      fileType: extractedMetadata.fileType || file.type,
      fileSize: extractedMetadata.fileSize || formatFileSize(file.size),
      dimensions: extractedMetadata.dimensions ? `${extractedMetadata.dimensions.width}x${extractedMetadata.dimensions.height}` : undefined,
      software: extractedMetadata.software || 'Unknown'
    };
    
    // Return the scan result with real metadata
    return {
      status,
      authenticity: randomScore,
      issues,
      metadata
    };
  } catch (error) {
    console.error("Error simulating scan:", error);
    // Return a fallback result in case of error
    return {
      status: 'Suspicious',
      authenticity: 75,
      issues: [{
        type: 'Warning',
        description: 'Unable to fully analyze file. Some verification features limited.',
        location: 'General'
      }],
      metadata: {
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString(),
        fileType: file.type || 'Unknown',
        fileSize: formatFileSize(file.size)
      }
    };
  }
};

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  else return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}
