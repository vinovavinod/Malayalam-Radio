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
  Tag,
  BookmarkPlus,
  Volume2,
  Activity
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
    toggleFavorite,
    presets,
    setPresetSlot
  } = useRadio();

  const [copied, setCopied] = useState(false);
  const [showPresetMenu, setShowPresetMenu] = useState(false);

  const isCurrent = currentStation?.id === station.id;
  const isPlaying = isCurrent && playbackStatus === 'playing';
  const isLoading = isCurrent && playbackStatus === 'loading';
  const isFav = favorites.includes(station.id);

  // Check if this station is in any preset slot
  const presetSlotIndex = presets.indexOf(station.id);
  const isPreset = presetSlotIndex !== -1;

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
      className={`group relative w-full flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-lg gap-3 sm:gap-4 ${
        isCurrent
          ? 'bg-gradient-to-r from-[#2B1F13] via-[#20170F] to-[#16100A] border-amber-400 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/50'
          : 'bg-[#140F0A] hover:bg-[#1C150E] border-amber-500/20 hover:border-amber-400/50 hover:shadow-black/70'
      }`}
    >
      {/* Active Station Digital Ambient Glow */}
      {isCurrent && (
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      )}

      {/* Main Left Section: Station Icon + Full Digital Details */}
      <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 w-full relative z-10">
        
        {/* Station Icon with Digital Live Ring */}
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
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight group-hover:text-amber-300 transition">
              {station.name}
            </h3>

            {/* Digital Frequency Badge */}
            {station.frequency && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/35">
                {station.frequency}
              </span>
            )}

            {/* Preset Indicator Tag */}
            {isPreset && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-amber-400 text-black shadow-sm">
                P{presetSlotIndex + 1}
              </span>
            )}

            {/* Category Badge */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
              station.category === 'devotional'
                ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                : station.category === 'air'
                ? 'bg-orange-500/15 text-orange-300 border-orange-400/35'
                : station.category === 'community'
                ? 'bg-amber-600/15 text-amber-200 border-amber-500/30'
                : 'bg-[#1C150E] text-amber-200/90 border-amber-500/25'
            }`}>
              {getCategoryIcon()}
              <span>{getCategoryLabel()}</span>
            </span>

            {/* Live Streaming On-Air Status */}
            {isCurrent && isPlaying ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ON AIR</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-amber-200/60 bg-[#1A120B] border border-amber-500/20">
                <Wifi className="w-2.5 h-2.5 text-amber-400" />
                <span>{station.bitrate || '128k'}</span>
              </span>
            )}
          </div>

          {/* Malayalam Station Name */}
          {station.malayalamName && (
            <p className="text-xs sm:text-sm font-malayalam text-amber-200/90 font-medium">
              {station.malayalamName}
            </p>
          )}

          {/* Description */}
          {station.description && (
            <p className="text-xs text-neutral-300/80 line-clamp-2 leading-relaxed font-normal pt-0.5">
              {station.description}
            </p>
          )}

          {/* Location & Digital Audio Format Tags */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
            <span className="text-[11px] text-amber-300/80 flex items-center gap-1 font-mono font-medium">
              <MapPin className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span>{station.location || 'Kerala Live'}</span>
            </span>

            {station.codec && (
              <span className="px-1.5 py-0.2 rounded bg-[#1F170E] border border-amber-500/20 text-amber-200/70 text-[9px] uppercase font-mono">
                {station.codec.toUpperCase()}
              </span>
            )}

            {station.tags?.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="px-1.5 py-0.2 rounded bg-[#1F170E] border border-amber-500/20 text-amber-200/70 text-[9px] uppercase tracking-wider font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Action Controls & Preset Assigning */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-amber-500/20 relative z-10 flex-shrink-0">
        
        {/* Preset Quick-Assign Popover Menu */}
        <div className="relative">
          <button
            id={`preset-menu-btn-${station.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowPresetMenu(!showPresetMenu);
            }}
            className={`p-2 sm:p-2.5 rounded-xl border transition ${
              isPreset
                ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                : 'bg-[#181109] hover:bg-[#261B0E] border-amber-500/20 text-amber-200/60 hover:text-white'
            }`}
            title="Assign to Digital Preset Memory (P1 - P10)"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>

          {showPresetMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 bottom-full mb-2 w-48 bg-[#16100A] border border-amber-500/40 rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95"
            >
              <div className="text-[10px] font-mono font-bold uppercase text-amber-300 mb-1.5 px-1 border-b border-amber-500/20 pb-1">
                Assign to Preset Slot:
              </div>
              <div className="grid grid-cols-5 gap-1">
                {Array.from({ length: 10 }).map((_, slotIdx) => (
                  <button
                    key={slotIdx}
                    id={`set-preset-p${slotIdx + 1}-${station.id}`}
                    onClick={() => {
                      setPresetSlot(slotIdx, station.id);
                      setShowPresetMenu(false);
                    }}
                    className={`py-1 rounded text-[10px] font-mono font-bold transition border ${
                      presets[slotIdx] === station.id
                        ? 'bg-amber-400 text-black border-amber-300 font-black'
                        : 'bg-[#1E1710] hover:bg-amber-500/20 text-amber-200 border-amber-500/25'
                    }`}
                  >
                    P{slotIdx + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copy Stream Link */}
        <button
          id={`copy-btn-${station.id}`}
          onClick={handleCopyLink}
          className="p-2 sm:p-2.5 rounded-xl text-amber-200/60 hover:text-white hover:bg-[#20160D] border border-amber-500/20 hover:border-amber-500/40 transition"
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
          className={`p-2 sm:p-2.5 rounded-xl transition border ${
            isFav
              ? 'text-rose-400 bg-rose-500/15 border-rose-500/30 hover:bg-rose-500/25'
              : 'text-amber-200/50 hover:text-white hover:bg-[#20160D] border-amber-500/20 hover:border-amber-500/40'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
        </button>

        {/* Digital Play / Pause Button */}
        <button
          id={`play-btn-${station.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition shadow-md ${
            isCurrent && isPlaying
              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border border-amber-300 shadow-amber-500/20 hover:brightness-110'
              : isCurrent && isLoading
              ? 'bg-[#251A10] text-amber-300 border border-amber-400/50'
              : 'bg-[#1D150E] text-amber-200 hover:text-black hover:bg-gradient-to-r hover:from-amber-400 hover:to-yellow-500 border border-amber-500/30 hover:border-amber-300'
          }`}
          title={isPlaying ? 'Pause Station' : 'Listen Now'}
        >
          {isLoading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              <span>Loading</span>
            </>
          ) : isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-black text-black" />
              <span>Playing</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              <span>Listen</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
