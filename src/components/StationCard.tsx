import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Copy, 
  Check, 
  MapPin,
  Wifi,
  Radio as RadioIcon,
  Sparkles,
  TowerControl,
  Users,
  Globe,
  Tag
} from 'lucide-react';
import { RadioStation } from '../types/radio';
import { useRadio } from '../context/RadioContext';
import { StationIcon } from './StationIcon';

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

  const getCategoryIcon = () => {
    switch (station.category) {
      case 'air':
        return <TowerControl className="w-3 h-3 text-orange-400" />;
      case 'community':
        return <Users className="w-3 h-3 text-amber-400" />;
      case 'devotional':
        return <Sparkles className="w-3 h-3 text-yellow-400" />;
      case 'online':
      default:
        return <Globe className="w-3 h-3 text-emerald-400" />;
    }
  };

  const getCategoryLabel = () => {
    switch (station.category) {
      case 'air':
        return 'AIR (Akashvani)';
      case 'community':
        return 'Community FM';
      case 'devotional':
        return 'Devotional';
      case 'online':
      default:
        return 'Online Radio';
    }
  };

  return (
    <div
      id={`station-card-${station.id}`}
      onClick={handleCardClick}
      className={`group relative w-full flex flex-col md:flex-row items-start md:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-lg gap-4 ${
        isCurrent
          ? 'bg-gradient-to-r from-[#2A1F13] via-[#22180F] to-[#1A120B] border-amber-400 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/50'
          : 'bg-[#18120C] hover:bg-[#201810] border-amber-500/25 hover:border-amber-400/60 hover:shadow-black/70'
      }`}
    >
      {/* Active Station Glow Effect */}
      {isCurrent && (
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Main Left Section: Station Icon + Full Details */}
      <div className="flex items-start sm:items-center gap-3.5 sm:gap-4.5 flex-1 min-w-0 w-full relative z-10">
        
        {/* Station Icon Emblem Box */}
        <div className="relative flex-shrink-0">
          <StationIcon
            station={station}
            size="md"
            isPlaying={isPlaying}
            className="group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Station Details Content */}
        <div className="flex-1 min-w-0 space-y-1">
          
          {/* Top Title & Badges Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-base sm:text-lg font-bold text-[#FAF7F0] tracking-tight group-hover:text-amber-300 transition">
              {station.name}
            </h3>

            {/* Frequency Badge */}
            {station.frequency && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/35">
                {station.frequency}
              </span>
            )}

            {/* Category Badge with Icon */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
              station.category === 'devotional'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : station.category === 'air'
                ? 'bg-orange-500/15 text-orange-300 border-orange-400/35'
                : station.category === 'community'
                ? 'bg-amber-600/15 text-amber-200 border-amber-500/30'
                : 'bg-[#221B12] text-amber-200/90 border-amber-500/25'
            }`}>
              {getCategoryIcon()}
              <span>{getCategoryLabel()}</span>
            </span>

            {/* Live Streaming Badge */}
            {isCurrent && isPlaying ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ON AIR</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-200/60 bg-[#22180F] border border-amber-500/20">
                <Wifi className="w-2.5 h-2.5 text-amber-400" />
                <span>{station.bitrate || '128 kbps'}</span>
              </span>
            )}
          </div>

          {/* Malayalam Station Name */}
          {station.malayalamName && (
            <p className="text-xs sm:text-sm font-malayalam text-amber-200/90 font-medium">
              {station.malayalamName}
            </p>
          )}

          {/* Detailed Description */}
          {station.description && (
            <p className="text-xs text-neutral-300/85 line-clamp-2 leading-relaxed font-normal pt-0.5">
              {station.description}
            </p>
          )}

          {/* Location & Tag Chips */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
            {/* Location */}
            <span className="text-[11px] text-amber-300/80 flex items-center gap-1 font-mono font-medium">
              <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span>{station.location || 'Kerala Live'}</span>
            </span>

            {/* Codec */}
            {station.codec && (
              <span className="px-1.5 py-0.2 rounded bg-[#241B12] border border-amber-500/20 text-amber-200/70 text-[9px] uppercase font-mono">
                {station.codec.toUpperCase()}
              </span>
            )}

            {/* Tags */}
            {station.tags?.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="px-1.5 py-0.2 rounded bg-[#241B12] border border-amber-500/20 text-amber-200/70 text-[9px] uppercase tracking-wider font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Action Controls */}
      <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-amber-500/20 relative z-10 flex-shrink-0">
        
        {/* Mobile Bitrate indicator */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-amber-300/80 md:hidden">
          <Wifi className="w-3 h-3 text-amber-400" />
          <span>{station.bitrate || '128k'}</span>
        </div>

        <div className="flex items-center gap-2">
          
          {/* Copy Stream Link */}
          <button
            id={`copy-btn-${station.id}`}
            onClick={handleCopyLink}
            className="p-2.5 rounded-xl text-amber-200/60 hover:text-amber-200 hover:bg-[#282016] border border-amber-500/20 hover:border-amber-500/40 transition"
            title={copied ? 'Copied stream URL!' : 'Copy Stream URL'}
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Favorite Bookmark Button */}
          <button
            id={`fav-btn-${station.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(station.id);
            }}
            className={`p-2.5 rounded-xl transition border ${
              isFav
                ? 'text-rose-400 bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25'
                : 'text-amber-200/50 hover:text-amber-200 hover:bg-[#282016] border-amber-500/20 hover:border-amber-500/40'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>

          {/* Prominent Play / Pause Action Button */}
          <button
            id={`play-btn-${station.id}`}
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-md ${
              isCurrent && isPlaying
                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border border-amber-300 hover:from-amber-300 hover:to-yellow-400 shadow-amber-500/20'
                : isCurrent && isLoading
                ? 'bg-[#2A2016] text-amber-300 border border-amber-400/50'
                : 'bg-[#261E14] text-amber-200 hover:text-black hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 border border-amber-500/30 hover:border-amber-300'
            }`}
            title={isPlaying ? 'Pause Station' : 'Listen Now'}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Loading...</span>
              </>
            ) : isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black text-black" />
                <span>Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Listen</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

