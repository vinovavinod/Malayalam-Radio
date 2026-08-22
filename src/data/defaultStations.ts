import { RadioStation } from '../types/radio';

export interface CategoryMeta {
  id: string;
  label: string;
  malayalamLabel: string;
  icon: string;
}

export const CATEGORIES_CONFIG: CategoryMeta[] = [
  { id: 'all', label: 'All Channels', malayalamLabel: 'എല്ലാ ചാനലുകളും', icon: 'Radio' },
  { id: 'onam-special', label: 'Onam Specials', malayalamLabel: 'ഓണപ്പാട്ടുകൾ', icon: 'Sparkles' },
  { id: 'favorites', label: 'Favorites', malayalamLabel: 'ഇഷ്ടപ്പെട്ടവ', icon: 'Heart' },
  { id: 'top-fm', label: 'FM & Community', malayalamLabel: 'എഫ്.എം & കമ്മ്യൂണിറ്റി', icon: 'Radio' },
  { id: 'akashvani', label: 'Akashvani AIR', malayalamLabel: 'ആകാശവാണി', icon: 'TowerControl' },
  { id: 'hits-retro', label: 'Melodies & Classics', malayalamLabel: 'പാട്ടുകൾ', icon: 'Music' },
  { id: 'news-talk', label: 'News & Culture', malayalamLabel: 'വാർത്തകൾ', icon: 'Newspaper' },
  { id: 'gulf-pravasi', label: 'Gulf & Pravasi', malayalamLabel: 'പ്രവാസി', icon: 'Globe' },
  { id: 'devotional', label: 'Devotional', malayalamLabel: 'ഭക്തിഗാനങ്ങൾ', icon: 'Flame' },
  { id: 'custom', label: 'My Custom Links', malayalamLabel: 'സ്വന്തം ലിങ്കുകൾ', icon: 'PlusCircle' },
];

export const DEFAULT_STATIONS: RadioStation[] = [
  // Onam & Festival Specials
  {
    id: 'ponnonam-special',
    name: 'Ponnonam Radio',
    malayalamName: 'പൊന്നോണം റേഡിയോ (ഓണപ്പാട്ടുകൾ)',
    streamUrl: 'https://stream.zeno.fm/08e1vkshcc9uv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv',
      'http://airspectrum.cdnstream1.com:8120/1651_128'
    ],
    category: 'onam-special',
    frequency: 'Festive FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    description: 'Special Onam festival melodies, Maveli songs, boat race beats, and nostalgic Malayalam golden tunes.',
    tags: ['Onam', 'Ponnonam', 'Vallamkali', 'Festival', 'Nostalgia', 'Kerala'],
    codec: 'mp3'
  },
  {
    id: 'malayalam-superhits',
    name: 'Malayalam Superhits',
    malayalamName: 'മലയാളം സൂപ്പർഹിറ്റുകൾ 24x7',
    streamUrl: 'https://stream.zeno.fm/k22dfh67w8quv',
    fallbackUrls: [
      'https://stream.zeno.fm/4621p5bdfp8uv',
      'https://a5.asurahosting.com/listen/radio4u/radio.mp3'
    ],
    category: 'onam-special',
    frequency: 'Online HD',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-yellow-500 to-amber-600',
    description: 'Festive Malayalam cinema superhits, dance tracks, and new generation hits.',
    tags: ['Onam Hits', 'Cinema', 'Dance', 'Superhits', 'Kerala'],
    codec: 'mp3'
  },

  // Top FM & Community Stations
  {
    id: 'air-kochi',
    name: 'Radio Kochi 90 FM',
    malayalamName: 'റേഡിയോ കൊച്ചി 90 FM',
    streamUrl: 'https://d3caeelfr0kslf.cloudfront.net/radiokochi.m3u8',
    fallbackUrls: [
      'https://fm.ashrayafm90.com/ashrayafm'
    ],
    category: 'top-fm',
    frequency: '90.0 FM',
    location: 'Kochi, Kerala',
    bitrate: 'Live HLS Stream',
    gradient: 'from-amber-600 to-orange-700',
    description: 'Radio Kochi 90 FM - Vibrant Community Radio broadcasting live from the Queen of Arabian Sea.',
    tags: ['Kochi', 'Radio Kochi', '90 FM', 'Live', 'Community'],
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
    category: 'top-fm',
    frequency: '89.6 FM',
    location: 'Changanassery, Kottayam',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-500 to-amber-600',
    description: 'Community Radio 89.6 FM Sargakshetra from Changanassery, Kerala.',
    tags: ['Community FM', 'Kottayam', 'Culture', 'Talk'],
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
    category: 'top-fm',
    frequency: '90.8 FM',
    location: 'Changanassery, Kottayam',
    bitrate: '128 kbps Live',
    gradient: 'from-amber-600 to-yellow-600',
    description: 'Radio Media Village 90.8 FM - The first community radio in Kottayam district.',
    tags: ['Kottayam', 'Media Village', 'Youth', 'Music'],
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
    category: 'top-fm',
    frequency: '107.8 FM',
    location: 'Kollam, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-rose-600 to-amber-700',
    description: 'Radio Benziger 107.8 FM - Community Radio station from Bishop Benziger Hospital Kollam.',
    tags: ['Kollam', 'Community FM', 'Health', 'Coastal Voice'],
    codec: 'mp3'
  },
  {
    id: 'radio-macfast-904',
    name: 'Radio Macfast 90.4 FM',
    malayalamName: 'റേഡിയോ മാക്ഫാസ്റ്റ് 90.4 FM',
    streamUrl: 'https://icecast.octosignals.com/radiomacfast',
    fallbackUrls: [
      'http://icecast.octosignals.com/radiomacfast'
    ],
    category: 'top-fm',
    frequency: '90.4 FM',
    location: 'Thiruvalla, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-emerald-600',
    description: 'Clean City Green City Radio Macfast 90.4 FM from Thiruvalla campus.',
    tags: ['Thiruvalla', 'Campus FM', 'Green City', 'Knowledge'],
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
    category: 'top-fm',
    frequency: '90.0 FM',
    location: 'Kollam, Kerala',
    bitrate: '128 kbps',
    gradient: 'from-emerald-600 to-teal-700',
    description: 'Ashrayam 90.0 FM Community Radio from Kollam, Kerala.',
    tags: ['Community FM', 'Kollam', 'Music', 'Social'],
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
    category: 'top-fm',
    frequency: '90.4 FM',
    location: 'Wayanad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-emerald-700 to-teal-800',
    description: 'Radio Mattoli 90.4 FM - The community radio station of Wayanad, Voice of the Voiceless.',
    tags: ['Wayanad', 'Community', 'Agriculture', 'Tribal Voice'],
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
    category: 'top-fm',
    frequency: '90.4 FM',
    location: 'Palakkad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-600 to-amber-600',
    description: 'Ahalia 90.4 FM Community Radio from Palakkad campus, broadcasting health, education & music.',
    tags: ['Palakkad', 'Education', 'Health', 'Community'],
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
    category: 'top-fm',
    frequency: '90.0 FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-red-700',
    description: 'Popular Malayalam FM station playing youth tracks, cinema hits, and entertainment.',
    tags: ['Entertainment', 'Hits', 'Youth', 'Kerala'],
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
    category: 'top-fm',
    frequency: '91.2 FM',
    location: 'Thrissur, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-red-600 to-amber-700',
    description: 'Ente Radio 91.2 FM community station from Cultural Capital Thrissur.',
    tags: ['Thrissur', 'Community Radio', 'Kerala', 'Stories'],
    codec: 'mp3'
  },
  {
    id: 'radio-mangalam-912',
    name: 'Radio Mangalam 91.2 FM',
    malayalamName: 'റേഡിയോ മംഗളം 91.2 FM',
    streamUrl: 'http://radiomangalam.in:8000/stream',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv'
    ],
    category: 'top-fm',
    frequency: '91.2 FM',
    location: 'Ettumanoor, Kottayam',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-600 to-yellow-600',
    description: 'Radio Mangalam 91.2 FM community radio by Mangalam Group.',
    tags: ['Mangalam', 'Kottayam', 'News', 'Melodies'],
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
    category: 'top-fm',
    frequency: '91.9 FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-orange-600',
    description: 'Radio Mango - Nattilengum Paattode Paattu, premier Malayalam private FM station.',
    tags: ['Hits', 'Malayalam Cinema', 'Superhits', 'Kerala'],
    codec: 'mp3'
  },
  {
    id: 'club-fm-kerala',
    name: 'Club FM Kerala',
    malayalamName: 'ക്ലബ് എഫ്.എം കേരള',
    streamUrl: 'https://strw3.openstream.co/1458',
    fallbackUrls: [
      'http://strw3.openstream.co/1458'
    ],
    category: 'top-fm',
    frequency: '94.3 / 104.8 FM',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-yellow-600 to-red-600',
    description: 'Club FM - Ton Kannakkinu Fun! Superhit Malayalam songs, RJ talks, and non-stop entertainment.',
    tags: ['Club FM', 'Mathrubhumi', 'Superhits', 'Kerala'],
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
    category: 'top-fm',
    frequency: 'Online HD',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-orange-600 to-amber-600',
    description: '24/7 non-stop Malayalam music, trending film tracks, and evergreen favorites.',
    tags: ['Hits', 'Music', 'Non-Stop', 'Kerala'],
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
    category: 'top-fm',
    frequency: 'Online FM',
    location: 'Palakkad, Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-orange-700',
    description: 'Radio Palakkad - Local tunes, folklore, Sopana sangeetham, and popular Malayalam songs.',
    tags: ['Palakkad', 'Local', 'Folk', 'Melody'],
    codec: 'mp3'
  },

  // Akashvani (All India Radio) Live
  {
    id: 'devikulam-fm',
    name: 'Akashvani Devikulam',
    malayalamName: 'ദേവികുളം എഫ്.എം 101.4',
    streamUrl: 'https://air.pc.cdn.bitgravity.com/air/live/pbaudio214/chunklist.m3u8',
    fallbackUrls: [
      'http://air.pc.cdn.bitgravity.com/air/live/pbaudio214/chunklist.m3u8'
    ],
    category: 'akashvani',
    frequency: '101.4 FM',
    location: 'Devikulam, Idukki',
    bitrate: 'HLS Live',
    gradient: 'from-emerald-700 to-green-900',
    description: 'Akashvani Devikulam 101.4 FM - High ranges of Munnar and Idukki high altitude broadcast.',
    tags: ['Devikulam', 'Munnar', 'Idukki', 'Akashvani'],
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
    category: 'akashvani',
    frequency: '576 AM / AIR',
    location: 'Alappuzha, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-teal-600 to-cyan-800',
    description: 'Akashvani Alappuzha - All India Radio live transmission from the Venice of the East.',
    tags: ['Alappuzha', 'Akashvani', 'Venice of the East', 'AIR'],
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
    category: 'akashvani',
    frequency: '103.6 FM / Real FM',
    location: 'Kozhikode, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-amber-600 to-emerald-700',
    description: 'Akashvani Kozhikode Real FM - Cultural epicenter of Malabar music, drama, and regional news.',
    tags: ['Kozhikode', 'Real FM', 'Malabar', 'Akashvani'],
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
    category: 'akashvani',
    frequency: '107.5 FM Rainbow',
    location: 'Kochi, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-orange-600 to-rose-700',
    description: 'All India Radio Kochi FM Rainbow - Youth programs, film reviews, and popular Malayalam songs.',
    tags: ['FM Rainbow', 'Kochi', 'AIR', 'Akashvani'],
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
    category: 'akashvani',
    frequency: '101.9 FM',
    location: 'Thiruvananthapuram, Kerala',
    bitrate: 'HLS Live',
    gradient: 'from-yellow-600 to-amber-700',
    description: 'Akashvani Ananthapuri FM 101.9 - Capital city broadcast from Thiruvananthapuram.',
    tags: ['Thiruvananthapuram', 'Ananthapuri', 'Capital', 'Akashvani'],
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
    category: 'akashvani',
    frequency: '100.2 FM',
    location: 'Manjeri, Malappuram',
    bitrate: 'HLS Live',
    gradient: 'from-emerald-600 to-green-800',
    description: 'Akashvani Manjeri 100.2 FM - Serving Malappuram and central Kerala with culture and agriculture.',
    tags: ['Manjeri', 'Malappuram', 'Akashvani', 'AIR'],
    codec: 'hls'
  },

  // News, Talk & Culture / Gulf Pravasi
  {
    id: 'radio-malabar',
    name: 'Radio Malabar',
    malayalamName: 'റേഡിയോ മലബാർ',
    streamUrl: 'https://d98pmgd7by0qx.cloudfront.net/radiomalabar.m3u8',
    fallbackUrls: [
      'http://airspectrum.cdnstream1.com:8120/1651_128'
    ],
    category: 'news-talk',
    frequency: 'Online HLS',
    location: 'Malabar, Kerala',
    bitrate: 'Live HLS Stream',
    gradient: 'from-amber-600 to-emerald-700',
    description: 'Malabar region news, Mappila pattukal, and cultural radio broadcast.',
    tags: ['Malabar', 'Culture', 'News', 'Kozhikode', 'Mappila Songs'],
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
    category: 'gulf-pravasi',
    frequency: 'Digital HD',
    location: 'UAE / Gulf / Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-emerald-700',
    description: 'Digital Malayali Radio for the worldwide Malayali diaspora across UAE, Qatar, Saudi and beyond.',
    tags: ['Pravasi', 'Gulf', 'Dubai', 'Digital', 'Talk'],
    codec: 'mp3'
  },

  // Melodies, Classics & Evergreen Hits
  {
    id: 'radio-malayalam',
    name: 'Radio Malayalam Evergreen',
    malayalamName: 'റേഡിയോ മലയാളം എവർഗ്രീൻ',
    streamUrl: 'http://airspectrum.cdnstream1.com:8120/1651_128',
    fallbackUrls: [
      'https://stream.zeno.fm/4621p5bdfp8uv'
    ],
    category: 'hits-retro',
    frequency: '128 kbps HD',
    location: 'Kerala / Global',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-orange-700',
    description: 'Non-stop Malayalam evergreen classics from the golden era of Malayalam cinema (Devarajan Master, Baburaj, Yesudas, Chithra).',
    tags: ['Evergreen', 'Oldies', 'Yesudas', 'Baburaj', 'Classics'],
    codec: 'mp3'
  },
  {
    id: 'pranayam-fm',
    name: 'Pranayam FM Malayalam',
    malayalamName: 'പ്രണയം എഫ്.എം മലയാളം',
    streamUrl: 'https://stream.zeno.fm/4621p5bdfp8uv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv'
    ],
    category: 'hits-retro',
    frequency: 'Romantic Hits',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-rose-600 to-amber-700',
    description: 'Romantic Malayalam melodies, love duets, and soothing acoustic tunes.',
    tags: ['Love Songs', 'Melodies', 'Pranayam', 'Romantic'],
    codec: 'mp3'
  },
  {
    id: 'radio-sunflower',
    name: 'Radio Sunflower',
    malayalamName: 'റേഡിയോ സൺഫ്ലവർ മലയാളം',
    streamUrl: 'https://stream.zeno.fm/0f38p577w8quv',
    fallbackUrls: [
      'https://stream.zeno.fm/k22dfh67w8quv'
    ],
    category: 'hits-retro',
    frequency: 'Melody Stream',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-yellow-500 to-amber-600',
    description: 'Soothing Malayalam tunes, acoustic melodies, and relaxing ambient music.',
    tags: ['Melodies', 'Acoustic', 'Relaxing', 'Kerala'],
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
    category: 'hits-retro',
    frequency: '90s Hits',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-red-700',
    description: '90s and 2000s Malayalam film nostalgia, timeless compositions and melodies.',
    tags: ['90s Hits', 'Nostalgia', 'Film Songs', 'Melodies'],
    codec: 'mp3'
  },

  // Devotional Channels
  {
    id: 'malayalam-bhakthi',
    name: 'Malayalam Bhakthi Songs',
    malayalamName: 'മലയാളം ഭക്തി ഗാനങ്ങൾ (ശബരിമല & ദേവി)',
    streamUrl: 'https://stream.zeno.fm/08e1vkshcc9uv',
    fallbackUrls: [
      'http://192.111.140.6:8546/stream'
    ],
    category: 'devotional',
    frequency: '24x7 Divine',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-500 to-orange-700',
    description: 'Malayalam devotional songs, Sabarimala Ayyappa devotional tracks, Guruvayoor bhajans, and Devi stothrams.',
    tags: ['Devotional', 'Ayyappa', 'Guruvayoor', 'Bhajans', 'Hindu', 'Spiritual'],
    codec: 'mp3'
  },
  {
    id: 'luminous-radio',
    name: 'Luminous Radio Malayalam',
    malayalamName: 'ലൂമിനസ് റേഡിയോ ഭക്തി',
    streamUrl: 'http://192.111.140.6:8546/stream',
    fallbackUrls: [
      'https://stream.zeno.fm/08e1vkshcc9uv'
    ],
    category: 'devotional',
    frequency: 'Spiritual HD',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-yellow-600 to-amber-700',
    description: 'Peaceful devotional chants, temple instrumental music, and morning prayers.',
    tags: ['Spiritual', 'Chants', 'Peace', 'Prayers'],
    codec: 'mp3'
  },
  {
    id: 'malayalam-christian-songs',
    name: 'Malayalam Christian Radio',
    malayalamName: 'മലയാളം ക്രിസ്ത്യൻ റേഡിയോ',
    streamUrl: 'https://stream.zeno.fm/d28v4x56z6quv',
    fallbackUrls: [
      'https://stream.zeno.fm/08e1vkshcc9uv'
    ],
    category: 'devotional',
    frequency: 'Gospel 24x7',
    location: 'Kerala',
    bitrate: '128 kbps MP3',
    gradient: 'from-amber-600 to-teal-700',
    description: 'Malayalam Christian devotional songs, worship choir, and soothing gospel melodies.',
    tags: ['Christian', 'Gospel', 'Worship', 'Hymns', 'Devotional'],
    codec: 'mp3'
  }
];
