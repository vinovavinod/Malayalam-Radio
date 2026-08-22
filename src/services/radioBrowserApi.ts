import { RadioStation } from '../types/radio';

export interface RadioBrowserItem {
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  votes: number;
  codec: string;
  bitrate: number;
}

const RADIO_SERVERS = [
  'https://de1.api.radio-browser.info',
  'https://nl1.api.radio-browser.info',
  'https://at1.api.radio-browser.info',
  'https://all.api.radio-browser.info'
];

export async function fetchMalayalamOnlineStations(query = ''): Promise<RadioStation[]> {
  for (const server of RADIO_SERVERS) {
    try {
      const endpoint = query.trim()
        ? `${server}/json/stations/search?name=${encodeURIComponent(query)}&language=malayalam&limit=30`
        : `${server}/json/stations/bytag/malayalam?limit=40&order=votes&reverse=true`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: { 'User-Agent': 'MalayalamRadioWeb/1.0' }
      });
      clearTimeout(timeoutId);

      if (!response.ok) continue;

      const data: RadioBrowserItem[] = await response.json();
      if (!Array.isArray(data) || data.length === 0) continue;

      return data
        .filter(item => item.url_resolved || item.url)
        .map((item, index) => {
          const isAac = item.codec?.toLowerCase().includes('aac');
          const isHls = item.url_resolved?.includes('.m3u8') || item.url?.includes('.m3u8');
          
          let category: RadioStation['category'] = 'online';
          const lowerName = (item.name + ' ' + item.tags).toLowerCase();
          if (lowerName.includes('air') || lowerName.includes('akashvani')) {
            category = 'air';
          } else if (lowerName.includes('community') || lowerName.includes('campus') || lowerName.includes('village')) {
            category = 'community';
          } else if (lowerName.includes('bhakthi') || lowerName.includes('devotional') || lowerName.includes('christian') || lowerName.includes('hindu') || lowerName.includes('quran') || lowerName.includes('shalom') || lowerName.includes('jesus')) {
            category = 'devotional';
          } else {
            category = 'online';
          }

          const gradients = [
            'from-amber-500 to-red-600',
            'from-emerald-500 to-teal-700',
            'from-blue-600 to-indigo-800',
            'from-fuchsia-600 to-pink-700',
            'from-violet-600 to-purple-800',
            'from-cyan-600 to-blue-800',
            'from-orange-500 to-amber-700'
          ];

          return {
            id: `rb-${item.stationuuid || index}`,
            name: item.name || 'Malayalam Radio Station',
            streamUrl: item.url_resolved || item.url,
            fallbackUrls: item.url !== item.url_resolved ? [item.url] : [],
            category,
            frequency: item.bitrate ? `${item.bitrate} kbps` : 'Live Online',
            location: item.state || item.country || 'Kerala / Worldwide',
            bitrate: `${item.bitrate || 128} kbps ${item.codec || 'MP3'}`,
            logo: item.favicon || undefined,
            gradient: gradients[index % gradients.length],
            description: `Live Malayalam stream from ${item.country || 'Kerala'}. Votes: ${item.votes || 0}`,
            tags: item.tags ? item.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 4) : ['Malayalam', 'Live'],
            codec: isHls ? 'hls' : isAac ? 'aac' : 'mp3'
          };
        });
    } catch {
      // try next server
      continue;
    }
  }
  return [];
}
