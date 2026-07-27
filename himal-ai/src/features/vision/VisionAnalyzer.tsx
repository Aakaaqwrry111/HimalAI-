import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, Map, Loader2 } from 'lucide-react';
import { analyzeTrekImage } from '../../lib/gemini';

export default function VisionAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);
    // Create a local URL for the preview image
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null); // Clear previous results
  };

  const runAnalysis = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeTrekImage(selectedImage);
      setAnalysisResult(result);
    } catch (error) {
      setAnalysisResult("Failed to analyze the image. Please try another one.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 text-white mt-24">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-4xl font-display font-bold text-glow mb-4 flex items-center justify-center gap-3">
          <Sparkles className="text-accent-temple-gold" />
          Lens of the Himalayas
          <Sparkles className="text-accent-temple-gold" />
        </h2>
        <p className="text-white/60">
          Upload a photo of a peak, monastery, or trail. Our AI Sherpa will instantly identify it, provide cultural context, and assess the route.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upload & Preview Column */}
        <div className="glass-panel bg-black/40 border border-white/10 p-6 rounded-3xl backdrop-blur-xl flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
          
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageSelect}
          />

          {!previewUrl ? (
            <div 
              className="flex flex-col items-center cursor-pointer hover:bg-white/5 p-12 rounded-2xl transition-colors border-2 border-dashed border-white/20 w-full"
              onClick={() => fileInputRef.current?.click()}
            >
              <UploadCloud size={48} className="text-white/40 mb-4" />
              <h3 className="text-xl font-bold mb-2">Drop your image here</h3>
              <p className="text-white/50 text-sm">Supports JPG, PNG, WEBP</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center">
              <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6 border border-white/20 shadow-2xl">
                <img 
                  src={previewUrl} 
                  alt="Trek preview" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={() => { setSelectedImage(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 bg-black/60 p-2 rounded-full backdrop-blur-md hover:bg-red-500/80 transition-colors"
                >
                  <span className="sr-only">Clear image</span>
                  ✕
                </button>
              </div>
              
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-accent-temple-gold to-orange-600 font-bold text-lg shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Analyzing Geography & Culture...
                  </>
                ) : (
                  <>
                    <Map />
                    Analyze with AI Sherpa
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="glass-panel bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl min-h-[400px]">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
            <ImageIcon className="text-gray-400" />
            <h3 className="text-2xl font-bold font-display">Intelligence Report</h3>
          </div>

          <div className="prose prose-invert max-w-none">
            {!analysisResult && !isAnalyzing && (
              <div className="h-full flex flex-col items-center justify-center text-white/30 pt-12">
                <Sparkles size={48} className="mb-4 opacity-50" />
                <p>Awaiting visual data input...</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="space-y-4 pt-4">
                <div className="h-4 bg-white/10 rounded-full w-3/4 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded-full w-5/6 animate-pulse"></div>
                <div className="h-4 bg-white/10 rounded-full w-1/2 animate-pulse mt-8"></div>
                <div className="h-4 bg-white/10 rounded-full w-full animate-pulse"></div>
              </div>
            )}

            {analysisResult && (
              <div className="text-white/80 leading-relaxed whitespace-pre-wrap">
                {analysisResult}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}