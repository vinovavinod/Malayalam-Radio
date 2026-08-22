import React, { useState, useRef, useEffect } from 'react';
import { Radio, Sparkles, ChevronRight, ChevronLeft, Disc3, Flame } from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { RadioStation } from '../types/radio';

export const RetroRadioTuner: React.FC = () => {
  const { allStations, currentStation, playStation, playbackStatus } = useRadio();

  const [selectedBand, setSelectedBand] = useState<'FM' | 'AM'>('FM');
  const [currentFreq, setCurrentFreq] = useState<number>(94.3); // default FM frequency in MHz
  const dialRef = useRef<HTMLDivElement | null>(null);

  // Parse frequency number from station if present
  const parseStationFreq = (station: RadioStation): number | null => {
    if (!station.frequency) return null;
    const match = station.frequency.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

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
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 bg-gradient-to-b from-[#1E1710] to-[#120E0A] border-2 border-amber-500/40 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Kasavu Gold Decorative Floral Ring Motif */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-yellow-500/10 rounded-full blur-2xl pointer-events-none" />
      
      {/* Brass Corner Studs */}
      <div className="absolute top-3.5 left-3.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-600 shadow-md border border-amber-300"></div>
      <div className="absolute top-3.5 right-3.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-600 shadow-md border border-amber-300"></div>
      <div className="absolute bottom-3.5 left-3.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-600 shadow-md border border-amber-300"></div>
      <div className="absolute bottom-3.5 right-3.5 w-3 h-3 rounded-full bg-gradient-to-br from-amber-200 to-yellow-600 shadow-md border border-amber-300"></div>

      {/* Top Header of Vintage Radio */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black tracking-wider text-amber-100 uppercase flex items-center gap-1.5">
              <span>പൊന്നോണം VINTAGE RADIO DIAL</span>
            </h2>
            <p className="text-xs text-amber-200/70 font-malayalam">
              ക്ലാസിക് അനലോഗ് ട്യൂണർ • Kerala FM Broadcast 88.0 - 108.0 MHz
            </p>
          </div>
        </div>

        {/* Band Switch (FM / AM) */}
        <div className="flex items-center bg-[#17120B] border border-amber-500/30 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => { setSelectedBand('FM'); setCurrentFreq(94.3); }}
            className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition ${
              selectedBand === 'FM'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow'
                : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            FM BAND
          </button>
          <button
            onClick={() => { setSelectedBand('AM'); setCurrentFreq(810); }}
            className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-lg transition ${
              selectedBand === 'AM'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow'
                : 'text-amber-200/60 hover:text-amber-100'
            }`}
          >
            AM / MW
          </button>
        </div>
      </div>

      {/* Illuminated Backlit Warm Glass Tuner Dial */}
      <div className="relative rounded-2xl bg-[#0D0A07] border border-amber-500/40 p-4 sm:p-6 shadow-inner overflow-hidden mb-5 z-10">
        
        {/* Warm Golden Backlight Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-yellow-400/10 to-amber-500/5 pointer-events-none" />

        {/* Frequency Reading Digit */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400 animate-flame" />
            <span className="text-xs font-mono font-bold tracking-widest text-amber-300 uppercase">
              SIGNAL: {playbackStatus === 'playing' ? 'LOCKED (STEREO HD)' : 'TUNING'}
            </span>
          </div>

          <div className="font-mono text-2xl sm:text-3xl font-black text-amber-200 tracking-wider bg-[#1B140D] px-4 py-1 rounded-xl border border-amber-500/50 shadow-inner">
            {currentFreq.toFixed(selectedBand === 'FM' ? 1 : 0)}
            <span className="text-sm font-sans font-bold text-amber-400 ml-1.5">
              {selectedBand === 'FM' ? 'MHz' : 'kHz'}
            </span>
          </div>
        </div>

        {/* Dial Scale Bar */}
        <div 
          ref={dialRef}
          onClick={handleDialClick}
          className="relative h-28 bg-[#15100A] border border-amber-500/30 rounded-xl cursor-crosshair overflow-hidden select-none py-2"
        >
          {/* Tick marks along top and bottom */}
          <div className="absolute inset-x-4 top-2 flex justify-between items-end h-6 border-b border-amber-500/30">
            {Array.from({ length: 41 }).map((_, i) => {
              const isMajor = i % 4 === 0;
              return (
                <div 
                  key={i} 
                  className={`w-0.5 ${isMajor ? 'h-4 bg-amber-400' : 'h-2 bg-amber-500/40'}`}
                />
              );
            })}
          </div>

          {/* Major Frequency Numbers */}
          <div className="absolute inset-x-4 top-9 flex justify-between text-[11px] font-mono font-bold text-amber-200/90">
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
                  <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 shadow-md shadow-amber-400' : 'bg-amber-500/40 group-hover:bg-amber-400'} transition`} />
                  <span className={`text-[9px] font-bold tracking-tighter truncate max-w-[65px] mt-0.5 ${isSelected ? 'text-amber-300 font-extrabold' : 'text-neutral-400 group-hover:text-amber-200'}`}>
                    {station.name.replace('Radio ', '').replace('AIR ', '')}
                  </span>
                </div>
              );
            })}
          </div>

          {/* The Glowing Gold Indicator Needle */}
          <div
            style={{ left: `${needlePercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-200 via-amber-400 to-yellow-500 shadow-[0_0_12px_#FFD700] -translate-x-1/2 pointer-events-none transition-all duration-150 z-10"
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-lg border border-yellow-200" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-amber-300 rounded-full shadow-lg border border-yellow-200" />
          </div>
        </div>
      </div>

      {/* Physical Tuning Controls & Quick Snapping Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1 relative z-10">
        
        {/* Fine Tuning Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTunePrev}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#1C160F] hover:bg-[#281F15] border border-amber-500/30 hover:border-amber-400 text-amber-200 font-bold text-xs shadow transition active:scale-95"
          >
            <ChevronLeft className="w-4 h-4 text-amber-400" />
            <span>FINE TUNE -</span>
          </button>
          <button
            onClick={handleTuneNext}
            className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-[#1C160F] hover:bg-[#281F15] border border-amber-500/30 hover:border-amber-400 text-amber-200 font-bold text-xs shadow transition active:scale-95"
          >
            <span>FINE TUNE +</span>
            <ChevronRight className="w-4 h-4 text-amber-400" />
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  isPlaying
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-amber-300 shadow-md shadow-amber-500/25'
                    : 'bg-[#1C160F] text-amber-200/70 hover:text-white border-amber-500/25 hover:bg-[#261E14]'
                }`}
              >
                <Disc3 className={`w-3 h-3 ${isPlaying ? 'animate-spin text-black' : 'text-amber-400'}`} />
                <span className="truncate max-w-[95px]">{station.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
