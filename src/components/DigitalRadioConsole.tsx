import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Sparkles, 
  SlidersHorizontal, 
  Clock, 
  Mic, 
  Volume2, 
  VolumeX, 
  Zap, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Heart, 
  Wifi, 
  Activity, 
  Layers, 
  BookmarkPlus, 
  Check,
  Disc3,
  Flame,
  Maximize2
} from 'lucide-react';
import { useRadio } from '../context/RadioContext';
import { StationIcon } from './StationIcon';

interface DigitalRadioConsoleProps {
  onOpenVisualizerModal: () => void;
  onOpenEqModal: () => void;
  onOpenSleepModal: () => void;
  onOpenRecordingsModal: () => void;
}

export const DigitalRadioConsole: React.FC<DigitalRadioConsoleProps> = ({
  onOpenVisualizerModal,
  onOpenEqModal,
  onOpenSleepModal,
  onOpenRecordingsModal,
}) => {
  const {
    currentStation,
    playbackStatus,
    togglePlayPause,
    playNextStation,
    playPreviousStation,
    volume,
    setVolume,
    isMuted,
    toggleMute,
    isBoosted,
    toggleBoost,
    favorites,
    toggleFavorite,
    presets,
    setPresetSlot,
    playPreset,
    allStations,
    sleepTimerRemainingSec,
    isRecording,
    recordingDurationSec,
    startRecording,
    stopRecording,
    analyserNode,
    selectedPresetName
  } = useRadio();

  const [assigningSlot, setAssigningSlot] = useState<number | null>(null);
  const [tickerOffset, setTickerOffset] = useState(0);
  const [digitalTime, setDigitalTime] = useState('');
  const [digitalDate, setDigitalDate] = useState('');
  const [signalBars, setSignalBars] = useState(5);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Digital Clock with IST Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const dateStr = now.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
      setDigitalTime(timeStr);
      setDigitalDate(dateStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fluctuate signal strength realistically
  useEffect(() => {
    const interval = setInterval(() => {
      if (playbackStatus === 'playing') {
        setSignalBars(Math.random() > 0.15 ? 5 : 4);
      } else if (playbackStatus === 'loading') {
        setSignalBars(3);
      } else {
        setSignalBars(1);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [playbackStatus]);

  // Real-time OLED Spectrum Display
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const bufferLength = analyserNode ? analyserNode.frequencyBinCount : 32;
    const dataArray = new Uint8Array(bufferLength);
    let tick = 0;

    const render = () => {
      animationId = requestAnimationFrame(render);
      tick += 0.05;

      if (analyserNode && playbackStatus === 'playing') {
        analyserNode.getByteFrequencyData(dataArray);
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const barCount = 24;
      const spacing = 3;
      const barWidth = (canvas.width - (barCount - 1) * spacing) / barCount;
      const isLive = playbackStatus === 'playing';

      for (let i = 0; i < barCount; i++) {
        let val = 0;
        if (isLive && analyserNode) {
          const idx = Math.floor((i / barCount) * (bufferLength * 0.7));
          val = dataArray[idx] || 0;
        } else if (isLive) {
          const s1 = Math.sin(tick * 3 + i * 0.3);
          const s2 = Math.cos(tick * 1.8 - i * 0.2);
          val = Math.max(15, (s1 * 0.5 + s2 * 0.4 + 0.5) * 230);
        } else {
          val = 8;
        }

        const barHeight = Math.max(3, (val / 255) * canvas.height * 0.92);
        const x = i * (barWidth + spacing);
        const y = canvas.height - barHeight;

        // Digital Segmented LED effect
        const segments = 8;
        const segHeight = barHeight / segments;

        for (let s = 0; s < segments; s++) {
          const segY = canvas.height - (s + 1) * segHeight;
          const segH = Math.max(1.5, segHeight - 1);

          // LED Color gradient: Amber -> Gold -> Cyan peak
          if (s >= 6) {
            ctx.fillStyle = isLive ? '#38BDF8' : '#334155'; // Peak Cyan LED
          } else if (s >= 4) {
            ctx.fillStyle = isLive ? '#FDE047' : '#475569'; // Yellow LED
          } else {
            ctx.fillStyle = isLive ? '#F59E0B' : '#332415'; // Amber LED
          }

          ctx.fillRect(x, segY, barWidth, segH);
        }
      }
    };

    render();
    return () => cancelAnimationFrame(animationId);
  }, [analyserNode, playbackStatus]);

  // RDS Dynamic Program Ticker
  const rdsText = currentStation 
    ? `▶ [LIVE FM] ${currentStation.name} • ${currentStation.frequency || 'DIGITAL STEREO'} • ${currentStation.location || 'KERALA BROADCAST'} • ${currentStation.malayalamName || 'മലയാളം തത്സമയം'} • ${isBoosted ? 'DSP +6dB BASS ACTIVE' : 'HI-RES STEREO'} • STEREO 320 KBPS AAC-LC`
    : `▶ KERALA DIGITAL RADIO RECEIVER • READY FOR RECEPTION • SELECT A PRESET OR STATION FROM LIST`;

  const isFav = currentStation ? favorites.includes(currentStation.id) : false;

  const formatSleepTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <section 
      id="digital-radio-console-receiver"
      className="w-full mb-6 relative rounded-3xl bg-gradient-to-b from-[#1E1812] via-[#15100B] to-[#0D0A07] border-2 border-amber-500/40 p-3 sm:p-5 shadow-2xl shadow-black/80 overflow-hidden"
    >
      {/* Metallic Chassis Chamfers & Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
      
      {/* Precision CNC Allen Screw Corner Rivets */}
      <div className="absolute top-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4A3D2E] to-[#1C1712] border border-amber-500/30 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-amber-400/40 transform rotate-45" />
      </div>
      <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4A3D2E] to-[#1C1712] border border-amber-500/30 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-amber-400/40 transform rotate-45" />
      </div>
      <div className="absolute bottom-2.5 left-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4A3D2E] to-[#1C1712] border border-amber-500/30 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-amber-400/40 transform rotate-45" />
      </div>
      <div className="absolute bottom-2.5 right-2.5 w-2.5 h-2.5 rounded-full bg-gradient-to-br from-[#4A3D2E] to-[#1C1712] border border-amber-500/30 flex items-center justify-center">
        <div className="w-1 h-0.5 bg-amber-400/40 transform rotate-45" />
      </div>

      {/* Top Receiver Chassis Bar */}
      <div className="flex items-center justify-between border-b border-amber-500/25 pb-3 mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="px-2.5 py-1 rounded-md bg-[#0F0B07] border border-amber-500/35 flex items-center gap-1.5 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-300 font-mono">
              DIGITAL RECEIVER • DAB+ / FM / IP
            </span>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-mono text-amber-200/60">
            MODEL: KR-9000HiFi
          </span>
        </div>

        {/* Receiver Telemetry Status Badges */}
        <div className="flex items-center gap-2">
          {/* Signal RSSI Meter */}
          <div className="flex items-center gap-1 bg-[#0F0B07] px-2 py-0.5 rounded border border-amber-500/25">
            <span className="text-[9px] font-mono font-bold text-amber-300/80">SIGNAL</span>
            <div className="flex items-end gap-0.5 h-3">
              {[1, 2, 3, 4, 5].map(bar => (
                <span
                  key={bar}
                  className={`w-1 rounded-xs transition-all ${
                    bar <= signalBars
                      ? bar === 5
                        ? 'h-3 bg-emerald-400'
                        : bar >= 3
                        ? 'h-2.5 bg-amber-400'
                        : 'h-1.5 bg-amber-500'
                      : 'h-1 bg-neutral-700'
                  }`}
                />
              ))}
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 ml-0.5">
              {playbackStatus === 'playing' ? 'LOCK' : 'SEARCH'}
            </span>
          </div>

          {/* Master Clock */}
          <div className="hidden md:flex items-center gap-1.5 bg-[#0F0B07] px-2.5 py-0.5 rounded border border-amber-500/25 text-amber-200">
            <span className="text-[9px] uppercase tracking-wider font-bold text-amber-400/70 font-mono">IST</span>
            <span className="text-xs font-mono font-bold text-[#FFE6A7]">{digitalTime}</span>
          </div>
        </div>
      </div>

      {/* MASTER DIGITAL OLED / VFD MATRIX DISPLAY CONSOLE */}
      <div className="w-full bg-[#080604] border-2 border-amber-500/40 rounded-2xl p-3.5 sm:p-5 relative overflow-hidden shadow-inner flex flex-col gap-3">
        {/* Subtle OLED Scanline Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-40 z-20" />
        <div className="absolute top-0 right-0 w-96 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Display Row 1: Frequency Large Readout, Station Name & Live Badges */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 relative z-10">
          
          {/* Main Station Info with Glowing Digital Frequency */}
          <div className="flex items-center gap-3.5 min-w-0">
            {currentStation ? (
              <StationIcon 
                station={currentStation} 
                size="md" 
                isPlaying={playbackStatus === 'playing'}
                className="ring-2 ring-amber-400/40 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#1A140E] border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow">
                <Radio className="w-6 h-6" />
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Digital Frequency Big Readout */}
                <span className="text-xl sm:text-2xl lg:text-3xl font-black font-mono tracking-tight text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                  {currentStation?.frequency || '102.7 MHz'}
                </span>
                
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase bg-amber-400/15 text-amber-200 border border-amber-400/30 shadow-sm">
                  {currentStation?.category?.toUpperCase() || 'FM DIGITAL'}
                </span>

                {playbackStatus === 'playing' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    LIVE ON-AIR
                  </span>
                )}
              </div>

              <h2 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight truncate mt-0.5">
                {currentStation ? currentStation.name : 'Select Radio Station to Broadcast'}
              </h2>

              {currentStation?.malayalamName && (
                <p className="text-xs sm:text-sm font-malayalam text-amber-300/90 font-medium truncate">
                  {currentStation.malayalamName} • {currentStation.location || 'Kerala'}
                </p>
              )}
            </div>
          </div>

          {/* Mini Real-Time LED Audio Spectrum Canvas */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-end border-t lg:border-t-0 pt-2 lg:pt-0 border-amber-500/20">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 text-[10px] font-mono text-amber-300/70">
                <span>DSP: {selectedPresetName.toUpperCase()}</span>
                <span>•</span>
                <span>320K STEREO</span>
              </div>
              <div className="w-48 sm:w-56 h-10 bg-[#040302] rounded-lg border border-amber-500/30 p-1 flex items-center justify-center shadow-inner overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={220}
                  height={36}
                  className="w-full h-full block"
                />
              </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="flex items-center gap-1.5">
              <button
                id="digital-console-visualizer-btn"
                onClick={onOpenVisualizerModal}
                className="p-2 rounded-xl bg-[#1C160F] hover:bg-[#2A2016] border border-amber-500/35 hover:border-amber-300 text-amber-300 hover:text-white transition shadow-sm"
                title="Fullscreen Sound Visualizer"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
              </button>

              <button
                id="digital-console-eq-btn"
                onClick={onOpenEqModal}
                className="p-2 rounded-xl bg-[#1C160F] hover:bg-[#2A2016] border border-amber-500/35 hover:border-amber-300 text-amber-300 hover:text-white transition shadow-sm"
                title="Audio Equalizer & Presets"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Display Row 2: Scrolling RDS Radio-Text Information Ticker */}
        <div className="w-full bg-[#030201] border border-amber-500/30 rounded-lg px-3 py-1.5 overflow-hidden relative shadow-inner flex items-center">
          <span className="text-[10px] font-mono font-bold uppercase text-amber-400 bg-amber-500/20 px-1.5 py-0.5 rounded mr-2 flex-shrink-0 border border-amber-400/30">
            RDS
          </span>
          <div className="overflow-hidden whitespace-nowrap w-full">
            <div className="inline-block animate-marquee text-xs font-mono text-[#FFE4A0] font-medium tracking-wide">
              {rdsText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {rdsText}
            </div>
          </div>
        </div>

        {/* Display Row 3: Digital Presets Bank (P1 to P10 Buttons) */}
        <div className="w-full pt-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-300/80 flex items-center gap-1">
              <BookmarkPlus className="w-3 h-3 text-amber-400" />
              <span>DIGITAL PRESET MEMORY BANK (P1 - P10)</span>
            </span>
            <span className="text-[10px] font-mono text-amber-200/50 hidden sm:inline">
              CLICK PRESET TO TUNE • LONG CLICK / HOLD TO OVERWRITE
            </span>
          </div>

          {/* 10 Preset Tactile Buttons */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {Array.from({ length: 10 }).map((_, index) => {
              const stationId = presets[index];
              const st = allStations.find(s => s.id === stationId);
              const isActive = currentStation && currentStation.id === stationId;
              const isAssigningThis = assigningSlot === index;

              return (
                <button
                  key={index}
                  id={`preset-btn-p${index + 1}`}
                  onClick={() => {
                    if (assigningSlot === index && currentStation) {
                      setPresetSlot(index, currentStation.id);
                      setAssigningSlot(null);
                    } else if (assigningSlot !== null && currentStation) {
                      setPresetSlot(assigningSlot, currentStation.id);
                      setAssigningSlot(null);
                    } else {
                      playPreset(index);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    if (currentStation) {
                      setPresetSlot(index, currentStation.id);
                    }
                  }}
                  className={`group relative flex flex-col items-center justify-center p-1.5 rounded-xl border transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-b from-amber-400 via-amber-500 to-yellow-600 text-black border-amber-300 shadow-md shadow-amber-500/40 font-extrabold ring-1 ring-amber-300'
                      : isAssigningThis
                      ? 'bg-amber-500/30 text-amber-200 border-amber-400 animate-pulse ring-1 ring-amber-400'
                      : 'bg-[#140F0A] hover:bg-[#201811] text-amber-200/80 hover:text-white border-amber-500/25 hover:border-amber-400/60 shadow-inner'
                  }`}
                  title={st ? `P${index + 1}: ${st.name} (${st.frequency || 'Live'})` : `P${index + 1}: Empty (Click to assign)`}
                >
                  <div className="flex items-center gap-1 w-full justify-between px-0.5">
                    <span className={`text-[10px] font-mono font-black ${isActive ? 'text-black' : 'text-amber-400'}`}>
                      P{index + 1}
                    </span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                    )}
                  </div>
                  <span className="text-[10px] font-bold truncate max-w-full leading-tight mt-0.5">
                    {st ? st.name.replace('Radio ', '').replace('AIR ', '') : '---'}
                  </span>
                  <span className={`text-[8px] font-mono truncate max-w-full ${isActive ? 'text-black/80' : 'text-amber-300/60'}`}>
                    {st?.frequency || (st ? 'ONLINE' : 'EMPTY')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Receiver Master Control Panel Strip */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-between pt-3 mt-3 border-t border-amber-500/25 gap-3">
        {/* Left: Quick Actions & Boost */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-start flex-wrap">
          {/* DSP Bass Boost Rocker Switch */}
          <button
            id="dsp-bass-boost-toggle"
            onClick={toggleBoost}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold uppercase transition flex items-center gap-1.5 border shadow-sm ${
              isBoosted
                ? 'bg-amber-400 text-black border-amber-300 shadow-amber-400/30'
                : 'bg-[#18120B] text-amber-300 hover:text-white border-amber-500/30 hover:bg-[#241B12]'
            }`}
            title="Toggle DSP Bass Boost (+6dB)"
          >
            <Zap className={`w-3.5 h-3.5 ${isBoosted ? 'fill-black text-black' : 'text-amber-400'}`} />
            <span>BASS BOOST {isBoosted ? 'ON' : 'OFF'}</span>
          </button>

          {/* Quick Favorite Toggle */}
          {currentStation && (
            <button
              id="console-favorite-btn"
              onClick={() => toggleFavorite(currentStation.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                isFav
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : 'bg-[#18120B] text-amber-200/80 hover:text-white border-amber-500/30 hover:bg-[#241B12]'
              }`}
              title="Add current station to favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
              <span className="hidden xs:inline">{isFav ? 'Favorited' : 'Favorite'}</span>
            </button>
          )}

          {/* Assign Current to Preset button */}
          {currentStation && (
            <button
              id="console-save-preset-btn"
              onClick={() => {
                if (assigningSlot !== null) {
                  setAssigningSlot(null);
                } else {
                  setAssigningSlot(0);
                }
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold bg-[#18120B] hover:bg-[#241B12] text-amber-300 hover:text-white border border-amber-500/30 transition flex items-center gap-1"
              title="Save current station into a Preset slot (P1-P10)"
            >
              <BookmarkPlus className="w-3.5 h-3.5 text-amber-400" />
              <span>SAVE PRESET</span>
            </button>
          )}
        </div>

        {/* Center: Tactile Master Playback Transport Controls */}
        <div className="flex items-center gap-3">
          <button
            id="console-prev-btn"
            onClick={playPreviousStation}
            className="p-2.5 rounded-full bg-[#18120B] hover:bg-[#281F14] text-amber-300 hover:text-white border border-amber-500/30 transition active:scale-95 shadow-md"
            title="Previous Station"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            id="console-play-pause-btn"
            onClick={togglePlayPause}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black flex items-center justify-center font-black shadow-lg shadow-amber-500/40 hover:brightness-110 active:scale-95 transition"
            title={playbackStatus === 'playing' ? 'Pause' : 'Play'}
          >
            {playbackStatus === 'loading' ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : playbackStatus === 'playing' ? (
              <Pause className="w-5 h-5 fill-black" />
            ) : (
              <Play className="w-5 h-5 fill-black ml-0.5" />
            )}
          </button>

          <button
            id="console-next-btn"
            onClick={playNextStation}
            className="p-2.5 rounded-full bg-[#18120B] hover:bg-[#281F14] text-amber-300 hover:text-white border border-amber-500/30 transition active:scale-95 shadow-md"
            title="Next Station"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Master Volume & Attenuation Readout */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-2 bg-[#120D08] px-3 py-1.5 rounded-full border border-amber-500/30 shadow-inner">
            <button 
              id="console-mute-btn"
              onClick={toggleMute} 
              className="text-amber-400 hover:text-white transition"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <input
              id="console-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-20 sm:w-24 h-1.5 bg-[#2B2014] rounded-lg appearance-none cursor-pointer accent-amber-400"
            />

            <span className="text-[10px] font-mono font-bold text-amber-300 w-8 text-right">
              {Math.round(isMuted ? 0 : volume * 100)}%
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
