import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Plus, 
  Sliders, 
  Clock, 
  Mic, 
  Download, 
  Sparkles,
  Globe2,
  X,
  Volume2
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenEqModal: () => void;
  onOpenSleepModal: () => void;
  onOpenVisualizerModal: () => void;
  onOpenRecordingsModal: () => void;
  onOpenOnlineSearchModal: () => void;
  viewMode: 'grid' | 'tuner';
  setViewMode: (mode: 'grid' | 'tuner') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenEqModal,
  onOpenSleepModal,
  onOpenVisualizerModal,
  onOpenRecordingsModal,
  onOpenOnlineSearchModal,
  viewMode,
  setViewMode
}) => {
  const { 
    searchQuery, 
    setSearchQuery, 
    sleepTimerRemainingSec, 
    isRecording, 
    recordingDurationSec,
    recordings,
    playbackStatus,
    currentStation
  } = useRadio();

  // Dual World Clock: Kerala (IST) & Gulf (GST)
  const [istTime, setIstTime] = useState('');
  const [gstTime, setGstTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit' }));
      setGstTime(now.toLocaleTimeString('en-AE', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' }));
    };
    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatSleepTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#262626] px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FF3D00] text-black font-black shadow-lg shadow-[#FF3D00]/20">
              <span className="font-display font-black text-lg">കേ</span>
              {playbackStatus === 'playing' && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white border-2 border-[#0A0A0A]"></span>
                </span>
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tighter text-[#F0F0F0]">
                  കേരള <span className="text-[#FF3D00]">RADIO</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 uppercase tracking-[0.2em] font-bold bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30 rounded">
                  LIVE
                </span>
              </div>
              <p className="text-[11px] text-[#888888] font-malayalam flex items-center gap-1 font-medium">
                മലയാളം ലൈവ് എഫ്.എം & റേഡിയോ ലിങ്കുകൾ
              </p>
            </div>
          </div>

          {/* Mobile Clocks & Quick Action */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-add-station-btn"
              onClick={onOpenAddModal}
              className="p-2 rounded bg-[#FF3D00] text-black font-bold hover:bg-white transition"
              title="Add Custom Station Link"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Mode Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              id="radio-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, FM frequency, artist..."
              className="w-full bg-[#111111] border border-[#333333] focus:border-[#FF3D00] rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-[#F0F0F0] placeholder:text-[#555555] focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid vs Retro Tuner) */}
          <div className="hidden sm:flex items-center bg-[#111111] border border-[#333333] p-0.5 rounded-lg">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded transition ${
                viewMode === 'grid' 
                  ? 'bg-[#FF3D00] text-black' 
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Stations
            </button>
            <button
              id="view-mode-tuner-btn"
              onClick={() => setViewMode('tuner')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded transition ${
                viewMode === 'tuner' 
                  ? 'bg-[#FF3D00] text-black' 
                  : 'text-[#888888] hover:text-white'
              }`}
            >
              Tuner Dial
            </button>
          </div>
        </div>

        {/* Clocks & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto justify-end">
          {/* World Times */}
          <div className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#111111] border border-[#333333] text-xs">
            <div className="flex items-center gap-1.5 text-[#CCCCCC]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse"></span>
              <span className="text-[#777777] uppercase text-[10px] tracking-wider font-bold">Kerala:</span>
              <span className="font-mono font-bold text-[#F0F0F0]">{istTime}</span>
            </div>
            <span className="text-[#333333]">|</span>
            <div className="flex items-center gap-1.5 text-[#CCCCCC]">
              <Globe2 className="w-3 h-3 text-[#FF3D00]" />
              <span className="text-[#777777] uppercase text-[10px] tracking-wider font-bold">Gulf:</span>
              <span className="font-mono font-bold text-[#F0F0F0]">{gstTime}</span>
            </div>
          </div>

          {/* Online Directory Explorer */}
          <button
            id="online-search-btn"
            onClick={onOpenOnlineSearchModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-[#111111] hover:bg-[#1A1A1A] text-[#CCCCCC] hover:text-[#FF3D00] border border-[#333333] hover:border-[#FF3D00]/50 transition"
            title="Explore Online Malayalam Radio Directory"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Explore</span>
          </button>

          {/* Equalizer Button */}
          <button
            id="equalizer-btn"
            onClick={onOpenEqModal}
            className="p-2 text-[#CCCCCC] hover:text-[#FF3D00] rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[#333333] hover:border-[#FF3D00]/50 transition relative"
            title="Audio Equalizer & Presets"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Sleep Timer Indicator / Button */}
          <button
            id="sleep-timer-btn"
            onClick={onOpenSleepModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition ${
              sleepTimerRemainingSec !== null 
                ? 'bg-[#FF3D00]/15 text-[#FF3D00] border-[#FF3D00]/60' 
                : 'bg-[#111111] text-[#CCCCCC] hover:text-white border-[#333333] hover:bg-[#1A1A1A]'
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-3.5 h-3.5 text-[#FF3D00]" />
            {sleepTimerRemainingSec !== null && (
              <span className="font-mono text-xs font-bold text-[#FF3D00]">
                {formatSleepTime(sleepTimerRemainingSec)}
              </span>
            )}
          </button>

          {/* Recordings */}
          <button
            id="recordings-list-btn"
            onClick={onOpenRecordingsModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition ${
              isRecording 
                ? 'bg-[#FF3D00]/20 text-[#FF3D00] border-[#FF3D00] animate-pulse' 
                : 'bg-[#111111] text-[#CCCCCC] hover:text-white border-[#333333] hover:bg-[#1A1A1A]'
            }`}
            title="Radio Clips & Recordings"
          >
            <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-[#FF3D00]' : 'text-[#888888]'}`} />
            {isRecording ? (
              <span className="font-mono text-xs text-[#FF3D00] font-bold">{recordingDurationSec}s</span>
            ) : recordings.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded bg-[#222222] text-[10px] font-bold text-[#FF3D00]">
                {recordings.length}
              </span>
            ) : null}
          </button>

          {/* Add Custom Station Link Button */}
          <button
            id="header-add-station-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-white text-black hover:bg-[#FF3D00] hover:text-white transition active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Link</span>
            <span className="sm:hidden font-malayalam">ചേർക്കുക</span>
          </button>
        </div>
      </div>
    </header>
  );
};
