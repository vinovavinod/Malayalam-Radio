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
        return <TowerControl className="w-3 h-3 text-amber-700" />;
      case 'community':
        return <Users className="w-3 h-3 text-emerald-700" />;
      case 'devotional':
        return <Sparkles className="w-3 h-3 text-yellow-700" />;
      case 'online':
      default:
        return <Globe className="w-3 h-3 text-stone-700" />;
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
      className={`group relative w-full flex flex-col md:flex-row items-start md:items-center justify-between p-3.5 sm:p-5 rounded-2xl transition-all duration-300 cursor-pointer overflow-hidden gap-3 sm:gap-4 ${
        isCurrent
          ? 'station-tile-cream-active ring-1 ring-[#D4AF37]/50'
          : 'station-tile-cream'
      }`}
    >
      {/* Subtle Inset Luxury Top Sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none" />

      {/* Active Station Digital Ambient Glow */}
      {isCurrent && (
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
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
            <h3 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight group-hover:text-amber-900 transition-colors">
              {station.name}
            </h3>

            {/* Digital Frequency Badge */}
            {station.frequency && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-extrabold uppercase tracking-wider bg-[#F2E8D8] text-[#7A4513] border border-[#E3D3BE]">
                {station.frequency}
              </span>
            )}

            {/* Preset Indicator Tag */}
            {isPreset && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase bg-[#C27803] text-white shadow-xs">
                P{presetSlotIndex + 1}
              </span>
            )}

            {/* Category Badge */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1 ${
              station.category === 'devotional'
                ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                : station.category === 'air'
                ? 'bg-[#FFF2DE] text-[#9A3412] border-[#FCD39B]'
                : station.category === 'community'
                ? 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]'
                : 'bg-[#F3EDE2] text-[#6B573F] border-[#E3D7C5]'
            }`}>
              {getCategoryIcon()}
              <span>{getCategoryLabel()}</span>
            </span>

            {/* Live Streaming On-Air Status */}
            {isCurrent && isPlaying ? (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>ON AIR</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono text-stone-600 bg-[#EFE8DC] border border-[#DFD3C0]">
                <Wifi className="w-2.5 h-2.5 text-amber-700" />
                <span>{station.bitrate || '128k'}</span>
              </span>
            )}
          </div>

          {/* Malayalam Station Name */}
          {station.malayalamName && (
            <p className="text-xs sm:text-sm font-malayalam text-[#7A4513] font-medium">
              {station.malayalamName}
            </p>
          )}

          {/* Description */}
          {station.description && (
            <p className="text-xs text-[#5A4D3F] line-clamp-2 leading-relaxed font-normal pt-0.5">
              {station.description}
            </p>
          )}

          {/* Location & Digital Audio Format Tags */}
          <div className="flex items-center gap-2 pt-1 flex-wrap text-xs">
            <span className="text-[11px] text-[#78350F] flex items-center gap-1 font-mono font-medium">
              <MapPin className="w-3 h-3 text-amber-700 flex-shrink-0" />
              <span>{station.location || 'Kerala Live'}</span>
            </span>

            {station.codec && (
              <span className="px-1.5 py-0.2 rounded bg-[#EFE8DC] border border-[#DFD3C0] text-[#6A5A4A] text-[9px] uppercase font-mono font-semibold">
                {station.codec.toUpperCase()}
              </span>
            )}

            {station.tags?.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="px-1.5 py-0.2 rounded bg-[#EFE8DC] border border-[#DFD3C0] text-[#6A5A4A] text-[9px] uppercase tracking-wider font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Section: Action Controls & Preset Assigning */}
      <div className="flex items-center justify-between md:justify-end gap-2.5 w-full md:w-auto pt-2.5 md:pt-0 border-t md:border-t-0 border-[#E8DEC\-C] md:border-transparent relative z-10 flex-shrink-0">
        
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
                ? 'bg-[#F5E6CC] border-[#D8BE96] text-[#7A4513]'
                : 'bg-[#F2ECE0] hover:bg-[#E8DFC9] border-[#DFD1BD] text-[#5C4936] hover:text-stone-900'
            }`}
            title="Assign to Digital Preset Memory (P1 - P10)"
          >
            <BookmarkPlus className="w-4 h-4" />
          </button>

          {showPresetMenu && (
            <div 
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 bottom-full mb-2 w-48 bg-[#FFFCF7] border border-[#E5DAC7] rounded-xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95"
            >
              <div className="text-[10px] font-mono font-bold uppercase text-[#7A5A38] mb-1.5 px-1 border-b border-[#EFE5D4] pb-1">
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
                        ? 'bg-[#C27803] text-white border-[#A16207] font-black'
                        : 'bg-[#F5EDE0] hover:bg-[#EADBC6] text-[#5C4936] border-[#DFD1BD]'
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
          className="p-2 sm:p-2.5 rounded-xl text-[#5C4936] hover:text-stone-900 hover:bg-[#E8DFC9] border border-[#DFD1BD] transition"
          title={copied ? 'Copied stream URL!' : 'Copy Stream URL'}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
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
              ? 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100'
              : 'text-[#8C7A68] hover:text-stone-900 hover:bg-[#E8DFC9] border-[#DFD1BD]'
          }`}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Digital Play / Pause Button */}
        <button
          id={`play-btn-${station.id}`}
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick();
          }}
          className={`px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition shadow-xs ${
            isCurrent && isPlaying
              ? 'bg-gradient-to-r from-[#D97706] via-[#D4AF37] to-[#B45309] text-white border border-amber-300 shadow-md shadow-amber-900/20 hover:brightness-105 active:scale-95'
              : isCurrent && isLoading
              ? 'bg-[#F5E6CC] text-[#7A4513] border border-amber-300'
              : 'bg-[#EFE5D4] hover:bg-gradient-to-r hover:from-[#D97706] hover:to-[#D4AF37] hover:text-white text-[#4A3828] border border-[#DDCFBA] hover:border-amber-400 active:scale-95 transition-all'
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
              <Pause className="w-3.5 h-3.5 fill-white text-white" />
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
