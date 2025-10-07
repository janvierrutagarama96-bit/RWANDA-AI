
import React from 'react';
import type { AppMode } from '../types';
import { DownloadIcon, ImageIcon } from './icons';

interface ImageDisplayProps {
  sourceImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  mode: AppMode;
}

const Placeholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg border-2 border-dashed border-gray-600">
        <ImageIcon className="w-16 h-16 text-gray-500 mb-4"/>
        <p className="text-gray-400">{message}</p>
    </div>
);

const LoadingSpinner: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center text-center p-8 bg-gray-800/50 rounded-lg">
      <svg className="animate-spin h-12 w-12 text-indigo-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-semibold text-gray-300">AI is thinking...</p>
      <p className="text-sm text-gray-400 mt-1">This can take a moment.</p>
    </div>
);

export const ImageDisplay: React.FC<ImageDisplayProps> = ({
  sourceImage,
  generatedImage,
  isLoading,
  error,
  mode,
}) => {

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `ai-generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="sticky top-24">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full bg-gray-800 rounded-xl shadow-2xl border border-gray-700 overflow-hidden flex items-center justify-center">
          {isLoading && <LoadingSpinner />}
          {!isLoading && !generatedImage && mode === 'edit' && !sourceImage && (
            <Placeholder message="Upload an image to start editing." />
          )}
          {!isLoading && !generatedImage && mode === 'edit' && sourceImage && (
             <img src={sourceImage} alt="Source" className="object-contain w-full h-full" />
          )}
          {!isLoading && !generatedImage && mode === 'generate' && (
            <Placeholder message="Your generated image will appear here." />
          )}
          {!isLoading && generatedImage && (
            <img src={generatedImage} alt="Generated" className="object-contain w-full h-full" />
          )}
        </div>
        
        {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {generatedImage && !isLoading && (
            <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-3 px-6 py-3 font-bold text-white bg-green-600 rounded-lg shadow-lg hover:bg-green-700 disabled:bg-green-400 transition-all transform hover:scale-105"
            >
                <DownloadIcon className="w-6 h-6" />
                Download Image
            </button>
        )}
      </div>
    </div>
  );
};
