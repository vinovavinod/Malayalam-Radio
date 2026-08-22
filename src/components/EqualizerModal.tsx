import React from 'react';
import { X, Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { useRadio, EQUALIZER_PRESETS } from '../context/RadioContext';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BAND_LABELS = [
  { freq: '60 Hz', name: 'Sub-Bass' },
  { freq: '230 Hz', name: 'Bass Warmth' },
  { freq: '910 Hz', name: 'Mid / Vocal' },
  { freq: '4 kHz', name: 'Presence' },
  { freq: '14 kHz', name: 'Treble / Air' }
];

export const EqualizerModal: React.FC<EqualizerModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedPresetName, 
    equalizerGains, 
    setEqualizerPreset, 
    setBandGain 
  } = useRadio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Audio Equalizer</h3>
              <p className="text-xs text-[#888888] font-malayalam">
                ശബ്ദ ക്രമീകരണങ്ങൾ • 5-ബാൻഡ് ഇക്വലൈസർ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEqualizerPreset('Flat')}
              className="p-1.5 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
              title="Reset to Flat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Presets Horizontal Scroll */}
        <div className="my-4">
          <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">
            Sound Presets
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {EQUALIZER_PRESETS.map(preset => {
              const isSelected = selectedPresetName === preset.name;
              return (
                <button
                  key={preset.name}
                  onClick={() => setEqualizerPreset(preset.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap border transition flex items-center gap-1.5 flex-shrink-0 ${
                    isSelected
                      ? 'bg-[#FF3D00] text-black border-[#FF3D00] shadow-md shadow-[#FF3D00]/20'
                      : 'bg-[#141414] text-[#888888] hover:text-white border-[#2A2A2A] hover:border-[#444444] hover:bg-[#1E1E1E]'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5-Band Slider Board */}
        <div className="p-5 rounded-xl bg-[#0A0A0A] border border-[#262626] my-4">
          <div className="grid grid-cols-5 gap-3 h-52">
            {BAND_LABELS.map((band, idx) => {
              const gain = equalizerGains[idx] ?? 0;
              return (
                <div key={band.freq} className="flex flex-col items-center justify-between">
                  {/* Gain Value in dB */}
                  <span className="text-[11px] font-mono font-bold text-[#FF3D00]">
                    {gain > 0 ? `+${gain}` : gain} dB
                  </span>

                  {/* Vertical Slider track */}
                  <div className="relative flex-1 flex items-center justify-center py-2">
                    <input
                      type="range"
                      min="-12"
                      max="12"
                      step="1"
                      value={gain}
                      onChange={(e) => setBandGain(idx, Number(e.target.value))}
                      className="w-36 h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#FF3D00] -rotate-90 origin-center"
                    />
                  </div>

                  {/* Frequency Labels */}
                  <div className="text-center mt-2">
                    <span className="block text-xs font-bold text-[#CCCCCC]">{band.freq}</span>
                    <span className="block text-[10px] text-[#666666] uppercase truncate max-w-[70px]">{band.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Tip */}
        <div className="flex items-center justify-between text-xs text-[#888888] pt-2">
          <span>Active mode: <strong className="text-[#FF3D00] font-mono">{selectedPresetName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#FF3D00] hover:bg-white text-black font-bold uppercase tracking-wider text-xs transition"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
