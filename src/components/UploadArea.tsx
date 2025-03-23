
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, FileImage, FileText, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { simulateScan } from '@/lib/mockData';

interface UploadAreaProps {
  onScanComplete?: (result: any) => void;
}

const UploadArea = ({ onScanComplete }: UploadAreaProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const processFile = useCallback(async (file: File) => {
    setIsLoading(true);
    setFile(file);

    // Simulate a progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return prev;
        }
        return prev + 10;
      });
    }, 300);

    try {
      console.log("Processing file:", file.name, file.type, file.size);
      console.log("File last modified:", new Date(file.lastModified).toLocaleString());
      
      // Show initial extraction toast
      toast({
        title: "Analyzing File",
        description: "Extracting metadata and analyzing content...",
      });
      
      const result = await simulateScan(file);
      console.log("Scan result:", result);
      setProgress(100);
      
      setTimeout(() => {
        setIsLoading(false);
        if (onScanComplete) {
          onScanComplete(result);
        } else {
          // Store result in sessionStorage and navigate to results
          sessionStorage.setItem('scanResult', JSON.stringify(result));
          sessionStorage.setItem('fileName', file.name);
          // Also store file last modified date for reference
          sessionStorage.setItem('fileLastModified', file.lastModified.toString());
          toast({
            title: "Analysis Complete",
            description: `Authenticity score: ${result.authenticity}%`,
            variant: result.authenticity >= 90 ? "default" : result.authenticity >= 60 ? "secondary" : "destructive"
          });
          navigate('/results');
        }
      }, 500);
    } catch (error) {
      console.error("Scan failed:", error);
      toast({
        title: "Scan Failed",
        description: "There was an error processing your file.",
        variant: "destructive"
      });
      setIsLoading(false);
      setProgress(0);
    }
  }, [navigate, onScanComplete, toast]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check if file is an image or PDF
      if (droppedFile.type.match('image.*') || droppedFile.type === 'application/pdf') {
        processFile(droppedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image or PDF document.",
          variant: "destructive"
        });
      }
    }
  }, [processFile, toast]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check if file is an image or PDF
      if (selectedFile.type.match('image.*') || selectedFile.type === 'application/pdf') {
        processFile(selectedFile);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image or PDF document.",
          variant: "destructive"
        });
      }
    }
  }, [processFile, toast]);

  const removeFile = useCallback(() => {
    setFile(null);
    setProgress(0);
    setIsLoading(false);
  }, []);

  if (isLoading && file) {
    return (
      <div className="glass-card p-8 rounded-2xl min-h-[300px] w-full flex flex-col items-center justify-center space-y-6">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-truthscan-blue animate-spin mx-auto mb-5" />
          <h3 className="text-white font-medium mb-1">Analyzing {file.name}</h3>
          <p className="text-white/70 text-sm mb-4">
            Our AI is examining your document for signs of manipulation...
          </p>
        </div>
        
        <div className="w-full max-w-md bg-truthscan-gray/40 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-truthscan-blue h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <div className="text-white/50 text-sm">
          {progress < 30 && "Analyzing metadata..."}
          {progress >= 30 && progress < 60 && "Examining pixel patterns..."}
          {progress >= 60 && progress < 90 && "Detecting inconsistencies..."}
          {progress >= 90 && "Generating report..."}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card p-8 rounded-2xl min-h-[300px] w-full transition-all duration-300 ${
        isDragging ? 'border-truthscan-blue bg-truthscan-blue/5' : ''
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="w-16 h-16 bg-truthscan-blue/10 rounded-full flex items-center justify-center mb-6">
          <Upload className="w-8 h-8 text-truthscan-blue" />
        </div>
        
        <h3 className="text-white font-medium mb-2">
          Drag & drop your file here
        </h3>
        
        <p className="text-white/70 mb-6 max-w-md">
          Upload an image or document to scan for manipulations, forgeries, or signs of AI generation
        </p>
        
        <div className="flex items-center space-x-4 mb-8">
          <div className="flex items-center text-white/60 text-sm">
            <FileImage className="w-4 h-4 mr-1 text-truthscan-blue" />
            <span>Images</span>
          </div>
          <div className="flex items-center text-white/60 text-sm">
            <FileText className="w-4 h-4 mr-1 text-truthscan-blue" />
            <span>PDFs</span>
          </div>
        </div>
        
        <div className="relative">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
            accept="image/*,application/pdf"
          />
          <button className="px-6 py-2.5 bg-truthscan-blue rounded-lg text-white font-medium text-sm hover:bg-truthscan-blue/90 transition-colors">
            Select File
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadArea;
