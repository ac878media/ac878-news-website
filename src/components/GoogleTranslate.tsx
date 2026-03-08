'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    if (document.getElementById('google-translate-script')) return;

    (window as any).googleTranslateElementInit = () => {
      const google = (window as any).google;
      new google.translate.TranslateElement(
        {
          pageLanguage: 'zh-CN',
          includedLanguages: 'en,zh-CN,zh-TW,ja,ko,vi,th,id,ms',
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
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
