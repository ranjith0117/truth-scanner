
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UploadArea from '@/components/UploadArea';
import ScanProcess from '@/components/ScanProcess';

const Scanner = () => {
  return (
    <div className="min-h-screen flex flex-col grid-bg">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-white mb-3">Document & Image Scanner</h1>
              <p className="text-white/70 max-w-xl mx-auto">
                Upload any image or document to analyze it for manipulations, alterations, or signs of forgery.
              </p>
            </div>

            <UploadArea />

            <div className="mt-24 mb-12">
              <h3 className="text-white text-xl font-medium text-center mb-8">Our Scanning Process</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ScanProcess 
                  step="01"
                  title="Metadata Analysis" 
                  description="We extract and analyze file metadata including creation date, modification date, and software used."
                />
                <ScanProcess 
                  step="02"
                  title="Content Verification" 
                  description="We analyze the file content for signs of manipulation including compression artifacts and inconsistencies."
                />
                <ScanProcess 
                  step="03"
                  title="Forensic Report" 
                  description="We generate a detailed report with authenticity score and identified issues."
                />
              </div>
            </div>

            <div className="mt-12 bg-black/20 border border-white/10 rounded-xl p-6">
              <h3 className="text-white font-medium mb-3">Accepted File Formats</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-truthscan-blue text-sm font-medium mb-2">Images</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>JPEG (.jpg, .jpeg)</li>
                    <li>PNG (.png)</li>
                    <li>TIFF (.tiff, .tif)</li>
                    <li>BMP (.bmp)</li>
                    <li>WebP (.webp)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-truthscan-blue text-sm font-medium mb-2">Documents</h4>
                  <ul className="text-white/70 text-sm space-y-1">
                    <li>PDF (.pdf)</li>
                    <li>Scanned documents</li>
                    <li>Digital certificates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Scanner;
