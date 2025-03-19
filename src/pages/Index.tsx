
import { Link } from 'react-router-dom';
import { Shield, Image, FileText, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/FeatureCard';
import ScanProcess from '@/components/ScanProcess';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 relative grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-truthscan-blue/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
              <Shield className="w-4 h-4 text-truthscan-blue mr-2" />
              <span className="text-sm text-white/90">Powered by advanced AI detection</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Detect Image & Document <span className="text-truthscan-blue">Forgeries</span> with Precision
            </h1>
            
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              TruthScan uses cutting-edge artificial intelligence to identify manipulated media, altered documents, and AI-generated content with unprecedented accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/scanner"
                className="px-8 py-3 bg-truthscan-blue rounded-lg text-white font-medium text-sm hover:bg-truthscan-blue/90 transition-colors"
              >
                Start Scanning
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 bg-truthscan-dark-gray rounded-lg text-white font-medium text-sm hover:bg-truthscan-gray/90 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-truthscan-dark-gray relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Advanced Detection Capabilities</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our comprehensive suite of verification tools ensures the authenticity of your digital media and documents.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Image}
              title="Image Forensics"
              description="Detect manipulations in photos through advanced pixel analysis"
              additionalText="Our AI examines metadata, analyzes noise patterns, and detects inconsistencies in lighting, shadows, and compression artifacts that reveal tampering."
            />
            
            <FeatureCard
              icon={FileText}
              title="Document Verification"
              description="Authenticate PDFs and detect fraudulent alterations"
              additionalText="Analyze text inconsistencies, signature forgeries, and PDF metadata to identify unauthorized modifications to critical documents."
            />
            
            <FeatureCard
              icon={Shield}
              title="Deepfake Detection"
              description="Identify AI-generated content and manipulations"
              additionalText="Advanced algorithms detect artificial intelligence artifacts present in deepfakes, synthetic media, and other AI-generated forgeries."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-truthscan-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How TruthScan Works</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Our streamlined verification process makes it easy to authenticate any document or image in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ScanProcess
              step="01"
              title="Upload"
              description="Securely upload images or PDF documents for analysis"
            />
            
            <ScanProcess
              step="02"
              title="Analyze"
              description="Our AI performs comprehensive forensic analysis"
            />
            
            <ScanProcess
              step="03"
              title="Detect"
              description="Identify manipulation markers and authenticity scores"
            />
            
            <ScanProcess
              step="04"
              title="Report"
              description="Generate detailed forensic reports with evidence"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-truthscan-dark-gray">
        <div className="container mx-auto px-4">
          <div className="glass-card rounded-3xl p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to authenticate with confidence?</h2>
            <p className="text-white/70 mb-8 max-w-2xl mx-auto">
              Start detecting document and image forgeries with precision and accuracy today.
            </p>
            <Link
              to="/scanner"
              className="px-8 py-3 bg-truthscan-blue rounded-lg text-white font-medium hover:bg-truthscan-blue/90 transition-colors"
            >
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
