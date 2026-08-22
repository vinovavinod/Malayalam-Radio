import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Copy, 
  Check, 
  Radio as RadioIcon, 
  Wifi,
  Volume2
} from 'lucide-react';
import { RadioStation } from '../types/radio';
import { useRadio } from '../context/RadioContext';

interface StationCardProps {
  station: RadioStation;
}

export const StationCard: React.FC<StationCardProps> = ({ station }) => {
  const {
    currentStation,
    playbackStatus,
    playStation,
    togglePlayPause,
    favorites,
    toggleFavorite
  } = useRadio();

  const [copied, setCopied] = useState(false);

  const isCurrent = currentStation?.id === station.id;
  const isPlaying = isCurrent && playbackStatus === 'playing';
  const isLoading = isCurrent && playbackStatus === 'loading';
  const isFav = favorites.includes(station.id);

  const handleCardClick = () => {
    if (isCurrent) {
      togglePlayPause();
    } else {
      playStation(station);
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(station.streamUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <div
      id={`station-card-${station.id}`}
      onClick={handleCardClick}
      className={`group relative w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-md gap-3 sm:gap-4 ${
        isCurrent
          ? 'bg-gradient-to-r from-[#261E14] via-[#20180F] to-[#1A130C] border-amber-400 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/50'
          : 'bg-[#18130D] hover:bg-[#201911] border-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/60'
      }`}
    >
      {/* Background Ambient Glow for active station */}
      {isCurrent && (
        <div className="absolute -right-10 -top-10 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Left Section: Play Button / Art + Main Info */}
      <div className="flex items-center gap-3.5 sm:gap-4.5 flex-1 min-w-0 w-full sm:w-auto relative z-10">
        {/* Play/Pause Button Box */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`relative flex-shrink-0 w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all transform active:scale-95 ${
            isCurrent
              ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-black border border-amber-300'
              : 'bg-[#241C13] border border-amber-500/30 text-amber-300 group-hover:border-amber-400/80 group-hover:bg-[#2F2418]'
          }`}
          title={isPlaying ? 'Pause' : 'Play Station'}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
          ) : isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-6 w-6">
              <span className="w-1 bg-black rounded-full animate-wave-1"></span>
              <span className="w-1 bg-black rounded-full animate-wave-2"></span>
              <span className="w-1 bg-black rounded-full animate-wave-3"></span>
              <span className="w-1 bg-black rounded-full animate-wave-4"></span>
            </div>
          ) : isCurrent ? (
            <Play className="w-5 h-5 fill-current ml-0.5" />
          ) : (
            <Play className="w-5 h-5 fill-amber-400 text-amber-400 ml-0.5 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Station Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="text-base sm:text-lg font-bold text-[#FAF7F0] tracking-tight truncate group-hover:text-amber-300 transition">
              {station.name}
            </h3>

            {station.frequency && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/35">
                {station.frequency}
              </span>
            )}

            {station.category && (
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                station.category === 'devotional'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                  : station.category === 'air'
                  ? 'bg-orange-500/15 text-orange-300 border-orange-400/35'
                  : 'bg-[#221B12] text-amber-200/80 border-amber-500/25'
              }`}>
                {station.category === 'community' 
                  ? 'Community' 
                  : station.category === 'air' 
                  ? 'AIR (Akashvani)' 
                  : station.category === 'devotional'
                  ? 'Devotional'
                  : 'Online'}
              </span>
            )}

            {isCurrent && isPlaying && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                LIVE
              </span>
            )}
          </div>
          
          {station.malayalamName && (
            <p className="text-xs sm:text-sm font-malayalam text-amber-200/80 truncate font-medium">
              {station.malayalamName}
            </p>
          )}

          {station.description && (
            <p className="text-xs text-neutral-400 line-clamp-1 mt-1 font-normal">
              {station.description}
            </p>
          )}

          {/* Tags & Location */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-[11px] text-amber-300/70 flex items-center gap-1 font-mono">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/60"></span>
              <span>{station.location || 'Kerala Live'}</span>
            </span>

            {station.tags?.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-1.5 py-0.2 rounded bg-[#241C13] border border-amber-500/20 text-amber-200/70 text-[9px] uppercase tracking-wider font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Quick Action Controls */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-amber-500/20 relative z-10">
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300/70 sm:hidden">
          <Wifi className="w-3 h-3 text-amber-400" />
          <span>{station.bitrate || '128k'}</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 font-mono text-[11px] text-amber-300/70 mr-2">
            <Wifi className="w-3 h-3 text-amber-400" />
            <span>{station.bitrate || '128k'}</span>
          </div>

          {/* Copy Stream Link */}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-xl text-amber-200/50 hover:text-amber-200 hover:bg-[#282016] border border-transparent hover:border-amber-500/30 transition"
            title={copied ? 'Copied stream link!' : 'Copy Stream URL'}
          >
            {copied ? <Check className="w-4 h-4 text-amber-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Favorite Button */}
          <button
            id={`fav-btn-${station.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(station.id);
            }}
            className={`p-2 rounded-xl transition border ${
              isFav
                ? 'text-rose-400 bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25'
                : 'text-amber-200/40 hover:text-amber-200 hover:bg-[#282016] border-transparent hover:border-amber-500/30'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
