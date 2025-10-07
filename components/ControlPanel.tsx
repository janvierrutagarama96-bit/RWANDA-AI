
import React from 'react';
import type { AppMode, AspectRatio } from '../types';
import { EditIcon, GenerateIcon, UploadIcon } from './icons';

interface ControlPanelProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
  isLoading: boolean;
  sourceImageName?: string;
}

const ModeButton: React.FC<{
  label: string;
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}> = ({ label, isActive, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-center gap-2 px-4 py-3 font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`}
  >
    {icon}
    {label}
  </button>
);


export const ControlPanel: React.FC<ControlPanelProps> = ({
  mode,
  onModeChange,
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onFileChange,
  onSubmit,
  isLoading,
  sourceImageName,
}) => {
  const aspectRatios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-6 border border-gray-700">
      <div className="grid grid-cols-2 gap-4">
        <ModeButton 
            label="Generate" 
            isActive={mode === 'generate'} 
            onClick={() => onModeChange('generate')} 
            icon={<GenerateIcon className="w-5 h-5"/>} 
        />
        <ModeButton 
            label="Edit" 
            isActive={mode === 'edit'} 
            onClick={() => onModeChange('edit')} 
            icon={<EditIcon className="w-5 h-5"/>}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
          {mode === 'generate' ? 'Describe the image you want to create:' : 'Describe the edits you want to make:'}
        </label>
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={mode === 'generate' ? 'e.g., A futuristic city with flying cars at sunset' : 'e.g., Add a birthday hat on the person'}
          className="w-full h-32 p-3 bg-gray-900 border border-gray-600 rounded-md resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
        />
      </div>

      {mode === 'edit' && (
         <div className="space-y-2">
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300">
              Upload Image
            </label>
            <label htmlFor="file-upload" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-gray-300 rounded-md cursor-pointer hover:bg-gray-600 transition">
              <UploadIcon className="w-5 h-5" />
              <span>{sourceImageName || 'Choose a file'}</span>
            </label>
            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={onFileChange} accept="image/png, image/jpeg, image/webp" />
        </div>
      )}

      {mode === 'generate' && (
        <div className="space-y-2">
          <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300">
            Aspect Ratio
          </label>
          <select
            id="aspect-ratio"
            value={aspectRatio}
            onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
            className="w-full p-3 bg-gray-900 border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          >
            {aspectRatios.map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
          </select>
        </div>
      )}

      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 font-bold text-white bg-indigo-600 rounded-lg shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <GenerateIcon className="w-6 h-6"/>
            {mode === 'generate' ? 'Generate Image' : 'Apply Edits'}
          </>
        )}
      </button>
    </div>
  );
};
