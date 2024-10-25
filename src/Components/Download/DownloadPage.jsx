import React, { useState } from 'react';
import { 
  AiOutlineDownload, 
  AiOutlineEye, 
  AiOutlineFile, 
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineSafetyCertificate,
  AiOutlineInfoCircle
} from 'react-icons/ai';
import Navbar from '../Landing/Navbar';
import Footer from '../Landing/Footer';

const DownloadPage = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const catalog = {
    name: "Factory RB Hardware Catalog 2024.pdf",
    size: 15000000,
    url: "https://drive.google.com/file/d/1zUEi0DgAXv35_zhdHXocQ4sN4Gu-XfHz/view?usp=drive_link",
    lastUpdated: "April 2024",
    format: "PDF",
    pages: 156,
    version: "v2.4.0"
  };

  const handleDownload = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = catalog.url;
    link.download = catalog.name;
    link.click();
    setTimeout(() => setIsDownloading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      <Navbar/>
      {/* Hero Section with Diagonal Design */}
      <div className="relative bg-orange-600 pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute transform -rotate-6 -translate-y-1/2 bg-orange-500 w-full h-full opacity-50"></div>
          <div className="absolute transform rotate-6 translate-y-1/2 bg-orange-700 w-full h-full opacity-50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 py-12 text-white">
          <h1 className="text-4xl font-bold mb-3 text-center">
            Hardware Catalog
          </h1>
          <p className="text-lg text-orange-100 text-center max-w-2xl mx-auto">
            Download our comprehensive catalog featuring our complete range of industrial hardware solutions
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-20">
        <div className="max-w-2xl mx-auto">
          {/* Main Download Card */}
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8 border border-orange-500/20">
            {/* Preview Section */}
            <div className="relative h-48 bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center border-b border-orange-500/20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <AiOutlineFile className="w-16 h-16 text-orange-500 mx-auto mb-3" />
                  <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-xs">
                    {catalog.version}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => window.open(catalog.url, '_blank')}
                className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-1.5 bg-gray-700 text-orange-500 rounded-lg hover:bg-gray-600 transition-colors duration-300 text-sm"
              >
                <AiOutlineEye className="w-4 h-4" />
                <span>Preview</span>
              </button>
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">
                    2024 Product Catalog
                  </h2>
                  <p className="text-gray-400 flex items-center gap-2 text-sm">
                    <AiOutlineInfoCircle className="w-4 h-4" />
                    Updated {catalog.lastUpdated}
                  </p>
                </div>
                <div className="mt-3 md:mt-0">
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-500 rounded-lg text-sm">
                    <AiOutlineSafetyCertificate className="w-4 h-4" />
                    Latest Release
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              {/* <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">File Size</div>
                  <div className="text-sm font-semibold text-white">
                    {(catalog.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Format</div>
                  <div className="text-sm font-semibold text-white">{catalog.format}</div>
                </div>
                <div className="p-3 bg-gray-900/50 rounded-lg">
                  <div className="text-xs text-gray-400 mb-1">Pages</div>
                  <div className="text-sm font-semibold text-white">{catalog.pages}</div>
                </div>
              </div> */}

              {/* Download Section */}
              <div className="flex flex-col items-center">
                <button 
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`w-full md:w-auto px-6 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${
                    isDownloading 
                      ? 'bg-green-500 cursor-not-allowed' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  <AiOutlineDownload className={`w-5 h-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>{isDownloading ? 'Downloading...' : 'Download Now'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-orange-500/20">
              <div className="flex items-center gap-3 text-orange-500 mb-3">
                <AiOutlineCalendar className="w-5 h-5" />
                <h3 className="font-semibold text-white">Regular Updates</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Our catalog is updated monthly with new products, specifications, and pricing information.
              </p>
            </div>
            <div className="bg-gray-800 p-5 rounded-xl shadow-lg border border-orange-500/20">
              <div className="flex items-center gap-3 text-orange-500 mb-3">
                <AiOutlineClockCircle className="w-5 h-5" />
                <h3 className="font-semibold text-white">24/7 Support</h3>
              </div>
              <p className="text-gray-400 text-sm">
                Need assistance? Our support team is available around the clock at{' '}
                <span className="text-orange-500 hover:underline cursor-pointer">
                  support@factoryrb.com
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default DownloadPage;