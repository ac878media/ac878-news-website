'use client';

import { useEffect, useState, useRef } from 'react';

const LANGUAGES = [
  { code: '', label: '简体中文', flag: '🇨🇳' },
  { code: 'zh-TW', label: '繁體中文', flag: '🇭🇰' },
  { code: 'en', label: 'English', flag: '🇦🇺' },
];

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  // Read current language from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/googtrans=([^;]+)/);
    if (match) {
      const lang = match[1].split('/').pop() || '';
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

  // Load Google Translate script once
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    (window as any).googleTranslateElementInit = () => {
      try {
        const google = (window as any).google;
        if (google?.translate) {
          new google.translate.TranslateElement(
            { pageLanguage: 'zh-CN', includedLanguages: 'en,zh-CN,zh-TW', autoDisplay: false },
            'google_translate_element_hidden'
          );
        }
      } catch (e) { /* silent */ }
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.head.appendChild(script);
  }, []);

  // Position dropdown
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed' as const,
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
        zIndex: 99999,
      });
    }
  }, [isOpen]);

  const selectLanguage = (langCode: string) => {
    setIsOpen(false);

    // Clear ALL googtrans cookies on every possible domain first
    const hostname = window.location.hostname;
    const parentDomain = '.' + hostname.split('.').slice(-2).join('.');
    const domains = ['', hostname, '.' + hostname, parentDomain];
    domains.forEach(d => {
      let c = 'googtrans=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      if (d) c += ';domain=' + d;
      document.cookie = c;
    });

    if (!langCode) {
      // Reset to Chinese — cookies cleared above, just reload
      window.location.reload();
      return;
    }

    // Set cookie on both current hostname and parent domain
    const value = `/zh-CN/${langCode}`;
    const expires = new Date(Date.now() + 30 * 86400000).toUTCString();
    document.cookie = `googtrans=${value};expires=${expires};path=/`;
    document.cookie = `googtrans=${value};expires=${expires};path=/;domain=${parentDomain}`;

    // Try programmatic trigger first, fall back to reload
    const combo = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (combo) {
      combo.value = langCode;
      combo.dispatchEvent(new Event('change'));
      setCurrentLang(langCode);
    } else {
      window.location.reload();
    }
  };

  const currentLangObj = LANGUAGES.find(l => l.code === currentLang) || LANGUAGES[0];

  return (
    <>
      <div id="google_translate_element_hidden" style={{ display: 'none' }} />
      <div ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 text-gray-600 hover:text-[#da2d2d] transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          aria-label="Select language"
        >
          <span className="text-sm">{currentLangObj.flag}</span>
          <span className="text-xs">{currentLangObj.label}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isOpen && (
          <div style={dropdownStyle} className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[160px]">
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
