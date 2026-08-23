import React, { useState } from 'react';
import { 
  Radio, 
  Heart, 
  Sparkles, 
  SlidersHorizontal,
  RotateCcw,
  Users,
  TowerControl,
  Globe,
  ListMusic,
  AlertCircle,
  Mail,
  Info,
  BookmarkPlus,
  Sliders
} from 'lucide-react';
import { RadioProvider, useRadio } from './context/RadioContext';
import { Header } from './components/Header';
import { StationCard } from './components/StationCard';
import { DigitalRadioConsole } from './components/DigitalRadioConsole';
import { DigitalTunerSynthesizer } from './components/DigitalTunerSynthesizer';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { EqualizerModal } from './components/EqualizerModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { VisualizerModal } from './components/VisualizerModal';
import { RecordingsModal } from './components/RecordingsModal';
import { OnlineDirectoryModal } from './components/OnlineDirectoryModal';
import { ContactModal } from './components/ContactModal';
import { RadioCategory } from './types/radio';

function RadioAppContent() {
  const {
    filteredStations,
    allStations,
    activeCategory,
    setActiveCategory,
    searchQuery,
    setSearchQuery,
    currentStation,
    favorites,
    onamTheme
  } = useRadio();

  const [viewMode, setViewMode] = useState<'grid' | 'tuner'>('grid');
  
  // Modals state
  const [isEqModalOpen, setIsEqModalOpen] = useState(false);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);
  const [isVisualizerModalOpen, setIsVisualizerModalOpen] = useState(false);
  const [isRecordingsModalOpen, setIsRecordingsModalOpen] = useState(false);
  const [isOnlineSearchModalOpen, setIsOnlineSearchModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Category counts
  const categoryCounts = React.useMemo(() => {
    return {
      all: allStations.length,
      community: allStations.filter(s => s.category === 'community').length,
      air: allStations.filter(s => s.category === 'air').length,
      online: allStations.filter(s => s.category === 'online').length,
      devotional: allStations.filter(s => s.category === 'devotional').length,
      favorites: favorites.length
    };
  }, [allStations, favorites]);

  const categoriesList: { id: RadioCategory; label: string; malayalam: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Channels', malayalam: 'എല്ലാം', icon: <ListMusic className="w-3.5 h-3.5" /> },
    { id: 'community', label: 'Community FM', malayalam: 'കമ്മ്യൂണിറ്റി', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'air', label: 'AIR Akashvani', malayalam: 'ആകാശവാണി', icon: <TowerControl className="w-3.5 h-3.5" /> },
    { id: 'online', label: 'Online & Gulf', malayalam: 'ഓൺലൈൻ', icon: <Globe className="w-3.5 h-3.5" /> },
    { id: 'devotional', label: 'Devotional', malayalam: 'ഭക്തിഗാനങ്ങൾ', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'favorites', label: 'Favorites', malayalam: 'ഇഷ്ടപ്പെട്ടവ', icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const themeClass = onamTheme === 'kasavu' 
    ? 'theme-kasavu bg-[#0E0D0B]' 
    : onamTheme === 'temple' 
    ? 'theme-temple bg-[#120808]' 
    : 'theme-ponnonam bg-[#0C0A08]';

  return (
    <div className={`min-h-screen ${themeClass} text-[#FAF7F0] flex flex-col pb-36 transition-colors duration-300 selection:bg-amber-500 selection:text-black`}>
      {/* Precision Digital Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-gradient-to-b from-amber-500/10 via-yellow-600/5 to-transparent blur-3xl" />
        <div className="absolute top-1/3 -right-24 w-80 h-80 bg-orange-600/5 blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 -left-24 w-80 h-80 bg-amber-500/5 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <Header
        onOpenEqModal={() => setIsEqModalOpen(true)}
        onOpenSleepModal={() => setIsSleepModalOpen(true)}
        onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
        onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
        onOpenOnlineSearchModal={() => setIsOnlineSearchModalOpen(true)}
        onOpenContactModal={() => setIsContactModalOpen(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      <main className="max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-5 flex-1 flex flex-col relative z-10">
        
        {/* MASTER DIGITAL RADIO RECEIVER CONSOLE */}
        <DigitalRadioConsole
          onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
          onOpenEqModal={() => setIsEqModalOpen(true)}
          onOpenSleepModal={() => setIsSleepModalOpen(true)}
          onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
        />

        {/* View Mode Switcher: Digital Synthesizer vs Categorized Digital Deck */}
        {viewMode === 'tuner' ? (
          <div className="py-2">
            <DigitalTunerSynthesizer />
          </div>
        ) : (
          /* View Mode: Digital Station Channels Deck */
          <div className="flex-1">
            {/* Category Navigation Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1 w-full">
                  {categoriesList.map(cat => {
                    const isActive = activeCategory === cat.id;
                    const count = categoryCounts[cat.id as keyof typeof categoryCounts] ?? 0;

                    return (
                      <button
                        key={cat.id}
                        id={`category-tab-${cat.id}`}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex-shrink-0 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 sm:gap-2 border ${
                          isActive
                            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 text-black border-amber-300 font-extrabold shadow-md shadow-amber-500/25 scale-[1.02]'
                            : 'bg-[#140F0A] text-amber-100/75 hover:text-white border-amber-500/20 hover:border-amber-400/50 hover:bg-[#1E1710]'
                        }`}
                      >
                        <span className={isActive ? 'text-black' : cat.id === 'favorites' ? 'text-rose-400' : 'text-amber-400'}>
                          {cat.icon}
                        </span>
                        <span className="whitespace-nowrap">{cat.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                            isActive
                              ? 'bg-black text-amber-300'
                              : 'bg-[#22180F] text-amber-300/80'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="flex-shrink-0 text-xs text-amber-400 hover:text-amber-200 flex items-center gap-1 font-bold pl-2"
                  >
                    <RotateCcw className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* AIR (Akashvani) Notice Banner */}
            {activeCategory === 'air' && (
              <div className="mb-4 p-3.5 sm:p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-[#20140A]/80 to-amber-950/60 border border-amber-500/40 text-amber-200/90 text-xs shadow-md">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] sm:text-xs">
                        Akashvani (AIR) Stream Link Notice
                      </span>
                      <button
                        onClick={() => setIsContactModalOpen(true)}
                        className="text-[10px] text-amber-300 hover:text-white font-bold underline flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" /> Report Link / Contact Us
                      </button>
                    </div>
                    <p className="mt-1 text-[11px] sm:text-xs text-amber-100/80 leading-relaxed">
                      Notice: All India Radio (AIR) streams are periodically rotated by Prasar Bharati CDN. We maintain verified live endpoints and backup relays for seamless listening.
                    </p>
                    <p className="mt-1 text-[11px] text-amber-300/70 font-malayalam">
                      ആകാശവാണി സ്ട്രീമിംഗ് ലിങ്കുകൾ അപ്‌ഡേറ്റ് ചെയ്യപ്പെടുന്നതിനാൽ ചില സ്റ്റേഷനുകൾ താൽക്കാലികമായി മാറിയേക്കാം. പുതിയ ലിങ്കുകൾ ശ്രദ്ധയിൽപ്പെട്ടാൽ ദയവായി അറിയിക്കുക.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Channels List */}
            {filteredStations.length === 0 ? (
              <div className="py-16 text-center text-neutral-400 space-y-4 max-w-md mx-auto">
                <Radio className="w-12 h-12 text-amber-500/40 mx-auto stroke-1" />
                <div>
                  <h3 className="text-base font-bold text-amber-100">No stations found</h3>
                  <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                    {searchQuery 
                      ? `No stations found for "${searchQuery}". Try searching by station name, frequency, or city.`
                      : activeCategory === 'favorites'
                      ? 'No favorite stations saved yet. Click the heart icon on any station to pin it to your favorites.'
                      : 'No radio stations currently available in this category.'}
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveCategory('all');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#1E1710] hover:bg-[#2A2016] border border-amber-500/30 text-amber-200 hover:text-white text-xs font-semibold uppercase tracking-wider transition"
                  >
                    View All Stations
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredStations.map(station => (
                  <StationCard
                    key={station.id}
                    station={station}
                  />
                ))}
              </div>
            )}

            {/* Quick Footer Contact Bar */}
            <div className="mt-8 pt-4 pb-2 border-t border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-amber-200/60">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400/80"></span>
                <span>Kerala Radio • Premium Digital Broadcast Receiver</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsContactModalOpen(true)}
                  className="hover:text-amber-200 text-amber-300/80 font-medium flex items-center gap-1 transition"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Contact: puthenpura9997@gmail.com</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Sticky Bottom Digital Receiver Audio Player Bar */}
      <AudioPlayerBar
        onOpenVisualizerModal={() => setIsVisualizerModalOpen(true)}
        onOpenEqModal={() => setIsEqModalOpen(true)}
        onOpenSleepModal={() => setIsSleepModalOpen(true)}
        onOpenRecordingsModal={() => setIsRecordingsModalOpen(true)}
      />

      {/* Interactive Modals */}
      <EqualizerModal
        isOpen={isEqModalOpen}
        onClose={() => setIsEqModalOpen(false)}
      />

      <SleepTimerModal
        isOpen={isSleepModalOpen}
        onClose={() => setIsSleepModalOpen(false)}
      />

      <VisualizerModal
        isOpen={isVisualizerModalOpen}
        onClose={() => setIsVisualizerModalOpen(false)}
      />

      <RecordingsModal
        isOpen={isRecordingsModalOpen}
        onClose={() => setIsRecordingsModalOpen(false)}
      />

      <OnlineDirectoryModal
        isOpen={isOnlineSearchModalOpen}
        onClose={() => setIsOnlineSearchModalOpen(false)}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <RadioProvider>
      <RadioAppContent />
    </RadioProvider>
  );
}
