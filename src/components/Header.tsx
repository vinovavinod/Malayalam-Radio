import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Plus, 
  Sliders, 
  Clock, 
  Mic, 
  Sparkles,
  Globe2,
  X,
  Palette,
  Flame
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { OnamThemeMode } from '../types/radio';

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
    onamTheme,
    setOnamTheme
  } = useRadio();

  const [showThemePicker, setShowThemePicker] = useState(false);

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

  const themes: { id: OnamThemeMode; name: string; malayalam: string; color: string }[] = [
    { id: 'ponnonam', name: 'Ponnonam Gold', malayalam: 'പൊന്നോണം', color: 'from-amber-400 to-yellow-600' },
    { id: 'kasavu', name: 'Kasavu & Sandal', malayalam: 'കസവ് സുവർണ്ണം', color: 'from-amber-200 to-yellow-500' },
    { id: 'temple', name: 'Temple Festive', malayalam: 'ഉത്സവമേളം', color: 'from-amber-600 to-rose-700' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#120F0B]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-3 sm:px-6 lg:px-8 py-2.5 transition-all shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo with Onam Festive Touch */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-yellow-600 text-[#120F0B] font-black shadow-lg shadow-amber-500/25 border border-amber-300">
              <span className="font-display font-black text-xl">കേ</span>
              {playbackStatus === 'playing' ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-400 border-2 border-[#120F0B]"></span>
                </span>
              ) : (
                <Flame className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-300 animate-flame drop-shadow" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#FAF7F0] flex items-center gap-1.5">
                  <span className="gold-gradient-text">കേരള</span>
                  <span className="text-[#FFD700]">RADIO</span>
                </h1>
                <span className="text-[10px] px-2 py-0.5 uppercase tracking-wider font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40 rounded-full flex items-center gap-1">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  ഓണം സ്പെഷ്യൽ
                </span>
              </div>
              <p className="text-[11px] text-amber-200/70 font-malayalam flex items-center gap-1 font-medium">
                ലൈവ് എഫ്.എം & ഓണപ്പാട്ടുകൾ • Live Kerala Streams
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-theme-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2 rounded-lg bg-[#221C14] border border-amber-500/30 text-amber-300 hover:text-amber-200"
              title="Change Onam Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              id="mobile-add-station-btn"
              onClick={onOpenAddModal}
              className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold hover:brightness-110 transition shadow"
              title="Add Custom Station Link"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Mode Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400/60" />
            <input
              id="radio-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station, FM frequency, Onam songs, RJ..."
              className="w-full bg-[#1C1610] border border-amber-500/30 focus:border-amber-400 rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-[#FAF7F0] placeholder:text-amber-100/40 focus:outline-none transition shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-300/70 hover:text-amber-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle (Grid vs Retro Tuner) */}
          <div className="hidden sm:flex items-center bg-[#1C1610] border border-amber-500/30 p-0.5 rounded-lg">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow' 
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              Stations
            </button>
            <button
              id="view-mode-tuner-btn"
              onClick={() => setViewMode('tuner')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition ${
                viewMode === 'tuner' 
                  ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow' 
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              Vintage Dial
            </button>
          </div>
        </div>

        {/* Clocks & Controls */}
        <div className="flex items-center gap-2 sm:gap-2 w-full md:w-auto justify-end relative">
          {/* Theme Switcher Dropdown */}
          <div className="relative">
            <button
              id="theme-switcher-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg bg-[#1C1610] hover:bg-[#282017] text-amber-300 border border-amber-500/30 hover:border-amber-400/60 transition shadow-sm"
              title="Onam Theme Palette"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden lg:inline text-[11px]">Theme</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1A140E] border border-amber-500/40 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300/80 border-b border-amber-500/20 mb-1">
                  Onam Color Themes
                </div>
                {themes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setOnamTheme(t.id);
                      setShowThemePicker(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                      onamTheme === t.id 
                        ? 'bg-amber-500/25 text-amber-200 font-bold border border-amber-500/40' 
                        : 'text-neutral-300 hover:bg-[#251D14] hover:text-amber-200'
                    }`}
                  >
                    <span>{t.name}</span>
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${t.color}`}></span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* World Times */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#1C1610] border border-amber-500/30 text-xs">
            <div className="flex items-center gap-1.5 text-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              <span className="text-amber-400/80 uppercase text-[10px] tracking-wider font-bold">Kerala:</span>
              <span className="font-mono font-bold text-[#FFF5EA]">{istTime}</span>
            </div>
            <span className="text-amber-500/30">|</span>
            <div className="flex items-center gap-1.5 text-amber-200">
              <Globe2 className="w-3 h-3 text-amber-400" />
              <span className="text-amber-400/80 uppercase text-[10px] tracking-wider font-bold">Gulf:</span>
              <span className="font-mono font-bold text-[#FFF5EA]">{gstTime}</span>
            </div>
          </div>

          {/* Online Directory Explorer */}
          <button
            id="online-search-btn"
            onClick={onOpenOnlineSearchModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-[#1C1610] hover:bg-[#282017] text-amber-200 hover:text-amber-100 border border-amber-500/30 hover:border-amber-400/60 transition shadow-sm"
            title="Explore Online Malayalam Radio Directory"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Directory</span>
          </button>

          {/* Equalizer Button */}
          <button
            id="equalizer-btn"
            onClick={onOpenEqModal}
            className="p-2 text-amber-200 hover:text-amber-100 rounded-lg bg-[#1C1610] hover:bg-[#282017] border border-amber-500/30 hover:border-amber-400/60 transition relative shadow-sm"
            title="Audio Equalizer & Presets"
          >
            <Sliders className="w-4 h-4 text-amber-400" />
          </button>

          {/* Sleep Timer Indicator / Button */}
          <button
            id="sleep-timer-btn"
            onClick={onOpenSleepModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition shadow-sm ${
              sleepTimerRemainingSec !== null 
                ? 'bg-amber-500/20 text-amber-300 border-amber-400' 
                : 'bg-[#1C1610] text-amber-200 hover:text-amber-100 border-amber-500/30 hover:bg-[#282017]'
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            {sleepTimerRemainingSec !== null && (
              <span className="font-mono text-xs font-bold text-amber-300">
                {formatSleepTime(sleepTimerRemainingSec)}
              </span>
            )}
          </button>

          {/* Recordings */}
          <button
            id="recordings-list-btn"
            onClick={onOpenRecordingsModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition shadow-sm ${
              isRecording 
                ? 'bg-red-500/25 text-red-300 border-red-500 animate-pulse' 
                : 'bg-[#1C1610] text-amber-200 hover:text-amber-100 border-amber-500/30 hover:bg-[#282017]'
            }`}
            title="Radio Clips & Recordings"
          >
            <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-red-400' : 'text-amber-400'}`} />
            {isRecording ? (
              <span className="font-mono text-xs text-red-300 font-bold">{recordingDurationSec}s</span>
            ) : recordings.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/30 text-[10px] font-bold text-amber-200">
                {recordings.length}
              </span>
            ) : null}
          </button>

          {/* Add Custom Station Link Button */}
          <button
            id="header-add-station-btn"
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-black hover:brightness-110 transition active:scale-95 shadow-md shadow-amber-500/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">Add Stream</span>
            <span className="sm:hidden font-malayalam">ചേർക്കുക</span>
          </button>
        </div>
      </div>
    </header>
  );
};
