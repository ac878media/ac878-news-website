'use client';

import { useState } from 'react';
import { copyToClipboard, getWhatsAppShareUrl } from '@/lib/utils';

interface Props {
  url: string;
  title: string;
  className?: string;
}

export default function ShareButtons({ url, title, className = '' }: Props) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWeChatShare = () => {
    // For WeChat, we'll just copy the link since direct sharing requires WeChat API integration
    handleCopy();
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <span className="text-sm text-gray-500 font-medium">分享：</span>
      
      {/* WeChat */}
      <button
        onClick={handleWeChatShare}
        className="flex items-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors text-sm"
        title="分享到微信"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.284c-.019.065-.044.139-.026.195.021.051.1.048.157.031l1.421-.442a.59.59 0 0 1 .518.048c.721.4 1.555.618 2.415.618.266 0 .531-.016.781-.046-.062-.2-.098-.418-.098-.644C8.003 13.415 11.57 10.5 15.99 10.5c.266 0 .531.016.781.046C16.194 4.963 13.078 2.188 8.691 2.188zm-2.434 5.991a.789.789 0 0 1-.787-.787c0-.435.354-.788.787-.788s.787.353.787.788-.354.787-.787.787zm4.434 0a.789.789 0 0 1-.787-.787c0-.435.354-.788.787-.788s.787.353.787.788-.354.787-.787.787z"/>
          <path d="M23.7 16.228c0-3.361-3.009-6.085-6.711-6.085s-6.711 2.724-6.711 6.085 3.009 6.085 6.711 6.085c.408 0 .81-.04 1.199-.115a.59.59 0 0 1 .518.048l1.421.442c.057.017.136.02.157-.031.018-.056-.007-.13-.026-.195l-.39-1.284a.59.59 0 0 1 .213-.665c1.832-1.347 3.002-3.338 3.002-5.55z"/>
        </svg>
        微信
      </button>

      {/* WhatsApp */}
      <a
        href={getWhatsAppShareUrl(url, title)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
        title="分享到WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.864 3.687"/>
        </svg>
        WhatsApp
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${
          copied 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="复制链接"
      >
        {copied ? (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            已复制
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            复制链接
          </>
        )}
      </button>
    </div>
  );
}