import React, { useState, useRef, useEffect } from 'react';
import { 
  Radio, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  RotateCw, 
  Zap, 
  Disc3, 
  Volume2, 
  Sliders, 
  Wifi, 
  Play, 
  Pause,
  ArrowLeft,
  ArrowRight,
  Delete,
  Hash
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { RadioStation } from '../types/radio';
import { StationIcon } from './StationIcon';

export const DigitalTunerSynthesizer: React.FC = () => {
  const { 
    allStations, 
    currentStation, 
    playStation, 
    playbackStatus,
    togglePlayPause,
    isBoosted,
    toggleBoost
  } = useRadio();

  const [selectedBand, setSelectedBand] = useState<'FM' | 'AM' | 'DAB'>('FM');
  const [currentFreq, setCurrentFreq] = useState<number>(94.3);
  const [keypadInput, setKeypadInput] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [jogAngle, setJogAngle] = useState<number>(0);
  const [isDraggingJog, setIsDraggingJog] = useState<boolean>(false);

  const dialRef = useRef<HTMLDivElement | null>(null);
  const jogRef = useRef<HTMLDivElement | null>(null);
  const startDragRef = useRef<{ startY: number; startAngle: number }>({ startY: 0, startAngle: 0 });

  // Parse frequency number from station if present
  const parseStationFreq = (station: RadioStation): number | null => {
    if (!station.frequency) return null;
    const match = station.frequency.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : null;
  };

  const minFreq = selectedBand === 'FM' ? 88.0 : selectedBand === 'AM' ? 530 : 174;
  const maxFreq = selectedBand === 'FM' ? 108.0 : selectedBand === 'AM' ? 1600 : 240;

  // Sync tuner dial when current station changes
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

  // Frequency change helper & auto-tune to matching station
  const tuneToFrequency = (freq: number) => {
    const clamped = Math.max(minFreq, Math.min(maxFreq, Number(freq.toFixed(1))));
    setCurrentFreq(clamped);

    // Find nearest station
    const nearest = allStations.find(s => {
      const sf = parseStationFreq(s);
      return sf && Math.abs(sf - clamped) <= (selectedBand === 'FM' ? 0.35 : 20);
    });

    if (nearest && nearest.id !== currentStation?.id) {
      playStation(nearest);
    }
  };

  // Step frequency buttons
  const stepFreq = (delta: number) => {
    tuneToFrequency(currentFreq + delta);
    setJogAngle(prev => prev + delta * 30);
  };

  // Auto Seek Scan forward / backward
  const handleAutoSeek = (direction: 'up' | 'down') => {
    setIsScanning(true);
    const stationsWithFreq = allStations
      .map(s => ({ station: s, freq: parseStationFreq(s) }))
      .filter((s): s is { station: RadioStation; freq: number } => s.freq !== null)
      .sort((a, b) => a.freq - b.freq);

    if (stationsWithFreq.length === 0) {
      setIsScanning(false);
      return;
    }

    let target: { station: RadioStation; freq: number } | undefined;

    if (direction === 'up') {
      target = stationsWithFreq.find(s => s.freq > currentFreq + 0.1);
      if (!target) target = stationsWithFreq[0]; // Wrap around
    } else {
      const reversed = [...stationsWithFreq].reverse();
      target = reversed.find(s => s.freq < currentFreq - 0.1);
      if (!target) target = reversed[0]; // Wrap around
    }

    if (target) {
      setTimeout(() => {
        tuneToFrequency(target!.freq);
        playStation(target!.station);
        setIsScanning(false);
      }, 350);
    } else {
      setIsScanning(false);
    }
  };

  // Direct Keypad input
  const handleKeypadPress = (val: string) => {
    if (keypadInput.length >= 6) return;
    setKeypadInput(prev => prev + val);
  };

  const handleKeypadSubmit = () => {
    const num = parseFloat(keypadInput);
    if (!isNaN(num) && num >= minFreq && num <= maxFreq) {
      tuneToFrequency(num);
    }
    setKeypadInput('');
  };

  // Waterfall Spectrum Click
  const handleWaterfallClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dialRef.current) return;
    const rect = dialRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const newFreq = selectedBand === 'FM' 
      ? Number((minFreq + pct * (maxFreq - minFreq)).toFixed(1))
      : Math.round(minFreq + pct * (maxFreq - minFreq));
    tuneToFrequency(newFreq);
  };

  // Needle percentage calculation
  const needlePercent = Math.max(0, Math.min(100, ((currentFreq - minFreq) / (maxFreq - minFreq)) * 100));

  // Matched station for currently tuned frequency
  const matchedStation = allStations.find(s => {
    const sf = parseStationFreq(s);
    return sf && Math.abs(sf - currentFreq) <= 0.4;
  });

  return (
    <div 
      id="digital-tuner-synthesizer-view"
      className="w-full max-w-5xl mx-auto my-4 bg-gradient-to-b from-[#1C160F] via-[#120E0A] to-[#0A0805] border-2 border-amber-500/40 rounded-3xl p-4 sm:p-7 shadow-2xl shadow-black/80 relative overflow-hidden"
    >
      {/* Precision Metallic Chamfers & Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Receiver Top Faceplate Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 mb-5 flex-wrap gap-3 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#0F0B07] border-2 border-amber-400/50 flex items-center justify-center text-amber-300 shadow-md">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-black tracking-wider text-amber-100 uppercase flex items-center gap-2">
              <span>DIGITAL PLL FREQUENCY SYNTHESIZER</span>
            </h2>
            <p className="text-xs text-amber-200/70 font-mono">
              PRECISION RECEIVER • 0.05 MHz STEP TUNING & AUTO-SEEK SCANNER
            </p>
          </div>
        </div>

        {/* Band Selection Buttons (FM / AM / DAB+) */}
        <div className="flex items-center bg-[#0D0905] border border-amber-500/35 p-1 rounded-xl shadow-inner">
          <button
            onClick={() => { setSelectedBand('FM'); tuneToFrequency(94.3); }}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
              selectedBand === 'FM'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            FM (88 - 108)
          </button>
          <button
            onClick={() => { setSelectedBand('AM'); tuneToFrequency(810); }}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
              selectedBand === 'AM'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            MW / AM
          </button>
          <button
            onClick={() => { setSelectedBand('DAB'); tuneToFrequency(225.6); }}
            className={`px-3.5 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg transition ${
              selectedBand === 'DAB'
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-md'
                : 'text-amber-200/60 hover:text-white'
            }`}
          >
            DAB+ / IP
          </button>
        </div>
      </div>

      {/* MASTER DIGITAL TUNER OLED DISPLAY SCREEN */}
      <div className="w-full bg-[#050403] border-2 border-amber-500/50 rounded-2xl p-4 sm:p-6 shadow-inner relative overflow-hidden mb-6">
        {/* Subtle Matrix Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.6)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center relative z-10">
          
          {/* Main Giant Frequency 7-Segment Readout */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-amber-400/20 text-amber-300 border border-amber-400/35">
                PLL SYNTHESIZED {selectedBand}
              </span>
              {matchedStation ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  STATION LOCKED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400/70 border border-amber-500/20">
                  CARRIER DETECTED
                </span>
              )}
            </div>

            {/* Huge Digital Number Readout */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-[#FFE680] drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                {currentFreq.toFixed(1)}
              </span>
              <span className="text-xl sm:text-2xl font-mono font-bold text-amber-400/80">
                {selectedBand === 'AM' ? 'kHz' : 'MHz'}
              </span>
            </div>

            {/* Matched Station Details */}
            {matchedStation ? (
              <div className="mt-2 pt-2 border-t border-amber-500/20 flex items-center gap-3">
                <StationIcon station={matchedStation} size="sm" isPlaying={playbackStatus === 'playing'} />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white truncate">
                    {matchedStation.name}
                  </h3>
                  <p className="text-xs text-amber-300/80 font-malayalam truncate">
                    {matchedStation.malayalamName || matchedStation.location || 'Kerala Radio'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-amber-500/20 text-xs font-mono text-amber-200/50">
                Tune stepper or jog wheel to lock into verified Kerala broadcast channels.
              </div>
            )}
          </div>

          {/* Direct Numerical Keypad Input Strip */}
          <div className="lg:col-span-5 bg-[#0D0905] border border-amber-500/30 rounded-xl p-3 shadow-inner">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase text-amber-300 flex items-center gap-1">
                <Hash className="w-3 h-3 text-amber-400" />
                <span>DIRECT FREQUENCY ENTRY</span>
              </span>
              <span className="text-xs font-mono font-bold text-amber-200 px-2 py-0.5 rounded bg-[#181109] border border-amber-500/25 min-w-16 text-right">
                {keypadInput ? `${keypadInput} MHz` : '---.-'}
              </span>
            </div>

            {/* Keypad Grid (0-9, dot, clear, tune) */}
            <div className="grid grid-cols-4 gap-1">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', 'CLR'].map(key => (
                <button
                  key={key}
                  id={`keypad-btn-${key}`}
                  onClick={() => {
                    if (key === 'CLR') {
                      setKeypadInput('');
                    } else {
                      handleKeypadPress(key);
                    }
                  }}
                  className="py-1.5 rounded bg-[#18120B] hover:bg-[#281F14] text-xs font-mono font-bold text-amber-200 hover:text-white border border-amber-500/20 active:scale-95 transition"
                >
                  {key}
                </button>
              ))}
            </div>

            <button
              id="keypad-tune-submit-btn"
              onClick={handleKeypadSubmit}
              disabled={!keypadInput}
              className="w-full mt-1.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider hover:brightness-110 disabled:opacity-40 transition shadow"
            >
              TUNE FREQUENCY
            </button>
          </div>
        </div>
      </div>

      {/* FREQUENCY WATERFALL BAND SPECTRUM RIBBON */}
      <div className="w-full bg-[#080604] border border-amber-500/35 rounded-2xl p-4 shadow-inner mb-6 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-300">
            KERALA BROADCAST SPECTRUM RIBBON (88.0 - 108.0 MHz)
          </span>
          <span className="text-[11px] font-mono text-amber-200/60">
            CLICK ANYWHERE ON RIBBON TO TUNE
          </span>
        </div>

        {/* Dial Scale Strip */}
        <div 
          ref={dialRef}
          onClick={handleWaterfallClick}
          className="relative w-full h-14 bg-gradient-to-b from-[#16100A] to-[#0A0704] rounded-xl border border-amber-500/30 cursor-pointer overflow-hidden select-none"
        >
          {/* Tick marks */}
          <div className="absolute inset-0 flex justify-between items-end px-2 pb-1.5 pointer-events-none opacity-80">
            {Array.from({ length: 41 }).map((_, i) => {
              const isMajor = i % 5 === 0;
              const freqVal = (minFreq + (i / 40) * (maxFreq - minFreq)).toFixed(1);
              return (
                <div key={i} className="flex flex-col items-center">
                  {isMajor && (
                    <span className="text-[9px] font-mono font-bold text-amber-300/80 mb-1">
                      {freqVal}
                    </span>
                  )}
                  <span 
                    className={`w-0.5 ${
                      isMajor ? 'h-4 bg-amber-400' : 'h-2 bg-amber-600/60'
                    }`} 
                  />
                </div>
              );
            })}
          </div>

          {/* Station Markers on Waterfall Band */}
          {allStations.map(station => {
            const f = parseStationFreq(station);
            if (!f || f < minFreq || f > maxFreq) return null;
            const pct = ((f - minFreq) / (maxFreq - minFreq)) * 100;
            const isThisCurrent = currentStation?.id === station.id;

            return (
              <div
                key={station.id}
                style={{ left: `${pct}%` }}
                onClick={(e) => {
                  e.stopPropagation();
                  tuneToFrequency(f);
                  playStation(station);
                }}
                className={`absolute top-1 -translate-x-1/2 flex flex-col items-center group cursor-pointer z-10`}
                title={`${station.name} (${f} MHz)`}
              >
                <div className={`w-2 h-2 rounded-full transition-all ${
                  isThisCurrent
                    ? 'bg-amber-300 ring-4 ring-amber-400/50 scale-125'
                    : 'bg-amber-500/70 hover:bg-amber-300 hover:scale-110'
                }`} />
              </div>
            );
          })}

          {/* Tuner Indicator Needle */}
          <div 
            style={{ left: `${needlePercent}%` }}
            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 shadow-[0_0_12px_rgba(255,215,0,0.9)] -translate-x-1/2 z-20 pointer-events-none transition-all duration-150"
          >
            <div className="w-3 h-3 bg-amber-300 border border-black rounded-full -translate-x-1 -translate-y-1 shadow-md" />
          </div>
        </div>
      </div>

      {/* TACTILE TUNER CONTROLS & STEPPERS */}
      <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 pt-3 border-t border-amber-500/25">
        
        {/* Left: Step Buttons (-1.0, -0.1, +0.1, +1.0) */}
        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <button
            id="tuner-step-minus-1"
            onClick={() => stepFreq(-1.0)}
            className="px-3 py-2 rounded-xl bg-[#18120B] hover:bg-[#261E14] text-xs font-mono font-bold text-amber-200 hover:text-white border border-amber-500/25 transition active:scale-95 shadow"
          >
            -1.0 MHz
          </button>
          <button
            id="tuner-step-minus-01"
            onClick={() => stepFreq(-0.1)}
            className="px-3 py-2 rounded-xl bg-[#18120B] hover:bg-[#261E14] text-xs font-mono font-bold text-amber-200 hover:text-white border border-amber-500/25 transition active:scale-95 shadow"
          >
            -0.1 MHz
          </button>
          <button
            id="tuner-step-plus-01"
            onClick={() => stepFreq(0.1)}
            className="px-3 py-2 rounded-xl bg-[#18120B] hover:bg-[#261E14] text-xs font-mono font-bold text-amber-200 hover:text-white border border-amber-500/25 transition active:scale-95 shadow"
          >
            +0.1 MHz
          </button>
          <button
            id="tuner-step-plus-1"
            onClick={() => stepFreq(1.0)}
            className="px-3 py-2 rounded-xl bg-[#18120B] hover:bg-[#261E14] text-xs font-mono font-bold text-amber-200 hover:text-white border border-amber-500/25 transition active:scale-95 shadow"
          >
            +1.0 MHz
          </button>
        </div>

        {/* Center: Auto-Seek Scan Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="tuner-auto-seek-prev"
            onClick={() => handleAutoSeek('down')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-[#1A130C] hover:bg-[#281E13] text-xs font-mono font-black uppercase text-amber-300 hover:text-white border border-amber-500/35 transition active:scale-95 flex items-center gap-1.5 shadow"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>SEEK ◀</span>
          </button>

          <button
            id="tuner-auto-seek-next"
            onClick={() => handleAutoSeek('up')}
            disabled={isScanning}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-mono font-black uppercase hover:brightness-110 transition active:scale-95 flex items-center gap-1.5 shadow-md shadow-amber-500/30"
          >
            <span>SEEK ▶</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Station Snap if Matched */}
        {matchedStation && (
          <div className="flex items-center gap-2">
            <button
              id="tuner-play-matched-btn"
              onClick={() => {
                if (currentStation?.id === matchedStation.id) {
                  togglePlayPause();
                } else {
                  playStation(matchedStation);
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition shadow"
            >
              {playbackStatus === 'playing' && currentStation?.id === matchedStation.id ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-black" />
                  <span>Pause {matchedStation.name}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Play {matchedStation.name}</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
