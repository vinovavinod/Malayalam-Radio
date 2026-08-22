import React from 'react';
import { 
  Radio, 
  TowerControl, 
  Users, 
  Music, 
  Sparkles, 
  Globe, 
  Heart, 
  Headphones, 
  Mic2, 
  Flame, 
  Sun, 
  Disc3, 
  Church, 
  Cross,
  Compass,
  Volume2,
  Tv,
  Waves,
  Feather,
  Flower2,
  TreePine,
  ShieldAlert,
  GraduationCap
} from 'lucide-react';
import { RadioStation } from '../types/radio';

interface StationIconProps {
  station: RadioStation;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isPlaying?: boolean;
  className?: string;
}

export const StationIcon: React.FC<StationIconProps> = ({
  station,
  size = 'md',
  isPlaying = false,
  className = ''
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  React.useEffect(() => {
    setImgError(false);
    setImgLoaded(false);
  }, [station.logo, station.id]);

  const sizeClasses = {
    sm: 'w-10 h-10 min-w-10 rounded-xl text-base',
    md: 'w-14 h-14 min-w-14 sm:w-16 sm:h-16 sm:min-w-16 rounded-2xl text-xl',
    lg: 'w-20 h-20 min-w-20 rounded-2xl text-2xl',
    xl: 'w-28 h-28 min-w-28 rounded-3xl text-3xl'
  }[size];

  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-7 h-7 sm:w-8 sm:h-8',
    lg: 'w-10 h-10',
    xl: 'w-14 h-14'
  }[size];

  // If station has a valid image logo and no error loading
  if (station.logo && !imgError) {
    return (
      <div 
        className={`relative overflow-hidden flex items-center justify-center bg-[#17120B] border-2 ${
          isPlaying ? 'border-amber-400 shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/30' : 'border-amber-500/30'
        } shadow-md ${sizeClasses} ${className}`}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-[#251D14] animate-pulse flex items-center justify-center">
            <Radio className="w-5 h-5 text-amber-500/40 animate-pulse" />
          </div>
        )}
        <img
          src={station.logo}
          alt={station.name}
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {isPlaying && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-center pb-1">
            <div className="flex items-end gap-0.5 h-4 bg-black/60 px-1.5 py-0.5 rounded-full border border-amber-400/40 shadow-sm">
              <span className="w-1 bg-amber-400 rounded-full animate-wave-1 h-3"></span>
              <span className="w-1 bg-yellow-300 rounded-full animate-wave-2 h-4"></span>
              <span className="w-1 bg-amber-400 rounded-full animate-wave-3 h-2.5"></span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Get specific custom emblem icon and gradient based on station ID or keywords
  const getStationEmblem = () => {
    const id = station.id?.toLowerCase() || '';
    const name = station.name?.toLowerCase() || '';

    // Devotional Stations
    if (id === 'malayalam-bhakthi' || name.includes('bhakthi') || name.includes('ayyappa')) {
      return {
        bg: 'from-amber-600 via-orange-600 to-yellow-600',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Sparkles className={iconSizes} />,
        badge: 'ഭക്തി',
        monogram: '🕉️'
      };
    }
    if (id === 'psalms-radio' || name.includes('psalm')) {
      return {
        bg: 'from-indigo-700 via-purple-700 to-amber-700',
        borderColor: 'border-indigo-400/50',
        textColor: 'text-indigo-100',
        icon: <Church className={iconSizes} />,
        badge: 'Psalms',
        monogram: '✞'
      };
    }
    if (id === 'dvn-radio' || name.includes('dvn')) {
      return {
        bg: 'from-cyan-800 via-teal-700 to-amber-700',
        borderColor: 'border-cyan-400/50',
        textColor: 'text-cyan-100',
        icon: <Feather className={iconSizes} />,
        badge: 'DVN',
        monogram: '✞'
      };
    }
    if (id === 'jesus-radio' || name.includes('jesus')) {
      return {
        bg: 'from-rose-700 via-red-600 to-amber-600',
        borderColor: 'border-rose-400/50',
        textColor: 'text-rose-100',
        icon: <Sparkles className={iconSizes} />,
        badge: 'Jesus',
        monogram: '✝'
      };
    }

    // AIR Akashvani Stations
    if (id === 'devikulam-fm' || name.includes('devikulam')) {
      return {
        bg: 'from-emerald-800 via-teal-700 to-green-900',
        borderColor: 'border-emerald-400/50',
        textColor: 'text-emerald-100',
        icon: <TreePine className={iconSizes} />,
        badge: '101.4',
        monogram: 'AIR'
      };
    }
    if (id === 'air-alappuzha' || name.includes('alappuzha')) {
      return {
        bg: 'from-teal-800 via-cyan-800 to-blue-900',
        borderColor: 'border-teal-400/50',
        textColor: 'text-teal-100',
        icon: <Waves className={iconSizes} />,
        badge: '576 AM',
        monogram: 'AIR'
      };
    }
    if (id === 'air-kozhikode' || name.includes('kozhikode')) {
      return {
        bg: 'from-amber-700 via-orange-700 to-red-800',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Music className={iconSizes} />,
        badge: 'Real FM',
        monogram: 'AIR'
      };
    }
    if (id === 'air-kochi-rainbow' || name.includes('rainbow')) {
      return {
        bg: 'from-rose-700 via-amber-600 to-indigo-700',
        borderColor: 'border-rose-400/50',
        textColor: 'text-rose-100',
        icon: <Radio className={iconSizes} />,
        badge: '107.5',
        monogram: 'AIR'
      };
    }
    if (id === 'air-ananthapuri' || name.includes('ananthapuri')) {
      return {
        bg: 'from-yellow-700 via-amber-600 to-orange-800',
        borderColor: 'border-yellow-400/50',
        textColor: 'text-yellow-100',
        icon: <TowerControl className={iconSizes} />,
        badge: '101.9',
        monogram: 'AIR'
      };
    }
    if (id === 'air-manjeri' || name.includes('manjeri')) {
      return {
        bg: 'from-green-800 via-emerald-700 to-teal-900',
        borderColor: 'border-green-400/50',
        textColor: 'text-green-100',
        icon: <TowerControl className={iconSizes} />,
        badge: '100.2',
        monogram: 'AIR'
      };
    }

    // Community Radios
    if (id === 'air-kochi' || id === 'radio-kochi') {
      return {
        bg: 'from-amber-600 via-orange-600 to-red-700',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Mic2 className={iconSizes} />,
        badge: '90 FM',
        monogram: 'KCH'
      };
    }
    if (id === 'sargakshetra-896' || name.includes('sargakshetra')) {
      return {
        bg: 'from-orange-700 via-amber-600 to-yellow-700',
        borderColor: 'border-orange-400/50',
        textColor: 'text-orange-100',
        icon: <Users className={iconSizes} />,
        badge: '89.6',
        monogram: 'SK'
      };
    }
    if (id === 'radio-media-village' || name.includes('media village')) {
      return {
        bg: 'from-amber-600 via-yellow-600 to-orange-700',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Tv className={iconSizes} />,
        badge: '90.8',
        monogram: 'RMV'
      };
    }
    if (id === 'radio-benziger-1078' || name.includes('benziger')) {
      return {
        bg: 'from-rose-700 via-pink-700 to-red-800',
        borderColor: 'border-rose-400/50',
        textColor: 'text-rose-100',
        icon: <Heart className={iconSizes} />,
        badge: '107.8',
        monogram: 'RB'
      };
    }
    if (id === 'ashrayam-fm-90' || name.includes('ashrayam')) {
      return {
        bg: 'from-emerald-700 via-teal-700 to-cyan-800',
        borderColor: 'border-emerald-400/50',
        textColor: 'text-emerald-100',
        icon: <Feather className={iconSizes} />,
        badge: '90 FM',
        monogram: 'ASH'
      };
    }
    if (id === 'radio-mattoli' || name.includes('mattoli')) {
      return {
        bg: 'from-teal-800 via-emerald-700 to-green-900',
        borderColor: 'border-teal-400/50',
        textColor: 'text-teal-100',
        icon: <TreePine className={iconSizes} />,
        badge: '90.4',
        monogram: 'RMW'
      };
    }
    if (id === 'ahalia-fm' || name.includes('ahalia')) {
      return {
        bg: 'from-orange-600 via-amber-600 to-yellow-700',
        borderColor: 'border-orange-400/50',
        textColor: 'text-orange-100',
        icon: <GraduationCap className={iconSizes} />,
        badge: '90.4',
        monogram: 'AFM'
      };
    }
    if (id === 'ente-radio' || name.includes('ente radio')) {
      return {
        bg: 'from-red-700 via-orange-700 to-amber-700',
        borderColor: 'border-red-400/50',
        textColor: 'text-red-100',
        icon: <Radio className={iconSizes} />,
        badge: '91.2',
        monogram: 'ER'
      };
    }
    if (id === 'my-radio-90' || name.includes('my radio')) {
      return {
        bg: 'from-rose-600 via-orange-600 to-amber-600',
        borderColor: 'border-rose-400/50',
        textColor: 'text-rose-100',
        icon: <Headphones className={iconSizes} />,
        badge: '90 FM',
        monogram: 'MR'
      };
    }

    // Online Stations
    if (id === 'kerala-sangeetham' || name.includes('sangeetham')) {
      return {
        bg: 'from-amber-500 via-yellow-500 to-orange-600',
        borderColor: 'border-amber-300/60',
        textColor: 'text-amber-950',
        icon: <Music className={iconSizes} />,
        badge: 'സംഗീതം',
        monogram: 'KS'
      };
    }
    if (id === 'radio-mango' || name.includes('mango')) {
      return {
        bg: 'from-yellow-500 via-amber-500 to-orange-600',
        borderColor: 'border-yellow-400/60',
        textColor: 'text-yellow-950',
        icon: <Sun className={iconSizes} />,
        badge: '91.9',
        monogram: 'RM'
      };
    }
    if (id === 'club-fm-kerala' || name.includes('club fm')) {
      return {
        bg: 'from-red-600 via-rose-600 to-yellow-600',
        borderColor: 'border-red-400/60',
        textColor: 'text-white',
        icon: <Flame className={iconSizes} />,
        badge: 'Club FM',
        monogram: 'CFM'
      };
    }
    if (id === 'radio4u' || name.includes('radio4u')) {
      return {
        bg: 'from-orange-600 via-amber-600 to-red-600',
        borderColor: 'border-orange-400/50',
        textColor: 'text-white',
        icon: <Headphones className={iconSizes} />,
        badge: 'HD 4U',
        monogram: '4U'
      };
    }
    if (id === 'radio-palakkad' || name.includes('palakkad')) {
      return {
        bg: 'from-amber-700 via-orange-700 to-yellow-800',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Radio className={iconSizes} />,
        badge: 'Palakkad',
        monogram: 'RPD'
      };
    }
    if (id === 'radio-malabar' || name.includes('malabar')) {
      return {
        bg: 'from-teal-800 via-emerald-700 to-amber-700',
        borderColor: 'border-teal-400/50',
        textColor: 'text-teal-100',
        icon: <Music className={iconSizes} />,
        badge: 'Malabar',
        monogram: 'RMB'
      };
    }
    if (id === 'radio-digital-malayali' || name.includes('digital malayali') || name.includes('pravasi')) {
      return {
        bg: 'from-cyan-800 via-blue-700 to-amber-600',
        borderColor: 'border-cyan-400/50',
        textColor: 'text-cyan-100',
        icon: <Globe className={iconSizes} />,
        badge: 'പ്രവാസി',
        monogram: 'GULF'
      };
    }
    if (id === 'radio-malayalam' || name.includes('evergreen')) {
      return {
        bg: 'from-amber-800 via-yellow-700 to-orange-900',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Disc3 className={iconSizes} />,
        badge: 'Classic',
        monogram: 'OLD'
      };
    }
    if (id === 'radio-sunflower' || name.includes('sunflower') || name.includes('suno')) {
      return {
        bg: 'from-yellow-500 via-amber-500 to-orange-500',
        borderColor: 'border-yellow-400/60',
        textColor: 'text-yellow-950',
        icon: <Flower2 className={iconSizes} />,
        badge: 'Melody',
        monogram: 'SUN'
      };
    }
    if (id === 'kancheeravam-radio' || name.includes('kancheeravam')) {
      return {
        bg: 'from-amber-700 via-red-700 to-yellow-800',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Disc3 className={iconSizes} />,
        badge: '90s Hits',
        monogram: 'KCR'
      };
    }

    // Default Category Fallbacks
    if (station.category === 'air') {
      return {
        bg: 'from-amber-700 via-orange-800 to-emerald-900',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <TowerControl className={iconSizes} />,
        badge: 'AIR',
        monogram: 'AIR'
      };
    }
    if (station.category === 'community') {
      return {
        bg: 'from-orange-700 via-amber-700 to-yellow-800',
        borderColor: 'border-orange-400/50',
        textColor: 'text-orange-100',
        icon: <Users className={iconSizes} />,
        badge: 'Community',
        monogram: 'FM'
      };
    }
    if (station.category === 'devotional') {
      return {
        bg: 'from-amber-600 via-orange-600 to-yellow-600',
        borderColor: 'border-amber-400/50',
        textColor: 'text-amber-100',
        icon: <Sparkles className={iconSizes} />,
        badge: 'ഭക്തി',
        monogram: 'DIV'
      };
    }

    return {
      bg: 'from-amber-600 via-orange-700 to-yellow-800',
      borderColor: 'border-amber-400/40',
      textColor: 'text-amber-100',
      icon: <Radio className={iconSizes} />,
      badge: 'Live',
      monogram: station.name.slice(0, 2).toUpperCase()
    };
  };

  const emblem = getStationEmblem();

  return (
    <div
      className={`relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br ${emblem.bg} ${emblem.textColor} border ${emblem.borderColor} shadow-lg shadow-black/60 flex-shrink-0 transition-transform ${sizeClasses} ${className}`}
    >
      {/* Subtle Pattern Grid / Radiant Overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-brightness-105 pointer-events-none" />
      <div className="absolute -top-3 -right-3 w-10 h-10 bg-white/15 rounded-full blur-sm pointer-events-none" />

      {/* Main Icon */}
      <div className="relative z-10 flex items-center justify-center transition-transform group-hover:scale-110">
        {emblem.icon}
      </div>

      {/* Tiny Badge Monogram at bottom for extra craft */}
      {size !== 'sm' && (
        <span className="relative z-10 text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase opacity-85 px-1 rounded bg-black/30 backdrop-blur-xs mt-0.5 max-w-[90%] truncate">
          {emblem.badge}
        </span>
      )}

      {/* Playing Audio Equalizer Overlay */}
      {isPlaying && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center z-20">
          <div className="flex items-end gap-0.5 h-6">
            <span className="w-1 bg-amber-300 rounded-full animate-wave-1"></span>
            <span className="w-1 bg-amber-300 rounded-full animate-wave-2"></span>
            <span className="w-1 bg-amber-300 rounded-full animate-wave-3"></span>
            <span className="w-1 bg-amber-300 rounded-full animate-wave-4"></span>
          </div>
        </div>
      )}
    </div>
  );
};
