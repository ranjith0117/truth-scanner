
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { Shield, Check, FileText, Zap, Image, Lock } from 'lucide-react';
import FeatureCard from '@/components/FeatureCard';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-32 pb-20">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-white mb-6">About TruthScan</h1>
            <p className="text-lg text-white/70 mb-8">
              TruthScan is an advanced AI-powered tool designed to authenticate digital content and identify manipulated images and documents with precision and accuracy.
            </p>
          </div>

          {/* Technology Section */}
          <section className="mb-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Our Technology</h2>
              <div className="glass-card rounded-xl p-8">
                <p className="text-white/70 mb-6">
                  TruthScan leverages cutting-edge artificial intelligence and machine learning algorithms to detect subtle signs of manipulation in digital media that are imperceptible to the human eye. Our technology combines multiple verification approaches:
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-truthscan-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Metadata Analysis</h3>
                      <p className="text-white/70">
                        We examine EXIF data, creation timestamps, modification history, and other hidden information to identify inconsistencies.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-truthscan-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Pixel-Level Forensics</h3>
                      <p className="text-white/70">
                        Our algorithms detect clone marks, splicing artifacts, noise inconsistencies, and compression anomalies that indicate tampering.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-truthscan-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">Lighting and Shadow Analysis</h3>
                      <p className="text-white/70">
                        We identify inconsistencies in lighting direction, shadow placement, and reflection patterns that reveal manipulation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <Check className="w-5 h-5 text-truthscan-blue" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">AI Generation Detection</h3>
                      <p className="text-white/70">
                        Our system can identify patterns and artifacts characteristic of content created by AI tools like DALL-E, Midjourney, or other generative models.
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/70">
                  By combining these techniques with our proprietary machine learning algorithms, TruthScan provides a comprehensive assessment of content authenticity with unparalleled accuracy.
                </p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to get started?</h2>
              <p className="text-white/70 mb-8">
                Experience the power of TruthScan's authentication technology today.
              </p>
              <Link
                to="/scanner"
                className="px-8 py-3 bg-truthscan-blue rounded-lg text-white font-medium hover:bg-truthscan-blue/90 transition-colors inline-flex items-center"
              >
                <Shield className="mr-2 w-5 h-5" />
                Start Scanning
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
