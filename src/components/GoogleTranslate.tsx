'use client';

import { useEffect, useState } from 'react';

export default function GoogleTranslate() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Prevent duplicate initialization
    if ((window as any).__googleTranslateLoaded) return;
    (window as any).__googleTranslateLoaded = true;

    // Define the callback before loading the script
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
            'google_translate_element'
          );
          setLoaded(true);
        }
      } catch (e) {
        console.error('Google Translate init error:', e);
      }
    };

    // Load script via a regular script tag in head (more reliable than dynamic append)
    const existingScript = document.getElementById('google-translate-script');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error('Failed to load Google Translate script');
      setLoaded(false);
    };
    document.head.appendChild(script);

    return () => {
      (window as any).__googleTranslateLoaded = false;
    };
  }, []);

  return (
    <div 
      id="google_translate_element" 
      className="google-translate-wrapper"
      suppressHydrationWarning
    />
  );
}
