'use client';

import { useState, useRef, useEffect } from 'react';

export default function LivePlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio('https://stream4.rcast.net/71937/');
      audio.volume = volume / 100;
      audio.addEventListener('playing', () => {
        setIsLoading(false);
        setIsPlaying(true);
      });
      audio.addEventListener('waiting', () => setIsLoading(true));
      audio.addEventListener('error', () => {
        setIsLoading(false);
        setIsPlaying(false);
      });
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
      audioRef.current.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  };

  return (
    <button
      onClick={togglePlay}
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
        isPlaying
          ? 'bg-accent text-white shadow-lg shadow-accent/30'
          : 'bg-gray-800 text-white hover:bg-gray-700'
      }`}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : isPlaying ? (
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
        </span>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      )}
      {isPlaying ? '● LIVE FM 87.8' : '▶ FM 87.8 直播'}
    </button>
  );
}

// Floating sticky player that shows when playing and user scrolls past the top banner
export function FloatingPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolume] = useState(80);
  const [showFloat, setShowFloat] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const onScroll = () => {
      // Show floating player when scrolled past 100px and audio is playing
      setShowFloat(window.scrollY > 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) {
      const audio = new Audio('https://stream4.rcast.net/71937/');
      audio.volume = volume / 100;
      audio.addEventListener('playing', () => {
        setIsLoading(false);
        setIsPlaying(true);
      });
      audio.addEventListener('waiting', () => setIsLoading(true));
      audio.addEventListener('error', () => {
        setIsLoading(false);
        setIsPlaying(false);
      });
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
      audioRef.current.play().catch(() => {
        setIsLoading(false);
        setIsPlaying(false);
      });
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = Number(e.target.value);
    setVolume(v);
    if (audioRef.current) {
      audioRef.current.volume = v / 100;
    }
  };

  // Only render floating bar when playing
  if (!isPlaying && !isLoading) {
    return (
      <>
        {/* This is the inline button used in the TopBanner */}
        <button
          onClick={togglePlay}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-800 text-white hover:bg-gray-700 transition-all"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          ▶ FM 87.8 直播
        </button>
      </>
    );
  }

  return (
    <>
      {/* Inline button in TopBanner */}
      <button
        onClick={togglePlay}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium bg-accent text-white shadow-lg shadow-accent/30 transition-all"
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
        )}
        ● LIVE FM 87.8
      </button>

      {/* Floating sticky bar — visible when scrolled and playing */}
      {showFloat && !minimized && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/95 backdrop-blur-md border-t border-gray-800 shadow-2xl animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Stop */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 bg-accent rounded-full flex items-center justify-center hover:bg-accent-dark transition-colors flex-shrink-0"
              >
                {isLoading ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                )}
              </button>

              {/* Live indicator + station info */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <span className="text-white font-bold text-sm">LIVE</span>
                  <span className="text-gray-400 text-sm">FM 87.8</span>
                </div>
                <p className="text-gray-500 text-xs">AC878 24小时华语电台</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Volume slider (desktop only) */}
              <div className="hidden sm:flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                </svg>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={handleVolume}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Minimize */}
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized(true); }}
                className="text-gray-500 hover:text-white transition-colors p-1"
                title="最小化"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Minimized floating pill */}
      {showFloat && minimized && (
        <button
          onClick={() => setMinimized(false)}
          className="fixed bottom-4 right-4 z-[100] bg-accent text-white rounded-full px-4 py-2 shadow-2xl shadow-accent/30 flex items-center gap-2 text-sm font-medium hover:bg-accent-dark transition-all animate-slide-up"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          LIVE FM 87.8
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </>
  );
}
