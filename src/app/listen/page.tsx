import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '收听新闻 Listen',
  description: '收听878时讯每日新闻广播。Listen to AC878 daily news bulletins.',
  alternates: {
    canonical: 'https://news.ac878.com.au/listen',
  },
};

const WP_API = 'https://ac878.com.au/wp-json/wp/v2';

interface AudioFile {
  id: number;
  source_url: string;
  title: { rendered: string };
  date: string;
}

async function fetchTodayAudio(): Promise<AudioFile[]> {
  try {
    const res = await fetch(
      `${WP_API}/media?media_type=audio&per_page=20&orderby=date&order=desc&search=878news`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

function groupByDate(files: AudioFile[]): Record<string, AudioFile[]> {
  const groups: Record<string, AudioFile[]> = {};
  for (const f of files) {
    const date = f.date.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(f);
  }
  return groups;
}

const PART_LABELS: Record<string, string> = {
  'part1': '📊 财经快讯 Breaking & Finance',
  'part2': '🇦🇺 澳洲新闻 Australian News & Weather',
  'part3': '🇨🇳 中港新闻 China & HK News',
  'part4': '🌍 国际新闻 International News',
};

function getPartLabel(url: string): string {
  for (const [key, label] of Object.entries(PART_LABELS)) {
    if (url.includes(key)) return label;
  }
  return '新闻广播 News Bulletin';
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+11:00');
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timeZone: 'Australia/Sydney',
  });
}

export default async function ListenPage() {
  const audioFiles = await fetchTodayAudio();
  const grouped = groupByDate(audioFiles);
  const dates = Object.keys(grouped).sort().reverse();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🎙️ 收听新闻 Listen</h1>
        <p className="text-gray-400">每日新闻广播 · Daily News Bulletins</p>
      </div>

      {dates.length === 0 ? (
        <div className="bg-zinc-900 rounded-lg p-8 text-center text-gray-400">
          <p className="text-xl mb-2">暂无音频</p>
          <p>No audio bulletins available yet. Check back after 8am AEST.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {dates.map((date) => (
            <section key={date}>
              <h2 className="text-xl font-semibold mb-4 text-red-500 border-b border-zinc-800 pb-2">
                {formatDate(date)}
              </h2>
              
              {/* Morning Section */}
              {grouped[date].some(f => f.source_url.includes('morning')) && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 text-gray-300">
                    ☀️ 早间新闻 Morning Bulletin
                  </h3>
                  <div className="space-y-4">
                    {grouped[date]
                      .filter(f => f.source_url.includes('morning'))
                      .sort((a, b) => a.source_url.localeCompare(b.source_url))
                      .map((file) => (
                        <div
                          key={file.id}
                          className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
                        >
                          <p className="font-medium mb-2">{getPartLabel(file.source_url)}</p>
                          <audio
                            controls
                            preload="none"
                            className="w-full"
                            style={{ height: '40px' }}
                          >
                            <source src={file.source_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Evening Section */}
              {grouped[date].some(f => f.source_url.includes('evening')) && (
                <div>
                  <h3 className="text-lg font-medium mb-3 text-gray-300">
                    🌙 晚间新闻 Evening Bulletin
                  </h3>
                  <div className="space-y-4">
                    {grouped[date]
                      .filter(f => f.source_url.includes('evening'))
                      .sort((a, b) => a.source_url.localeCompare(b.source_url))
                      .map((file) => (
                        <div
                          key={file.id}
                          className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
                        >
                          <p className="font-medium mb-2">{getPartLabel(file.source_url)}</p>
                          <audio
                            controls
                            preload="none"
                            className="w-full"
                            style={{ height: '40px' }}
                          >
                            <source src={file.source_url} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Uncategorized audio */}
              {grouped[date].some(f => !f.source_url.includes('morning') && !f.source_url.includes('evening')) && (
                <div className="space-y-4">
                  {grouped[date]
                    .filter(f => !f.source_url.includes('morning') && !f.source_url.includes('evening'))
                    .map((file) => (
                      <div
                        key={file.id}
                        className="bg-zinc-900 rounded-lg p-4 hover:bg-zinc-800 transition-colors"
                      >
                        <p className="font-medium mb-2">{getPartLabel(file.source_url)}</p>
                        <audio
                          controls
                          preload="none"
                          className="w-full"
                          style={{ height: '40px' }}
                        >
                          <source src={file.source_url} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
