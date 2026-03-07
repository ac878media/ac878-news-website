'use client';

import { useState, useRef } from 'react';

function FooterLivePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio('https://stream4.rcast.net/71937/');
      audio.volume = 0.8;
      audio.addEventListener('playing', () => { setIsLoading(false); setIsPlaying(true); });
      audio.addEventListener('waiting', () => setIsLoading(true));
      audio.addEventListener('error', () => { setIsLoading(false); setIsPlaying(false); });
      audioRef.current = audio;
    }
    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      if (!audioRef.current.src || audioRef.current.src === '') {
        audioRef.current.src = 'https://stream4.rcast.net/71937/';
      }
      audioRef.current.play().catch(() => { setIsLoading(false); setIsPlaying(false); });
    }
  };

  return (
    <button
      onClick={togglePlay}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
        isPlaying ? 'bg-accent text-white shadow-lg shadow-accent/30' : 'bg-accent hover:bg-accent-dark text-white'
      }`}
    >
      {isLoading ? (
        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
      )}
      {isPlaying ? '● LIVE FM 87.8' : '▶ FM 87.8 Live 直播'}
    </button>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-gray-400 mt-12">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">878时讯 | AC878 News</h3>
            <p className="text-sm leading-relaxed">
              悉尼首个24小时华语FM电台，为澳洲华人社区提供最新新闻、财经、社区资讯。
            </p>
          </div>

          {/* Live Radio */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">📻 收听直播</h3>
            <FooterLivePlayer />
          </div>

          {/* Download App */}
          <div>
            <h3 className="text-white text-lg font-bold mb-2">📱 下载APP</h3>
            <div className="flex flex-col gap-3">
              <a
                href="https://apps.apple.com/au/app/ac878-australian-chinese-radio/id6741985210"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm w-fit"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                App Store
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=appac878comau.wpapp&hl=en"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg transition-colors text-sm w-fit"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.18 23.48c-.42-.25-.68-.7-.68-1.2V1.72c0-.5.26-.95.68-1.2l11.6 11.48-11.6 11.48zM14.54 12L4.5 1.96l12.35 6.92L14.54 12zm0 0l2.31-3.04L4.5 22.04 14.54 12zm4.69-1.44l-2.69 1.72L14.54 12l2-2.56 2.69 1.68a1.2 1.2 0 010 2.08l-2.69 1.36L14.54 12l2-2.56 2.69 1.12z"/>
                </svg>
                Google Play
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center text-sm">
          <p>© 2026 AC878 Media Group Pty Ltd</p>
          <p className="mt-1 text-gray-500">Suite 11, 89-97 Jones St, Ultimo NSW 2007</p>
        </div>
      </div>
    </footer>
  );
}
