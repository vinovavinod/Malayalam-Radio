import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Copy, 
  Check, 
  Radio as RadioIcon, 
  Wifi,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RadioStation } from '../types/radio';
import { useRadio } from '../context/RadioContext';

interface StationCardProps {
  station: RadioStation;
  onEdit?: (station: RadioStation) => void;
}

export const StationCard: React.FC<StationCardProps> = ({ station, onEdit }) => {
  const {
    currentStation,
    playbackStatus,
    playStation,
    togglePlayPause,
    favorites,
    toggleFavorite,
    deleteCustomStation
  } = useRadio();

  const [showMenu, setShowMenu] = useState(false);
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
      setShowMenu(false);
    }, 1500);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to remove "${station.name}"?`)) {
      deleteCustomStation(station.id);
    }
    setShowMenu(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) onEdit(station);
  };

  return (
    <div
      id={`station-card-${station.id}`}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isCurrent
          ? 'bg-[#141414] border-[#FF3D00] shadow-xl shadow-[#FF3D00]/10 ring-1 ring-[#FF3D00]/40'
          : 'bg-[#111111] hover:bg-[#161616] border-[#262626] hover:border-[#FF3D00]/50 hover:shadow-lg hover:shadow-black/50'
      }`}
    >
      {/* Background Ambient Glow for active station */}
      {isCurrent && (
        <div className="absolute -right-10 -top-10 w-28 h-28 bg-[#FF3D00]/10 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Row: Frequency Badge, Category, Favorite, Menu */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {station.frequency && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/30">
              {station.frequency}
            </span>
          )}
          {station.isCustom && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#FF3D00]" /> Custom
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {/* Favorite Toggle Button */}
          <button
            id={`fav-btn-${station.id}`}
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(station.id);
            }}
            className={`p-1.5 rounded-lg transition ${
              isFav
                ? 'text-[#FF3D00] bg-[#FF3D00]/15 hover:bg-[#FF3D00]/25'
                : 'text-[#666666] hover:text-[#CCCCCC] hover:bg-[#1A1A1A]'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-[#FF3D00] text-[#FF3D00]' : ''}`} />
          </button>

          {/* Options Menu for Custom / Links */}
          <div className="relative">
            <button
              id={`station-options-btn-${station.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(prev => !prev);
              }}
              className="p-1.5 text-[#666666] hover:text-[#CCCCCC] hover:bg-[#1A1A1A] rounded-lg transition"
              title="Station options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-8 w-44 bg-[#141414] border border-[#333333] rounded-lg shadow-2xl py-1.5 z-30 text-xs text-[#CCCCCC]"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#222222] hover:text-white transition text-left"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#FF3D00]" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Stream URL'}</span>
                </button>

                {station.isCustom && (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#222222] hover:text-[#FF3D00] transition text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#FF3D00]" />
                      <span>Edit Station</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#FF3D00]/20 text-[#FF3D00] transition text-left"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete Station</span>
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Row: Artwork Icon / Gradient & Station Info */}
      <div className="flex items-center gap-3.5 my-1 relative z-10">
        {/* Visualizer / Artwork Box */}
        <div className={`relative flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center shadow-md bg-[#1E1E1E] border border-[#333333] text-white font-bold transition-all group-hover:border-[#FF3D00]/60`}>
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-5 w-5">
              <span className="w-1 bg-[#FF3D00] rounded-full animate-wave-1"></span>
              <span className="w-1 bg-[#FF3D00] rounded-full animate-wave-2"></span>
              <span className="w-1 bg-[#FF3D00] rounded-full animate-wave-3"></span>
              <span className="w-1 bg-[#FF3D00] rounded-full animate-wave-4"></span>
            </div>
          ) : (
            <RadioIcon className="w-5 h-5 text-[#888888] group-hover:text-[#FF3D00] transition-colors" />
          )}

          {/* Quick Play overlay button on card */}
          <div className="absolute inset-0 bg-[#0A0A0A]/70 rounded-lg opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#FF3D00] border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-4 h-4 text-[#FF3D00] fill-[#FF3D00]" />
            ) : (
              <Play className="w-4 h-4 text-[#FF3D00] fill-[#FF3D00] ml-0.5" />
            )}
          </div>
        </div>

        {/* Station Text & Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#F0F0F0] tracking-tight truncate group-hover:text-[#FF3D00] transition">
            {station.name}
          </h3>
          
          {station.malayalamName && (
            <p className="text-xs font-malayalam text-[#AAAAAA] truncate mt-0.5 font-medium">
              {station.malayalamName}
            </p>
          )}

          <p className="text-[11px] text-[#666666] truncate mt-1 flex items-center gap-1.5 font-mono">
            <span className="inline-block w-1 h-1 rounded-full bg-[#444444]"></span>
            <span>{station.location || 'Kerala Live'}</span>
          </p>
        </div>
      </div>

      {/* Description Snippet */}
      {station.description && (
        <p className="text-xs text-[#777777] line-clamp-2 mt-2 leading-relaxed font-normal">
          {station.description}
        </p>
      )}

      {/* Bottom Footer: Tags, Bitrate & Status */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#222222] text-[11px] text-[#666666]">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          {station.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-[#181818] border border-[#2A2A2A] text-[#999999] text-[9px] uppercase tracking-wider font-mono">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px] text-[#777777]">
          <Wifi className="w-3 h-3 text-[#FF3D00]" />
          <span>{station.bitrate ? station.bitrate.replace('kbps', 'k') : '128k'}</span>
        </div>
      </div>
    </div>
  );
};
