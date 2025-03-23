import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, AlertTriangle, Check, ChevronRight, Info, Download, File } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ScanResult } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

const Results = () => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [fileName, setFileName] = useState<string>('document.jpg');
  const [fileLastModified, setFileLastModified] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Retrieve result from sessionStorage
    const storedResult = sessionStorage.getItem('scanResult');
    const storedFileName = sessionStorage.getItem('fileName');
    const storedLastModified = sessionStorage.getItem('fileLastModified');
    
    if (!storedResult) {
      // If no result in storage, redirect to scanner
      navigate('/scanner');
      return;
    }
    
    try {
      const parsedResult = JSON.parse(storedResult) as ScanResult;
      setResult(parsedResult);
      if (storedFileName) {
        setFileName(storedFileName);
      }
      if (storedLastModified) {
        setFileLastModified(parseInt(storedLastModified));
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load scan results",
        variant: "destructive"
      });
      navigate('/scanner');
    }
  }, [navigate, toast]);

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin-slow mb-6">
              <Shield className="w-12 h-12 text-truthscan-blue mx-auto" />
            </div>
            <h2 className="text-xl text-white font-medium">Loading results...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Secure':
        return 'text-truthscan-green';
      case 'Suspicious':
        return 'text-truthscan-yellow';
      case 'Forged':
        return 'text-truthscan-red';
      default:
        return 'text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Secure':
        return <Check className="w-5 h-5 text-truthscan-green" />;
      case 'Suspicious':
        return <AlertTriangle className="w-5 h-5 text-truthscan-yellow" />;
      case 'Forged':
        return <AlertTriangle className="w-5 h-5 text-truthscan-red" />;
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-truthscan-green';
    if (score >= 60) return 'text-truthscan-yellow';
    return 'text-truthscan-red';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const analyzeDates = (createdDate: string, modifiedDate: string): { 
    isDiscrepancy: boolean, 
    timeDiff: string,
    severity: 'normal' | 'suspicious' | 'critical' 
  } => {
    const created = new Date(createdDate).getTime();
    const modified = new Date(modifiedDate).getTime();
    const diffInMs = modified - created;
    
    let timeDiff = '';
    const seconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      timeDiff = `${days} day${days > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      timeDiff = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (minutes > 0) {
      timeDiff = `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else if (seconds > 0) {
      timeDiff = `${seconds} second${seconds > 1 ? 's' : ''}`;
    } else {
      timeDiff = 'No difference';
    }
    
    let severity: 'normal' | 'suspicious' | 'critical' = 'normal';
    
    if (diffInMs === 0 || diffInMs < 5 * 60 * 1000) {
      severity = 'normal';
    } else if (diffInMs < 60 * 60 * 1000) {
      severity = 'suspicious';
    } else {
      severity = 'critical';
    }
    
    return {
      isDiscrepancy: diffInMs > 5 * 60 * 1000,
      timeDiff,
      severity
    };
  };

  const getDateColor = (severity: 'normal' | 'suspicious' | 'critical') => {
    switch (severity) {
      case 'normal':
        return 'text-white/90';
      case 'suspicious':
        return 'text-truthscan-yellow';
      case 'critical':
        return 'text-truthscan-red';
      default:
        return 'text-white/90';
    }
  };

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'Critical':
        return <AlertTriangle className="w-5 h-5 text-truthscan-red" />;
      case 'Warning':
        return <AlertTriangle className="w-5 h-5 text-truthscan-yellow" />;
      case 'Info':
        return <Info className="w-5 h-5 text-truthscan-blue" />;
      default:
        return <Info className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <File className="w-5 h-5 text-white/70" />
                  <span className="text-white/70">{fileName}</span>
                </div>
                <h1 className="text-3xl font-bold text-white">Scan Results</h1>
              </div>
              
              <button 
                className="px-5 py-2 bg-truthscan-dark-gray hover:bg-truthscan-gray text-white rounded-lg flex items-center gap-2 text-sm transition-colors"
                onClick={() => navigate('/scanner')}
              >
                <span>New Scan</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="glass-card rounded-xl p-6 md:p-8 mb-8">
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-4">
                    {getStatusIcon(result.status)}
                    <span className={`font-medium ${getStatusColor(result.status)}`}>
                      Scan Status: {result.status}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-white mb-2">Authenticity Score</h3>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-bold ${getScoreColor(result.authenticity)}`}>
                        {result.authenticity}%
                      </span>
                      <span className="text-white/50 text-sm mb-1">confidence</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-white mb-2">Analysis Summary</h3>
                    <p className="text-white/70">
                      {result.status === 'Secure' 
                        ? 'No signs of manipulation detected. This document appears to be authentic.'
                        : result.status === 'Suspicious'
                          ? 'Some anomalies detected. Manual verification is recommended.'
                          : 'This document shows strong evidence of manipulation or forgery.'}
                    </p>
                  </div>
                </div>
                
                <div className="bg-truthscan-gray/30 rounded-lg p-6 min-w-[280px]">
                  <h3 className="text-white mb-4">File Information</h3>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-white/50 text-sm">File Name:</span>
                      <span className="text-white/90 text-sm">{fileName}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-white/50 text-sm">File Type:</span>
                      <span className="text-white/90 text-sm">{result.metadata.fileType}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-white/50 text-sm">File Size:</span>
                      <span className="text-white/90 text-sm">{result.metadata.fileSize}</span>
                    </div>
                    
                    {result && (
                      <>
                        {(() => {
                          const dateAnalysis = analyzeDates(
                            result.metadata.dateCreated, 
                            result.metadata.dateModified
                          );
                          
                          return (
                            <>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-white/50 text-sm">Created:</span>
                                <span className={getDateColor(dateAnalysis.severity)}>
                                  {formatDate(result.metadata.dateCreated)}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <span className="text-white/50 text-sm">Modified:</span>
                                <div className={getDateColor(dateAnalysis.severity)}>
                                  {formatDate(result.metadata.dateModified)}
                                  {dateAnalysis.isDiscrepancy && (
                                    <div className="text-xs mt-1 italic">
                                      Modified {dateAnalysis.timeDiff} after creation
                                      {dateAnalysis.severity === 'critical' && 
                                        ' (Highly suspicious)'}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {dateAnalysis.isDiscrepancy && (
                                <div className={`mt-2 p-3 rounded-lg border text-sm ${
                                  dateAnalysis.severity === 'suspicious' 
                                    ? 'bg-truthscan-yellow/10 border-truthscan-yellow/30 text-truthscan-yellow' 
                                    : 'bg-truthscan-red/10 border-truthscan-red/30 text-truthscan-red'
                                }`}>
                                  <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 mt-0.5" />
                                    <div>
                                      <span className="font-medium">Metadata timestamp anomaly detected</span>
                                      <p className="mt-1">
                                        The file was modified {dateAnalysis.timeDiff} after it was created.
                                        {dateAnalysis.severity === 'critical' 
                                          ? ' This significant time gap strongly suggests the file was edited after its original creation.' 
                                          : ' This time gap suggests possible manipulation.'}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                              
                              {fileLastModified && (
                                <div className="grid grid-cols-2 gap-2 mt-2 border-t border-white/10 pt-2">
                                  <span className="text-white/50 text-sm">System Last Modified:</span>
                                  <span className="text-white/90 text-sm">
                                    {new Date(fileLastModified).toLocaleString()}
                                  </span>
                                </div>
                              )}
                            </>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-xl p-6 md:p-8 mb-8">
              <h2 className="text-xl font-medium text-white mb-6">Detected Issues</h2>
              
              {result.issues.length === 0 ? (
                <div className="flex items-center gap-2 bg-truthscan-green/10 border border-truthscan-green/30 rounded-lg p-4">
                  <Check className="w-5 h-5 text-truthscan-green" />
                  <span className="text-white">No issues detected in this document</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {result.issues.map((issue, index) => (
                    <div 
                      key={index} 
                      className={`flex items-start gap-3 p-4 rounded-lg ${
                        issue.type === 'Critical' 
                          ? 'bg-truthscan-red/10 border border-truthscan-red/30' 
                          : issue.type === 'Warning'
                            ? 'bg-truthscan-yellow/10 border border-truthscan-yellow/30'
                            : 'bg-truthscan-blue/10 border border-truthscan-blue/30'
                      }`}
                    >
                      {getIssueIcon(issue.type)}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${
                            issue.type === 'Critical' 
                              ? 'text-truthscan-red' 
                              : issue.type === 'Warning'
                                ? 'text-truthscan-yellow'
                                : 'text-truthscan-blue'
                          }`}>
                            {issue.type}
                          </span>
                          {issue.location && (
                            <span className="text-white/50 text-xs">
                              Location: {issue.location}
                            </span>
                          )}
                        </div>
                        <p className="text-white">{issue.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-5 py-2.5 bg-truthscan-dark-gray text-white rounded-lg flex items-center gap-2 text-sm hover:bg-truthscan-gray transition-colors"
                onClick={() => {
                  toast({
                    title: "Report Downloaded",
                    description: "Full forensic report has been saved to your device."
                  });
                }}
              >
                <Download className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              
              <button
                className="px-5 py-2.5 bg-truthscan-blue text-white rounded-lg flex items-center gap-2 text-sm hover:bg-truthscan-blue/90 transition-colors"
                onClick={() => navigate('/scanner')}
              >
                <Shield className="w-4 h-4" />
                <span>Scan Another File</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
