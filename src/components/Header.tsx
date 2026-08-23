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
  Flame,
  Mail
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { OnamThemeMode } from '../types/radio';

interface HeaderProps {
  onOpenEqModal: () => void;
  onOpenSleepModal: () => void;
  onOpenVisualizerModal: () => void;
  onOpenRecordingsModal: () => void;
  onOpenOnlineSearchModal: () => void;
  onOpenContactModal: () => void;
  viewMode: 'grid' | 'tuner';
  setViewMode: (mode: 'grid' | 'tuner') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenEqModal,
  onOpenSleepModal,
  onOpenRecordingsModal,
  onOpenOnlineSearchModal,
  onOpenContactModal,
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
    { id: 'frost', name: 'Glacier & Cyan', malayalam: 'ഹിമധ്വനി', color: 'from-sky-400 to-cyan-500' },
    { id: 'azure', name: 'Coastal Azure', malayalam: 'തീരദേശം', color: 'from-blue-500 to-indigo-600' },
    { id: 'nordic', name: 'Arctic Teal', malayalam: 'ശീതക്കാറ്റ്', color: 'from-teal-500 to-emerald-600' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/90 px-3 sm:px-6 lg:px-8 py-2.5 transition-all shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Logo with Cool Light Theme */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-sky-500 via-cyan-500 to-blue-600 text-white font-black shadow-md shadow-sky-500/20 border border-sky-300">
              <span className="font-display font-black text-xl">കേ</span>
              {playbackStatus === 'playing' ? (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-300 opacity-80"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-cyan-400 border-2 border-white"></span>
                </span>
              ) : (
                <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-cyan-200 animate-pulse drop-shadow" />
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                  <span className="cool-gradient-text">കേരള</span>
                  <span className="text-sky-600">RADIO</span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-500 font-malayalam flex items-center gap-1 font-medium">
                ലൈവ് എഫ്.എം & സംഗീതം • Live Kerala FM & Broadcast Streams
              </p>
            </div>
          </div>

          {/* Mobile Quick Action Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-contact-btn"
              onClick={onOpenContactModal}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              title="Contact Us"
            >
              <Mail className="w-4 h-4" />
            </button>
            <button
              id="mobile-theme-btn"
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              title="Change Color Theme"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              id="mobile-eq-btn"
              onClick={onOpenEqModal}
              className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
              title="Equalizer"
            >
              <Sliders className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Mode Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="radio-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stations, FM frequency, city, genre, RJ..."
              className="w-full bg-slate-50 border border-slate-200 focus:border-sky-500 focus:bg-white rounded-lg pl-9 pr-9 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* View Mode Toggle (List vs Retro Tuner) */}
          <div className="hidden sm:flex items-center bg-slate-100 border border-slate-200 p-0.5 rounded-lg">
            <button
              id="view-mode-grid-btn"
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stations
            </button>
            <button
              id="view-mode-tuner-btn"
              onClick={() => setViewMode('tuner')}
              className={`px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition ${
                viewMode === 'tuner' 
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Synthesizer
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
              className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-xs"
              title="Theme Palette"
            >
              <Palette className="w-3.5 h-3.5 text-sky-600" />
              <span className="hidden lg:inline text-[11px]">Theme</span>
            </button>

            {showThemePicker && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                  Cool Light Themes
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
                        ? 'bg-sky-50 text-sky-700 font-bold border border-sky-200' 
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
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
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
              <span className="text-slate-500 uppercase text-[10px] tracking-wider font-bold">Kerala:</span>
              <span className="font-mono font-bold text-slate-900">{istTime}</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1.5 text-slate-700">
              <Globe2 className="w-3 h-3 text-sky-600" />
              <span className="text-slate-500 uppercase text-[10px] tracking-wider font-bold">Gulf:</span>
              <span className="font-mono font-bold text-slate-900">{gstTime}</span>
            </div>
          </div>

          {/* Contact Us Tab */}
          <button
            id="contact-us-btn"
            onClick={onOpenContactModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-xs"
            title="Contact Us / Stream Updates"
          >
            <Mail className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Contact</span>
          </button>

          {/* Online Directory Explorer */}
          <button
            id="online-search-btn"
            onClick={onOpenOnlineSearchModal}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200 transition shadow-xs"
            title="Explore Malayalam Radio Directory"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline uppercase text-[10px] tracking-wider">Directory</span>
          </button>

          {/* Equalizer Button */}
          <button
            id="equalizer-btn"
            onClick={onOpenEqModal}
            className="p-2 text-slate-700 hover:text-slate-900 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 transition relative shadow-xs"
            title="Audio Equalizer & Presets"
          >
            <Sliders className="w-4 h-4 text-sky-600" />
          </button>

          {/* Sleep Timer Indicator / Button */}
          <button
            id="sleep-timer-btn"
            onClick={onOpenSleepModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition shadow-xs ${
              sleepTimerRemainingSec !== null 
                ? 'bg-sky-100 text-sky-800 border-sky-300' 
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-200'
            }`}
            title="Sleep Timer"
          >
            <Clock className="w-3.5 h-3.5 text-sky-600" />
            {sleepTimerRemainingSec !== null && (
              <span className="font-mono text-xs font-bold text-sky-700">
                {formatSleepTime(sleepTimerRemainingSec)}
              </span>
            )}
          </button>

          {/* Recordings */}
          <button
            id="recordings-list-btn"
            onClick={onOpenRecordingsModal}
            className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-bold rounded-lg border transition shadow-xs ${
              isRecording 
                ? 'bg-red-50 text-red-700 border-red-300 animate-pulse' 
                : 'bg-slate-100 text-slate-700 hover:text-slate-900 border-slate-200 hover:bg-slate-200'
            }`}
            title="Radio Clips & Recordings"
          >
            <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-red-500' : 'text-sky-600'}`} />
            {isRecording ? (
              <span className="font-mono text-xs text-red-600 font-bold">{recordingDurationSec}s</span>
            ) : recordings.length > 0 ? (
              <span className="px-1.5 py-0.2 rounded bg-sky-100 text-[10px] font-bold text-sky-700">
                {recordings.length}
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
