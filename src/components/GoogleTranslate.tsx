'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, element: string) => unknown;
        TranslateElement: {
          InlineLayout: { SIMPLE: number };
        };
      };
    };
  }
}

export default function GoogleTranslate() {
  useEffect(() => {
    // Prevent duplicate initialization
    if (document.getElementById('google-translate-script')) return;

    window.googleTranslateElementInit = () => {
      new window.google!.translate.TranslateElement(
        {
          pageLanguage: 'zh-CN',
          includedLanguages: 'en,zh-CN,zh-TW,ja,ko,vi,th,id,ms',
          layout: (window.google!.translate.TranslateElement as any).InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        'google_translate_element'
      );
    };

    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div id="google_translate_element" className="google-translate-wrapper" />
  );
}
