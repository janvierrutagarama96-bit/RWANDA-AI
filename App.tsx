
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ControlPanel } from './components/ControlPanel';
import { ImageDisplay } from './components/ImageDisplay';
import { editImageWithPrompt, generateImageFromPrompt } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import type { AppMode, AspectRatio } from './types';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>('generate');
  const [prompt, setPrompt] = useState<string>('');
  const [sourceImage, setSourceImage] = useState<{ file: File; base64: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageBase64 = await generateImageFromPrompt(prompt, aspectRatio);
      setGeneratedImage(`data:image/jpeg;base64,${imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  const handleEdit = useCallback(async () => {
    if (!prompt || !sourceImage) {
      setError('Please upload an image and enter a prompt.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const mimeType = sourceImage.file.type;
      const imageBase64 = await editImageWithPrompt(prompt, sourceImage.base64, mimeType);
      setGeneratedImage(`data:${mimeType};base64,${imageBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, sourceImage]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setSourceImage({ file, base64: base64.split(',')[1] });
      } catch (err) {
        setError('Failed to read the image file.');
        console.error(err);
      }
    }
  };
  
  const handleModeChange = (newMode: AppMode) => {
    setMode(newMode);
    // Reset state when switching modes
    setPrompt('');
    setSourceImage(null);
    setGeneratedImage(null);
    setError(null);
    setIsLoading(false);
  };


  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <ControlPanel
          mode={mode}
          onModeChange={handleModeChange}
          prompt={prompt}
          setPrompt={setPrompt}
          aspectRatio={aspectRatio}
          setAspectRatio={setAspectRatio}
          onFileChange={handleFileChange}
          onSubmit={mode === 'generate' ? handleGenerate : handleEdit}
          isLoading={isLoading}
          sourceImageName={sourceImage?.file.name}
        />
        <ImageDisplay
          sourceImage={sourceImage?.base64 ? `data:${sourceImage.file.type};base64,${sourceImage.base64}` : null}
          generatedImage={generatedImage}
          isLoading={isLoading}
          error={error}
          mode={mode}
        />
      </main>
    </div>
  );
};

export default App;
