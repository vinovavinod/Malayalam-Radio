import React, { useState } from 'react';
import { X, Clock, Moon, Check, AlertCircle } from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({ isOpen, onClose }) => {
  const { sleepTimerMinutes, sleepTimerRemainingSec, setSleepTimer } = useRadio();
  const [customMinutes, setCustomMinutes] = useState<number>(30);

  if (!isOpen) return null;

  const presets = [15, 30, 45, 60, 90, 120];

  const formatRemaining = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-[#0F0F0F] border border-[#262626] rounded-2xl shadow-2xl overflow-hidden p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider">Sleep Timer</h3>
              <p className="text-xs text-[#888888] font-malayalam">
                ഉറങ്ങുമ്പോൾ തനിയെ റേഡിയോ ഓഫ് ചെയ്യാം
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white rounded-lg hover:bg-[#1A1A1A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Status */}
        {sleepTimerRemainingSec !== null && (
          <div className="my-4 p-4 rounded-xl bg-[#FF3D00]/10 border border-[#FF3D00]/30 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-[#FF3D00] animate-pulse" />
              <div>
                <p className="text-[10px] font-bold text-[#888888] uppercase tracking-wider">Timer Active</p>
                <p className="text-sm font-mono font-bold text-[#FF3D00]">
                  Stopping in {formatRemaining(sleepTimerRemainingSec)}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSleepTimer(null);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider bg-red-500/20 text-red-300 hover:bg-red-500/30 transition border border-red-500/30"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Presets Grid */}
        <div className="my-5">
          <label className="block text-[10px] font-bold text-[#888888] uppercase tracking-wider mb-2">
            Select Duration
          </label>
          <div className="grid grid-cols-3 gap-2.5">
            {presets.map(mins => {
              const isSelected = sleepTimerMinutes === mins;
              return (
                <button
                  key={mins}
                  onClick={() => {
                    setSleepTimer(mins);
                    onClose();
                  }}
                  className={`py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider border transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#FF3D00] text-black border-[#FF3D00] shadow-md shadow-[#FF3D00]/20'
                      : 'bg-[#0A0A0A] text-[#888888] hover:text-white border-[#262626] hover:border-[#444444] hover:bg-[#181818]'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>{mins} mins</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Slider */}
        <div className="p-4 rounded-xl bg-[#0A0A0A] border border-[#262626] mb-5">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#888888] mb-2">
            <span>Custom Duration</span>
            <span className="font-mono text-[#FF3D00]">{customMinutes} Minutes</span>
          </div>
          <input
            type="range"
            min="5"
            max="180"
            step="5"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(Number(e.target.value))}
            className="w-full h-1.5 bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#FF3D00]"
          />
          <button
            onClick={() => {
              setSleepTimer(customMinutes);
              onClose();
            }}
            className="w-full mt-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#FF3D00] hover:bg-white text-black transition active:scale-95"
          >
            Set Custom Timer ({customMinutes} min)
          </button>
        </div>

        <p className="text-[11px] text-[#666666] text-center flex items-center justify-center gap-1">
          <AlertCircle className="w-3 h-3 text-[#FF3D00]" />
          <span>Volume will softly fade out 20 seconds before stream stops.</span>
        </p>
      </div>
    </div>
  );
};
