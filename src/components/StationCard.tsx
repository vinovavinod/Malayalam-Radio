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
  Sparkles
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

  const isOnamSpecial = station.category === 'onam-special' || station.tags?.includes('Onam');

  return (
    <div
      id={`station-card-${station.id}`}
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden shadow-md ${
        isCurrent
          ? 'bg-gradient-to-b from-[#221B13] to-[#1A140E] border-amber-400 shadow-xl shadow-amber-500/15 ring-1 ring-amber-400/50'
          : 'bg-[#18130D] hover:bg-[#201911] border-amber-500/25 hover:border-amber-400/60 hover:shadow-lg hover:shadow-black/60'
      }`}
    >
      {/* Background Ambient Glow for active station */}
      {isCurrent && (
        <div className="absolute -right-10 -top-10 w-28 h-28 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
      )}

      {/* Top Row: Frequency Badge, Category, Favorite, Menu */}
      <div className="flex items-center justify-between gap-2 mb-3 relative z-10">
        <div className="flex items-center gap-1.5 flex-wrap">
          {station.frequency && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-400/35">
              {station.frequency}
            </span>
          )}
          {isOnamSpecial && (
            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-black border border-amber-300 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-2.5 h-2.5 text-black" /> Onam
            </span>
          )}
          {station.isCustom && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" /> Custom
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
                ? 'text-rose-400 bg-rose-500/15 hover:bg-rose-500/25'
                : 'text-amber-200/40 hover:text-amber-200 hover:bg-[#282016]'
            }`}
            title={isFav ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400 text-rose-400' : ''}`} />
          </button>

          {/* Options Menu for Custom / Links */}
          <div className="relative">
            <button
              id={`station-options-btn-${station.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(prev => !prev);
              }}
              className="p-1.5 text-amber-200/50 hover:text-amber-200 hover:bg-[#282016] rounded-lg transition"
              title="Station options"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {showMenu && (
              <div 
                className="absolute right-0 top-8 w-44 bg-[#1C150E] border border-amber-500/40 rounded-xl shadow-2xl py-1.5 z-30 text-xs text-amber-100/90"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2016] hover:text-amber-300 transition text-left"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-amber-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Stream URL'}</span>
                </button>

                {station.isCustom && (
                  <>
                    <button
                      onClick={handleEditClick}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#2A2016] hover:text-amber-300 transition text-left"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Station</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full flex items-center gap-2 px-3 py-2 hover:bg-rose-500/20 text-rose-400 transition text-left"
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

      {/* Middle Row: Artwork Icon / Visualizer & Station Info */}
      <div className="flex items-center gap-3.5 my-1 relative z-10">
        {/* Visualizer / Artwork Box */}
        <div className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-[#241C13] border border-amber-500/30 text-amber-300 font-bold transition-all group-hover:border-amber-400`}>
          {isPlaying ? (
            <div className="flex items-end justify-center gap-0.5 h-5 w-5">
              <span className="w-1 bg-amber-400 rounded-full animate-wave-1"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-wave-2"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-wave-3"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-wave-4"></span>
            </div>
          ) : (
            <RadioIcon className="w-5 h-5 text-amber-400/60 group-hover:text-amber-300 transition-colors" />
          )}

          {/* Quick Play overlay button on card */}
          <div className="absolute inset-0 bg-[#120E0A]/75 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            ) : isPlaying ? (
              <Pause className="w-4 h-4 text-amber-300 fill-amber-300" />
            ) : (
              <Play className="w-4 h-4 text-amber-300 fill-amber-300 ml-0.5" />
            )}
          </div>
        </div>

        {/* Station Text & Details */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-[#FAF7F0] tracking-tight truncate group-hover:text-amber-300 transition">
            {station.name}
          </h3>
          
          {station.malayalamName && (
            <p className="text-xs font-malayalam text-amber-200/80 truncate mt-0.5 font-medium">
              {station.malayalamName}
            </p>
          )}

          <p className="text-[11px] text-amber-300/60 truncate mt-1 flex items-center gap-1.5 font-mono">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500/50"></span>
            <span>{station.location || 'Kerala Live'}</span>
          </p>
        </div>
      </div>

      {/* Description Snippet */}
      {station.description && (
        <p className="text-xs text-neutral-400 line-clamp-2 mt-2 leading-relaxed font-normal">
          {station.description}
        </p>
      )}

      {/* Bottom Footer: Tags, Bitrate & Status */}
      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-amber-500/20 text-[11px] text-amber-300/60">
        <div className="flex items-center gap-1.5 truncate max-w-[70%]">
          {station.tags?.slice(0, 2).map((tag, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-[#241C13] border border-amber-500/25 text-amber-200/80 text-[9px] uppercase tracking-wider font-mono">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 font-mono text-[10px] text-amber-300/80">
          <Wifi className="w-3 h-3 text-amber-400" />
          <span>{station.bitrate ? station.bitrate.replace('kbps', 'k') : '128k'}</span>
        </div>
      </div>
    </div>
  );
};
