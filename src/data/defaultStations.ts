import { RadioStation } from '../types/radio';

export interface CategoryMeta {
  id: string;
  label: string;
  malayalamLabel: string;
  icon: string;
}

export const CATEGORIES_CONFIG: CategoryMeta[] = [
  { id: 'all', label: 'All Stations', malayalamLabel: 'എല്ലാ ചാനലുകളും', icon: 'Radio' },
  { id: 'community', label: 'Community Radios', malayalamLabel: 'കമ്മ്യൂണിറ്റി റേഡിയോ', icon: 'Users' },
  { id: 'air', label: 'AIR', malayalamLabel: 'ആകാശവാണി', icon: 'TowerControl' },
  { id: 'online', label: 'Online Radios', malayalamLabel: 'ഓൺലൈൻ റേഡിയോ', icon: 'Globe' },
  { id: 'devotional', label: 'Devotional', malayalamLabel: 'ഭക്തിഗാനങ്ങൾ', icon: 'Sparkles' },
  { id: 'favorites', label: 'Favorites', malayalamLabel: 'ഇഷ്ടപ്പെട്ടവ', icon: 'Heart' },
];

export const DEFAULT_STATIONS: RadioStation[] = [
  // ==================== COMMUNITY RADIOS ====================
  {
    id: 'air-kochi',
    name: 'Radio Kochi 90 FM',
    malayalamName: 'റേഡിയോ കൊച്ചി 90 FM',
    streamUrl: 'https://d3caeelfr0kslf.cloudfront.net/radiokochi.m3u8',
    fallbackUrls: [
      'https://fm.ashrayafm90.com/ashrayafm'
    ],
    logo: 'https://radiosindia.com/images/radiokochi.jpg',
    category: 'community',
    frequency: '90.0 FM',
    location: 'Kochi, Kerala',
    bitrate: 'Live HLS Stream',
    gradient: 'from-amber-600 to-orange-700',
    description: 'അറബിക്കടലിന്റെ റാണിയായ കൊച്ചിയിൽ നിന്നുള്ള തനതായ കമ്മ്യൂണിറ്റി റേഡിയോ. തീരദേശ വാർത്തകൾ, സമകാലിക വിനോദങ്ങൾ, യുവത്വത്തിന്റെ പ്രിയഗാനങ്ങൾ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'കൊച്ചി', '90 FM', 'തത്സമയം'],
    codec: 'hls'
  },
  {
    id: 'sargakshetra-896',
    name: 'Sargakshetra 89.6 FM',
    malayalamName: 'സർഗ്ഗക്ഷേത്ര 89.6 FM',
    streamUrl: 'https://icecast.octosignals.com/sargakshetrafm',
    fallbackUrls: [
      'http://icecast.octosignals.com/sargakshetrafm'
    ],
    logo: 'https://radiosindia.com/images/sargakshetrafm.jpg',
    category: 'community',
    frequency: '89.6 FM',
    location: 'Changanassery, Kottayam',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-500 to-amber-600',
    description: 'ചങ്ങനാശ്ശേരിയിൽ നിന്നുള്ള പ്രമുഖ കമ്മ്യൂണിറ്റി റേഡിയോ. വിദ്യാഭ്യാസം, കൃഷി, സാംസ്കാരിക പരിപാടികൾ, മനസ്സ് നിറയ്ക്കുന്ന സംഗീതം.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'കോട്ടയം', 'സംസ്കാരം', 'സംഗീതം'],
    codec: 'mp3'
  },
  {
    id: 'radio-media-village',
    name: 'Radio Media Village 90.8',
    malayalamName: 'റേഡിയോ മീഡിയ വില്ലേജ് 90.8 FM',
    streamUrl: 'https://443-1.autopo.st/183/stream',
    fallbackUrls: [
      'http://443-1.autopo.st/183/stream'
    ],
    logo: 'https://radiosindia.com/images/radiomediavillage.jpg',
    category: 'community',
    frequency: '90.8 FM',
    location: 'Changanassery, Kottayam',
    bitrate: '128 kbps Live',
    gradient: 'from-amber-600 to-yellow-600',
    description: 'കോട്ടയം ജില്ലയിലെ പ്രഥമ കമ്മ്യൂണിറ്റി റേഡിയോ. യുവജന പരിപാടികൾ, വിജ്ഞാനപ്രദമായ ചർച്ചകൾ, നിത്യഹരിത ഗാനങ്ങൾ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'കോട്ടയം', 'യുവതരംഗം', 'പാട്ടുകൾ'],
    codec: 'mp3'
  },
  {
    id: 'radio-benziger-1078',
    name: 'Radio Benziger 107.8 FM',
    malayalamName: 'റേഡിയോ ബെൻസിഗർ 107.8 FM',
    streamUrl: 'https://icecast.octosignals.com/benziger',
    fallbackUrls: [
      'http://icecast.octosignals.com/benziger'
    ],
    logo: 'https://radiosindia.com/images/radiobenziger.jpg',
    category: 'community',
    frequency: '107.8 FM',
    location: 'Kollam, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-rose-600 to-amber-700',
    description: 'കൊല്ലം ബിഷപ്പ് ബെൻസിഗർ ആശുപത്രിയിൽ നിന്നുള്ള ആരോഗ്യ-സാമൂഹിക ശബ്ദം. ആരോഗ്യ ബോധവൽക്കരണം, തീരദേശ ജനതയുടെ ശബ്ദം.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'കൊല്ലം', 'ആരോഗ്യം', 'തീരദേശം'],
    codec: 'mp3'
  },
  {
    id: 'ashrayam-fm-90',
    name: 'Ashrayam FM 90',
    malayalamName: 'ആശ്രയം എഫ്.എം 90',
    streamUrl: 'https://fm.ashrayafm90.com/ashrayafm',
    fallbackUrls: [
      'http://fm.ashrayafm90.com/ashrayafm'
    ],
    logo: 'https://radiosindia.com/images/ashrayafm.jpg',
    category: 'community',
    frequency: '90.0 FM',
    location: 'Kollam, Kerala',
    bitrate: '128 kbps',
    gradient: 'from-emerald-600 to-teal-700',
    description: 'കൊല്ലം ജില്ലയിൽ നിന്നുള്ള ജനകീയ കമ്മ്യൂണിറ്റി റേഡിയോ. നാട്ടറിവുകൾ, ഗ്രാമീണ ജീവിതം, സാമൂഹ്യ പരിപാടികൾ, ഗാനങ്ങൾ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'കൊല്ലം', 'സാമൂഹികം', 'സംഗീതം'],
    codec: 'mp3'
  },
  {
    id: 'radio-mattoli',
    name: 'Radio Mattoli 90.4 FM',
    malayalamName: 'റേഡിയോ മാറ്റൊലി 90.4 FM',
    streamUrl: 'https://cast1.my-control-panel.com/proxy/radiomattoli/stream',
    fallbackUrls: [
      'http://cast1.my-control-panel.com/proxy/radiomattoli/stream'
    ],
    logo: 'https://radiosindia.com/images/radiomattoli.jpg',
    category: 'community',
    frequency: '90.4 FM',
    location: 'Wayanad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-emerald-700 to-teal-800',
    description: 'വയനാടിന്റെ ഹൃദയസ്പന്ദനം, ശബ്ദമില്ലാത്തവരുടെ ശബ്ദം. ഗോത്രവർഗ്ഗ പാരമ്പര്യം, കൃഷിപാഠങ്ങൾ, വനസംരക്ഷണം, നാടൻപാട്ടുകൾ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'വയനാട്', 'കൃഷി', 'നാടൻപാട്ടുകൾ'],
    codec: 'mp3'
  },
  {
    id: 'ahalia-fm',
    name: 'Ahalia FM 90.4',
    malayalamName: 'അഹല്യ എഫ്.എം 90.4',
    streamUrl: 'https://cast1.my-control-panel.com/proxy/ahaliafm/stream',
    fallbackUrls: [
      'http://cast1.my-control-panel.com/proxy/ahaliafm/stream'
    ],
    logo: 'https://radiosindia.com/images/ahaliafm.jpg',
    category: 'community',
    frequency: '90.4 FM',
    location: 'Palakkad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-600 to-amber-600',
    description: 'പാലക്കാട് അഹല്യ ക്യാമ്പസിൽ നിന്നുള്ള റേഡിയോ. ആരോഗ്യ സന്ദേശങ്ങൾ, ശാസ്ത്ര സാങ്കേതിക വിദ്യകൾ, മാപ്പിളപ്പാട്ടുകൾ, ശാസ്ത്രീയ സംഗീതം.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'പാലക്കാട്', 'ആരോഗ്യം', 'വിദ്യാഭ്യാസം'],
    codec: 'mp3'
  },
  {
    id: 'ente-radio',
    name: 'Ente Radio 91.2 FM',
    malayalamName: 'എന്റെ റേഡിയോ 91.2 FM',
    streamUrl: 'https://cast1.my-control-panel.com/proxy/enteradio/stream',
    fallbackUrls: [
      'http://cast1.my-control-panel.com/proxy/enteradio/stream'
    ],
    logo: 'https://radiosindia.com/images/enteradio.jpg',
    category: 'community',
    frequency: '91.2 FM',
    location: 'Thrissur, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-red-600 to-amber-700',
    description: 'സാംസ്കാരിക തലസ്ഥാനമായ തൃശൂരിൽ നിന്നുള്ള കമ്മ്യൂണിറ്റി റേഡിയോ. പൂരപ്പൊലിമ, കലകൾ, കാർഷികം, വിനോദ പരിപാടികൾ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'തൃശ്ശൂർ', 'സാംസ്കാരികം', 'കഥകൾ'],
    codec: 'mp3'
  },
  {
    id: 'my-radio-90',
    name: 'My Radio 90 FM',
    malayalamName: 'മൈ റേഡിയോ 90 FM',
    streamUrl: 'https://cast1.my-control-panel.com/proxy/myradio90fm/stream',
    fallbackUrls: [
      'http://cast1.my-control-panel.com/proxy/myradio90fm/stream'
    ],
    logo: 'https://radiosindia.com/images/malayalammusic.jpg',
    category: 'community',
    frequency: '90.0 FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-red-700',
    description: 'പുത്തൻ മലയാളം സിനിമാ ഗാനങ്ങളും യുവതലമുറയുടെ തരംഗ ട്രെൻഡുകളും അവതരിപ്പിക്കുന്ന ഊർജ്ജസ്വലമായ എഫ്.എം ചാനൽ.',
    tags: ['കമ്മ്യൂണിറ്റി റേഡിയോ', 'സിനിമ ഗാനങ്ങൾ', 'യുവത്വം', 'വിനോദം'],
    codec: 'mp3'
  },

  // ==================== AIR (AKASHVANI) ====================
  {
    id: 'air-kochi-fm',
    name: 'AIR Kochi FM',
    malayalamName: 'ആകാശവാണി കൊച്ചി FM',
    streamUrl: 'https://radio.wavespb.com/live/70400e7510e87cdf/70400e7510e87cdf.m3u8',
    fallbackUrls: [
      'https://air.pc.cdn.bitgravity.com/air/live/pbaudio044/playlist.m3u8'
    ],
    logo: 'https://radiosindia.com/images/air.jpg',
    category: 'air',
    frequency: '102.3 FM / AIR',
    location: 'Kochi, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-sky-700 to-blue-900',
    description: 'ആകാശവാണി കൊച്ചി നിലയം. പ്രാദേശിക വാർത്തകൾ, പ്രഭാതഭേരി, കർഷകരംഗം, മലയാള സംഗീതപരിപാടികൾ, വിജ്ഞാന വിനോദ പ്രക്ഷേപണങ്ങൾ.',
    tags: ['ആകാശവാണി', 'കൊച്ചി', 'AIR Kochi', 'FM', 'വാർത്തകൾ'],
    codec: 'hls'
  },
  {
    id: 'devikulam-fm',
    name: 'Akashvani Devikulam',
    malayalamName: 'ദേവികുളം എഫ്.എം 101.4',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio214/chunklist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio214/chunklist.m3u8'
    ],
    logo: 'https://radiosindia.com/images/air.jpg',
    category: 'air',
    frequency: '101.4 FM',
    location: 'Devikulam, Idukki',
    bitrate: 'HLS Live',
    gradient: 'from-emerald-700 to-green-900',
    description: 'മൂന്നാറിലെയും ഇടുക്കി ഹൈറേഞ്ചിലെയും മലനിരകളിൽ നിന്നുള്ള ആകാശവാണി തത്സമയ സംപ്രേഷണം. തോട്ടം തൊഴിലാളി പരിപാടികളും വാർത്തകളും.',
    tags: ['ആകാശവാണി', 'ദേവികുളം', 'മൂന്നാർ', 'ഇടുക്കി', 'വാർത്തകൾ'],
    codec: 'hls'
  },
  {
    id: 'air-alappuzha',
    name: 'Akashvani Alappuzha',
    malayalamName: 'ആകാശവാണി ആലപ്പുഴ',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio230/playlist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio230/playlist.m3u8'
    ],
    logo: 'https://onlineradiohub.com/wp-content/uploads/2023/03/air-alappuzha-akashvani.jpg',
    category: 'air',
    frequency: '576 AM / AIR',
    location: 'Alappuzha, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-teal-600 to-cyan-800',
    description: 'കിഴക്കിന്റെ വെനീസ് എന്നറിയപ്പെടുന്ന ആലപ്പുഴയിൽ നിന്നുള്ള ആകാശവാണി പ്രക്ഷേപണം. കുട്ടനാടൻ കൃഷി വിശേഷങ്ങളും വള്ളപ്പാട്ടുകളും.',
    tags: ['ആകാശവാണി', 'ആലപ്പുഴ', 'കുട്ടനാട്', 'കായലുകൾ'],
    codec: 'hls'
  },
  {
    id: 'air-kozhikode',
    name: 'Akashvani Kozhikode',
    malayalamName: 'ആകാശവാണി കോഴിക്കോട് റിയൽ FM',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio083/playlist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio083/playlist.m3u8'
    ],
    logo: 'https://onlineradiohub.com/wp-content/uploads/2023/03/air-kozhikode-real-fm.jpg',
    category: 'air',
    frequency: '103.6 FM / Real FM',
    location: 'Kozhikode, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-amber-600 to-emerald-700',
    description: 'മലബാറിന്റെ സാംസ്കാരിക പൈതൃകം, ആകാശവാണി നാടകങ്ങൾ, ബാബുരാജ് സംഗീതം, സാഹിത്യ ചർച്ചകൾ, പ്രാദേശിക വാർത്തകൾ.',
    tags: ['ആകാശവാണി', 'കോഴിക്കോട്', 'റിയൽ FM', 'മലബാർ', 'നാടകം'],
    codec: 'hls'
  },
  {
    id: 'air-kochi-rainbow',
    name: 'AIR Kochi Rainbow',
    malayalamName: 'ആകാശവാണി കൊച്ചി FM റെയിൻബോ',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio044/playlist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio044/playlist.m3u8'
    ],
    logo: 'https://onlineradiohub.com/wp-content/uploads/2023/03/RainbowFMKochi.jpg',
    category: 'air',
    frequency: '107.5 FM Rainbow',
    location: 'Kochi, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-orange-600 to-rose-700',
    description: 'ആകാശവാണി കൊച്ചി എഫ്.എം റെയിൻബോ. മലയാള സിനിമ ഗാനങ്ങൾ, യുവജന സമ്പർക്ക പരിപാടികൾ, അഭിമുഖങ്ങൾ.',
    tags: ['ആകാശവാണി', 'എഫ്.എം റെയിൻബോ', 'കൊച്ചി', 'സിനിമ'],
    codec: 'hls'
  },
  {
    id: 'air-ananthapuri',
    name: 'AIR Ananthapuri FM',
    malayalamName: 'ആകാശവാണി അനന്തപുരി 101.9 FM',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio040/playlist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio040/playlist.m3u8'
    ],
    logo: 'https://onlineradiohub.com/wp-content/uploads/2023/02/vividh-bharati-thiruvananthapuram.jpg',
    category: 'air',
    frequency: '101.9 FM',
    location: 'Thiruvananthapuram, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-yellow-600 to-amber-700',
    description: 'തലസ്ഥാന നഗരിയിൽ നിന്നുള്ള ആകാശവാണി അനന്തപുരി എഫ്.എം. ഔദ്യോഗിക വാർത്തകൾ, വിവര വിനിമയം, രാഗമാലിക ഗാനങ്ങൾ.',
    tags: ['ആകാശവാണി', 'തിരുവനന്തപുരം', 'അനന്തപുരി', 'തലസ്ഥാനം'],
    codec: 'hls'
  },
  {
    id: 'air-manjeri',
    name: 'Akashvani Manjeri FM',
    malayalamName: 'ആകാശവാണി മഞ്ചേരി FM',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio079/playlist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio079/playlist.m3u8'
    ],
    logo: 'https://radiosindia.com/images/airmanjeri.jpg',
    category: 'air',
    frequency: '100.2 FM',
    location: 'Manjeri, Malappuram',
    bitrate: 'HLS Live',
    gradient: 'from-emerald-600 to-green-800',
    description: 'മലപ്പുറം ജില്ലയിലെയും മധ്യകേരളത്തിലെയും ജനങ്ങൾക്കായി ആകാശവാണി മഞ്ചേരി നിലയത്തിൽ നിന്നുള്ള പ്രക്ഷേപണം.',
    tags: ['ആകാശവാണി', 'മഞ്ചേരി', 'മലപ്പുറം', 'കൃഷി'],
    codec: 'hls'
  },

  // ==================== ONLINE RADIOS ====================
  {
    id: 'kerala-sangeetham',
    name: 'Kerala Sangeetham Radio',
    malayalamName: 'കേരള സംഗീതം റേഡിയോ',
    streamUrl: 'https://stream.zeno.fm/08e1vkshcc9uv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv',
      'http://airspectrum.cdnstream1.com:8120/1651_128'
    ],
    logo: 'https://radiosindia.com/images/sangeethamradio.jpg',
    category: 'online',
    frequency: 'Melody HD',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    description: 'മനം മയക്കുന്ന മലയാളം ഗാനങ്ങൾ, ഉത്സവ ഗാനങ്ങൾ, വള്ളംകളി പാട്ടുകൾ, ഗൃഹാതുരത്വം ഉണർത്തുന്ന സുവർണ്ണ കാലഘട്ടത്തിലെ മെലഡികൾ.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'സംഗീതം', 'മെലഡികൾ', 'കേരളം', 'നോസ്റ്റാൾജിയ'],
    codec: 'mp3'
  },
  {
    id: 'radio-mango',
    name: 'Radio Mango',
    malayalamName: 'റേഡിയോ മാംഗോ 91.9 FM',
    streamUrl: 'https://strw3.openstream.co/1459',
    fallbackUrls: [
      'http://strw3.openstream.co/1459'
    ],
    logo: 'https://radiosindia.com/images/radiomango.jpg',
    category: 'online',
    frequency: '91.9 FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-orange-600',
    description: 'നാട്ടിലെങ്ങും പാട്ടോടെ പാട്ട്! മലയാള മനോരമയുടെ പ്രമുഖ പ്രൈവറ്റ് എഫ്.എം ചാനൽ. എക്കാലത്തെയും മികച്ച ഹിറ്റ് ഗാനങ്ങൾ.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'റേഡിയോ മാംഗോ', 'സിനിമാ ഹിറ്റുകൾ', 'കേരളം'],
    codec: 'mp3'
  },
  {
    id: 'radio4u',
    name: 'Radio4U',
    malayalamName: 'റേഡിയോ ഫോർ യു',
    streamUrl: 'https://a5.asurahosting.com/listen/radio4u/radio.mp3',
    fallbackUrls: [
      'http://a5.asurahosting.com/listen/radio4u/radio.mp3'
    ],
    logo: 'https://radiosindia.com/images/radio4u.jpg',
    category: 'online',
    frequency: 'Online HD',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-600 to-amber-600',
    description: '24 മണിക്കൂറും ഇടവേളകളില്ലാത്ത മലയാളം സംഗീത പ്രവാഹം. പുതിയ ഹിറ്റുകളും പഴയകാല ക്ലാസിക് ഗാനങ്ങളും.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'ഹിറ്റുകൾ', 'സംഗീതം', '24x7'],
    codec: 'mp3'
  },
  {
    id: 'radio-palakkad',
    name: 'Radio Palakkad',
    malayalamName: 'റേഡിയോ പാലക്കാട്',
    streamUrl: 'https://stream.zeno.fm/qgqrxfte41zuv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv'
    ],
    logo: 'https://radiosindia.com/images/radiopalakkad.jpg',
    category: 'online',
    frequency: 'Online FM',
    location: 'Palakkad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-orange-700',
    description: 'പാലക്കാടൻ നാട്ടുവിശേഷങ്ങൾ, സോപാന സംഗീതം, നാടൻപാട്ടുകൾ, കാറ്റാടിപ്പാടങ്ങളുടെ സംഗീതം.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'പാലക്കാട്', 'നാടൻപാട്ടുകൾ', 'മെലഡികൾ'],
    codec: 'mp3'
  },
  {
    id: 'radio-malabar',
    name: 'Radio Malabar',
    malayalamName: 'റേഡിയോ മലബാർ',
    streamUrl: 'https://d98pmgd7by0qx.cloudfront.net/radiomalabar.m3u8',
    fallbackUrls: [
      'http://airspectrum.cdnstream1.com:8120/1651_128'
    ],
    logo: 'https://radiosindia.com/images/radiomalabar.jpg',
    category: 'online',
    frequency: 'Online HLS',
    location: 'Malabar, Kerala',
    bitrate: 'Live HLS Stream',
    gradient: 'from-amber-600 to-emerald-700',
    description: 'മലബാർ മേഖലയിലെ സാംസ്കാരിക ശബ്ദം. പ്രശസ്തമായ മാപ്പിളപ്പാട്ടുകൾ, ചരിത്രം, മലബാറിന്റെ തനതു ഗാനങ്ങൾ.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'മലബാർ', 'സംസ്കാരം', 'മാപ്പിളപ്പാട്ടുകൾ'],
    codec: 'hls'
  },
  {
    id: 'radio-digital-malayali',
    name: 'Radio Digital Malayali',
    malayalamName: 'റേഡിയോ ഡിജിറ്റൽ മലയാളി (ഗൾഫ് & പ്രവാസി)',
    streamUrl: 'https://radio.digitalmalayali.in/listen/stream/radio.mp3',
    fallbackUrls: [
      'http://radio.digitalmalayali.in/listen/stream/radio.mp3'
    ],
    logo: 'https://radio.digitalmalayali.in/static/uploads/album_art.1688135987.jpg',
    category: 'online',
    frequency: 'Digital HD',
    location: 'UAE / Gulf / Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-emerald-700',
    description: 'യു.എ.ഇ, ഖത്തർ, സൗദി അറേബ്യ അടക്കമുള്ള ഗൾഫ് പ്രവാസികൾക്കായി ലോകമെമ്പാടുമുള്ള മലയാളികളെ കോർത്തിണക്കുന്ന ഡിജിറ്റൽ റേഡിയോ.',
    tags: ['ഓൺലൈൻ റേഡിയോ', 'പ്രവാസി', 'ഗൾഫ്', 'ദുബായ്', 'വാർത്തകൾ'],
    codec: 'mp3'
  },
  {
    id: 'kancheeravam-radio',
    name: 'Kancheeravam Radio',
    malayalamName: 'കാഞ്ചീരവം റേഡിയോ',
    streamUrl: 'https://radiosavre.com:8020/radio.mp3',
    fallbackUrls: [
      'http://radiosavre.com:8020/radio.mp3'
    ],
    logo: 'https://radiosindia.com/images/malayalamradio.jpg',
    category: 'online',
    frequency: '90s Hits',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-red-700',
    description: '90-കളിലെയും 2000-കളിലെയും മലയാള സിനിമാ ഗൃഹാതുരത്വം, കാലാതീതമായ ഗാനരചനകളും ഇമ്പമാർന്ന ഈണങ്ങളും.',
    tags: ['ഓൺലൈൻ റേഡിയോ', '90s ഹിറ്റുകൾ', 'നോസ്റ്റാൾജിയ', 'സിനിമ ഗാനങ്ങൾ'],
    codec: 'mp3'
  },
  // ==================== DEVOTIONAL RADIOS ====================
  {
    id: 'malayalam-bhakthi',
    name: 'Malayalam Bhakthi Songs',
    malayalamName: 'മലയാളം ഭക്തി ഗാനങ്ങൾ (ശബരിമല & ദേവി)',
    streamUrl: 'https://stream.zeno.fm/08e1vkshcc9uv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv'
    ],
    logo: 'https://radiosindia.com/images/iyalisaibakthiradio.jpg',
    category: 'devotional',
    frequency: '24x7 Divine',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-orange-700',
    description: 'ശബരിമല അയ്യപ്പ ഭക്തിഗാനങ്ങൾ, ഗുരുവായൂരപ്പൻ ഭജനകൾ, ലളിതാ സഹസ്രനാമം, ദേവി സ്തോത്രങ്ങൾ, നിത്യ ഭക്തി സംഗീതം.',
    tags: ['ഭക്തിഗാനങ്ങൾ', 'അയ്യപ്പൻ', 'ഗുരുവായൂർ', 'ഭജനകൾ', 'സ്തോത്രങ്ങൾ'],
    codec: 'mp3'
  },
  {
    id: 'psalms-radio',
    name: 'Psalms Radio',
    malayalamName: 'സാംസ് റേഡിയോ (Psalms Radio)',
    streamUrl: 'https://s2.citrus3.com:8046/stream',
    fallbackUrls: [
      'https://s2.citrus3.com:8046/stream'
    ],
    logo: 'https://radiosindia.com/images/psalmsradio.jpg',
    category: 'devotional',
    frequency: 'Psalms 24x7',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-indigo-700',
    description: '24 മണിക്കൂറും മലയാളം ക്രിസ്തീയ സങ്കീർത്തനങ്ങൾ, ആരാധനാ ഗാനങ്ങൾ, ആത്മീയാനുഭവമേകുന്ന സുവിശേഷ സംഗീതം.',
    tags: ['ഭക്തിഗാനങ്ങൾ', 'ക്രിസ്തീയം', 'സങ്കീർത്തനങ്ങൾ', 'ആരാധന'],
    codec: 'mp3'
  },
  {
    id: 'dvn-radio',
    name: 'DVN Radio',
    malayalamName: 'ഡി.വി.എൻ റേഡിയോ (DVN Radio)',
    streamUrl: 'https://ice31.securenetsystems.net/DVN',
    fallbackUrls: [
      'https://ice31.securenetsystems.net/DVN'
    ],
    logo: 'https://radiosindia.com/images/dvnradio.jpg',
    category: 'devotional',
    frequency: 'DVN Live',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-cyan-700',
    description: 'ഡി.വി.എൻ മലയാളം ക്രിസ്തീയ പ്രക്ഷേപണം. പ്രാർത്ഥനാ സന്ദേശങ്ങൾ, സുവിശേഷ വചനങ്ങൾ, ഭക്തിസാന്ദ്രമായ ഗാനങ്ങൾ.',
    tags: ['ഭക്തിഗാനങ്ങൾ', 'ക്രിസ്തീയം', 'പ്രാർത്ഥന', 'ആത്മീയത'],
    codec: 'mp3'
  },
  {
    id: 'jesus-radio',
    name: 'Jesus Radio',
    malayalamName: 'ജീസസ് റേഡിയോ (Jesus Reigns)',
    streamUrl: 'https://gains.reviveradio.net/proxy/jesusreigns?mp=/stream',
    fallbackUrls: [
      'https://gains.reviveradio.net/proxy/jesusreigns?mp=/stream'
    ],
    logo: 'https://onlineradiohub.com/wp-content/uploads/2023/03/JesusRadio.jpg',
    category: 'devotional',
    frequency: 'Jesus Reigns',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-yellow-500 to-rose-700',
    description: 'ജീസസ് റെയിൻസ് മലയാളം ക്രിസ്തീയ ഭക്തി സംപ്രേഷണം. പരമ്പരാഗത സ്തോത്രഗീതങ്ങളും പുതിയ ആരാധനാ ഗാനങ്ങളും.',
    tags: ['ഭക്തിഗാനങ്ങൾ', 'ക്രിസ്തീയം', 'സ്തോത്രങ്ങൾ', 'ഗാനങ്ങൾ'],
    codec: 'mp3'
  }
];
