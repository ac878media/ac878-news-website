'use client';

import { useEffect, useState, useRef } from 'react';

const LANGUAGES = [
  { code: '', label: '中文', flag: '🇨🇳' },
  { code: 'en', label: 'English', flag: '🇦🇺' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇹🇼' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th', label: 'ไทย', flag: '🇹🇭' },
  { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
  { code: 'ms', label: 'Melayu', flag: '🇲🇾' },
];

function setCookie(name: string, value: string, days: number) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;domain=${window.location.hostname}`;
  // Also set on parent domain
  const parts = window.location.hostname.split('.');
  if (parts.length > 2) {
    const parent = '.' + parts.slice(-2).join('.');
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/;domain=${parent}`;
  }
}

function getCookie(name: string): string {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : '';
}

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('');
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Read current language from cookie on mount
  useEffect(() => {
    const googtrans = getCookie('googtrans');
    if (googtrans) {
      const lang = googtrans.split('/').pop() || '';
      setCurrentLang(lang === 'zh-CN' ? '' : lang);
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Load Google Translate script (hidden, used for actual translation)
  useEffect(() => {
    if ((window as any).__googleTranslateLoaded) {
      setScriptLoaded(true);
      return;
    }

    (window as any).__googleTranslateLoaded = true;
    (window as any).googleTranslateElementInit = () => {
      try {
        const google = (window as any).google;
        if (google && google.translate) {
          new google.translate.TranslateElement(
            {
              pageLanguage: 'zh-CN',
              includedLanguages: 'en,zh-CN,zh-TW,ja,ko,vi,th,id,ms',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            },
            'google_translate_element_hidden'
          );
          setScriptLoaded(true);
        }
      } catch (e) {
        console.error('Google Translate init error:', e);
      }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      (window as any).__googleTranslateLoaded = false;
    };
  }, []);

  const selectLanguage = (langCode: string) => {
    setCurrentLang(langCode);
    setIsOpen(false);

    if (!langCode || langCode === 'zh-CN') {
      // Reset to original Chinese
      setCookie('googtrans', '', -1);
      // Remove Google Translate bar and restore page
      const frame = document.querySelector('.skiptranslate') as HTMLElement;
      if (frame) frame.style.display = 'none';
      document.body.style.top = '0px';
      // Reload to clear translation
      window.location.reload();
      return;
    }

    // Set the translation cookie
    setCookie('googtrans', `/zh-CN/${langCode}`, 30);

    // Try to trigger Google Translate programmatically
    const selectEl = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (selectEl) {
      selectEl.value = langCode;
      selectEl.dispatchEvent(new Event('change'));
    } else {
      // If widget not ready, reload with cookie set
      window.location.reload();
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      {/* Hidden container for Google Translate widget */}
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
      
      {/* Custom language selector */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#da2d2d] transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          aria-label="Select language"
        >
          <span className="text-sm">{currentLangObj.flag}</span>
          <span className="text-xs">{currentLangObj.label}</span>
          <svg
            className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 min-w-[160px]">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  currentLang === lang.code ? 'text-[#da2d2d] font-medium bg-red-50' : 'text-gray-700'
                }`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
                {currentLang === lang.code && (
                  <svg className="w-4 h-4 ml-auto text-[#da2d2d]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
