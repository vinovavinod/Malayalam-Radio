import React, { useState, useRef, useEffect } from 'react';
import { Radio, Volume2, Sparkles, ChevronRight, ChevronLeft, Disc3 } from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { RadioStation } from '../types/radio';

export const RetroRadioTuner: React.FC = () => {
  const { allStations, currentStation, playStation, playbackStatus } = useRadio();

  const [selectedBand, setSelectedBand] = useState<'FM' | 'AM'>('FM');
  const [currentFreq, setCurrentFreq] = useState<number>(94.3); // default FM frequency in MHz
  const dialRef = useRef<HTMLDivElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Parse frequency number from station if present
  const parseStationFreq = (station: RadioStation): number | null => {
    if (!station.frequency) return null;
    const match = station.frequency.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

  // Filter stations for the current band
  const fmStations = allStations.filter(s => {
    const f = parseStationFreq(s);
    return f && f >= 87.0 && f <= 108.0;
  });

  const minFreq = selectedBand === 'FM' ? 88.0 : 530;
  const maxFreq = selectedBand === 'FM' ? 108.0 : 1600;

  // When current station changes, update dial position
  useEffect(() => {
    if (currentStation) {
      const f = parseStationFreq(currentStation);
      if (f) {
        if (f >= 87 && f <= 108) {
          setSelectedBand('FM');
          setCurrentFreq(f);
        } else if (f >= 500 && f <= 1700) {
          setSelectedBand('AM');
          setCurrentFreq(f);
        }
      }
    }
  }, [currentStation]);

  // Calculate needle percentage
  const needlePercent = Math.max(0, Math.min(100, ((currentFreq - minFreq) / (maxFreq - minFreq)) * 100));

  const handleDialClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newFreq = selectedBand === 'FM' 
      ? Number((minFreq + pct * (maxFreq - minFreq)).toFixed(1))
      : Math.round(minFreq + pct * (maxFreq - minFreq));
    setCurrentFreq(newFreq);

    // Find nearest station
    const nearest = allStations.find(s => {
      const sf = parseStationFreq(s);
      return sf && Math.abs(sf - newFreq) <= (selectedBand === 'FM' ? 0.6 : 30);
    });
    if (nearest) {
      playStation(nearest);
    }
  };

  const handleTunePrev = () => {
    const step = selectedBand === 'FM' ? 0.2 : 10;
    const nextFreq = Math.max(minFreq, Number((currentFreq - step).toFixed(1)));
    setCurrentFreq(nextFreq);
  };

  const handleTuneNext = () => {
    const step = selectedBand === 'FM' ? 0.2 : 10;
    const nextFreq = Math.min(maxFreq, Number((currentFreq + step).toFixed(1)));
    setCurrentFreq(nextFreq);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-[#0E0E0E] border-2 border-[#262626] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Subtle Grid / Texture Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#333333_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
      
      {/* Corner Accents */}
      <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-[#FF3D00]/60"></div>
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#FF3D00]/60"></div>
      <div className="absolute bottom-3 left-3 w-2 h-2 rounded-full bg-[#FF3D00]/60"></div>
      <div className="absolute bottom-3 right-3 w-2 h-2 rounded-full bg-[#FF3D00]/60"></div>

      {/* Top Header of Vintage Radio */}
      <div className="flex items-center justify-between border-b border-[#262626] pb-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#181818] border border-[#333333] flex items-center justify-center text-[#FF3D00]">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black tracking-wider text-[#F0F0F0] uppercase">
              VINTAGE KERALA RADIO DIAL
            </h2>
            <p className="text-xs text-[#888888] font-malayalam">
              അനലോഗ് ഫ്രീക്വൻസി ട്യൂണർ • 88.0 - 108.0 MHz
            </p>
          </div>
        </div>

        {/* Band Switch (FM / AM) */}
        <div className="flex items-center bg-[#141414] border border-[#333333] p-1 rounded-lg">
          <button
            onClick={() => { setSelectedBand('FM'); setCurrentFreq(94.3); }}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition ${
              selectedBand === 'FM'
                ? 'bg-[#FF3D00] text-black shadow-md'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            FM BAND
          </button>
          <button
            onClick={() => { setSelectedBand('AM'); setCurrentFreq(810); }}
            className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition ${
              selectedBand === 'AM'
                ? 'bg-[#FF3D00] text-black shadow-md'
                : 'text-[#888888] hover:text-white'
            }`}
          >
            AM / MW
          </button>
        </div>
      </div>

      {/* Illuminated Backlit Glass Tuner Dial */}
      <div className="relative rounded-xl bg-[#0A0A0A] border border-[#333333] p-5 sm:p-6 shadow-inner overflow-hidden mb-6 relative z-10">
        
        {/* Flame Backlight Glow */}
        <div className="absolute inset-0 bg-radial from-[#FF3D00]/10 via-transparent to-transparent pointer-events-none" />

        {/* Frequency Reading Digit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse"></span>
            <span className="text-xs font-mono font-bold tracking-widest text-[#FF3D00] uppercase">
              SIGNAL: {playbackStatus === 'playing' ? 'LOCKED (STEREO)' : 'SEARCHING'}
            </span>
          </div>

          <div className="font-mono text-3xl font-black text-[#F0F0F0] tracking-wider bg-[#141414] px-4 py-1 rounded-lg border border-[#FF3D00]/40 shadow-inner">
            {currentFreq.toFixed(selectedBand === 'FM' ? 1 : 0)}
            <span className="text-sm font-sans font-bold text-[#FF3D00] ml-1.5">
              {selectedBand === 'FM' ? 'MHz' : 'kHz'}
            </span>
          </div>
        </div>

        {/* Dial Scale Bar */}
        <div 
          ref={dialRef}
          onClick={handleDialClick}
          className="relative h-28 bg-[#111111] border border-[#2A2A2A] rounded-lg cursor-crosshair overflow-hidden select-none py-2"
        >
          {/* Tick marks along top and bottom */}
          <div className="absolute inset-x-4 top-2 flex justify-between items-end h-6 border-b border-[#333333]">
            {Array.from({ length: 41 }).map((_, i) => {
              const isMajor = i % 4 === 0;
              return (
                <div 
                  key={i} 
                  className={`w-0.5 ${isMajor ? 'h-4 bg-[#FF3D00]' : 'h-2 bg-[#444444]'}`}
                />
              );
            })}
          </div>

          {/* Major Frequency Numbers */}
          <div className="absolute inset-x-4 top-9 flex justify-between text-[11px] font-mono font-bold text-[#CCCCCC]">
            {selectedBand === 'FM' ? (
              <>
                <span>88</span>
                <span>92</span>
                <span>96</span>
                <span>100</span>
                <span>104</span>
                <span>108</span>
              </>
            ) : (
              <>
                <span>530</span>
                <span>700</span>
                <span>900</span>
                <span>1100</span>
                <span>1300</span>
                <span>1600</span>
              </>
            )}
          </div>

          {/* Station Markers on Dial */}
          <div className="absolute inset-x-4 bottom-3 flex items-center h-8">
            {allStations.map(station => {
              const sf = parseStationFreq(station);
              if (!sf) return null;
              if (selectedBand === 'FM' && (sf < minFreq || sf > maxFreq)) return null;
              if (selectedBand === 'AM' && (sf < minFreq || sf > maxFreq)) return null;

              const leftPct = ((sf - minFreq) / (maxFreq - minFreq)) * 100;
              const isSelected = currentStation?.id === station.id;

              return (
                <div
                  key={station.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentFreq(sf);
                    playStation(station);
                  }}
                  style={{ left: `${leftPct}%` }}
                  className={`absolute -translate-x-1/2 flex flex-col items-center cursor-pointer group hover:z-20 transition`}
                  title={`${station.name} (${sf} ${selectedBand === 'FM' ? 'MHz' : 'kHz'})`}
                >
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-[#FF3D00] shadow-md shadow-[#FF3D00]' : 'bg-[#555555] group-hover:bg-[#FF3D00]'} transition`} />
                  <span className={`text-[9px] font-bold tracking-tighter truncate max-w-[60px] mt-0.5 ${isSelected ? 'text-[#FF3D00]' : 'text-[#666666] group-hover:text-white'}`}>
                    {station.name.replace('Radio ', '').replace('AIR ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* The Glowing Red / Flame Indicator Needle */}
          <div
            style={{ left: `${needlePercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-[#FF3D00] shadow-[0_0_12px_#FF3D00] -translate-x-1/2 pointer-events-none transition-all duration-150 z-10"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF3D00] rounded-full shadow-lg" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#FF3D00] rounded-full shadow-lg" />
          </div>
        </div>
      </div>

      {/* Physical Tuning Controls & Quick Snapping Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 relative z-10">
        
        {/* Fine Tuning Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTunePrev}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#333333] hover:border-[#FF3D00]/50 text-[#CCCCCC] hover:text-[#FF3D00] font-bold text-xs shadow transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>FINE TUNE -</span>
          </button>
          <button
            onClick={handleTuneNext}
            className="flex items-center gap-1 px-3.5 py-2 rounded-lg bg-[#141414] hover:bg-[#202020] border border-[#333333] hover:border-[#FF3D00]/50 text-[#CCCCCC] hover:text-[#FF3D00] font-bold text-xs shadow transition active:scale-95"
          >
            <span>FINE TUNE +</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Station Preset Buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {allStations.slice(0, 5).map(station => {
            const isPlaying = currentStation?.id === station.id && playbackStatus === 'playing';
            return (
              <button
                key={station.id}
                onClick={() => {
                  const sf = parseStationFreq(station);
                  if (sf) setCurrentFreq(sf);
                  playStation(station);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-[#FF3D00] text-black border-[#FF3D00] shadow-md shadow-[#FF3D00]/30'
                    : 'bg-[#141414] text-[#888888] hover:text-white border-[#333333] hover:bg-[#1E1E1E]'
                }`}
              >
                <Disc3 className={`w-3 h-3 ${isPlaying ? 'animate-spin' : ''}`} />
                <span className="truncate max-w-[90px]">{station.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
