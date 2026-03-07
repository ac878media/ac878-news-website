'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [fname, setFname] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // Submit to WordPress MC4WP endpoint
      const formData = new FormData();
      formData.append('FNAME', fname);
      formData.append('EMAIL', email);
      formData.append('_mc4wp_form_id', '15871');
      formData.append('_mc4wp_form_element_id', 'mc4wp-form-1');
      formData.append('_mc4wp_timestamp', String(Math.floor(Date.now() / 1000)));

      const res = await fetch('https://ac878.com.au/', {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      });

      // With no-cors we can't read the response, but the request goes through
      setStatus('success');
      setFname('');
      setEmail('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl p-6 border border-gray-800">
      <h3 className="text-white font-bold text-lg mb-1">📧 订阅电子报</h3>
      <p className="text-gray-400 text-sm mb-4">Subscribe to AC878 Newsletter</p>

      {status === 'success' ? (
        <div className="bg-green-900/30 border border-green-800 rounded-lg p-4 text-center">
          <p className="text-green-400 font-medium">✅ 订阅成功！</p>
          <p className="text-green-500 text-sm mt-1">Thank you for subscribing!</p>
          <button
            onClick={() => setStatus('idle')}
            className="text-gray-400 text-xs mt-2 hover:text-white transition-colors"
          >
            再次订阅 Subscribe another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              placeholder="姓名 Name"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="电子邮箱 Email"
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'loading' ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                提交中...
              </span>
            ) : status === 'error' ? (
              '❌ 请重试 Try again'
            ) : (
              '订阅 Subscribe'
            )}
          </button>
          <p className="text-gray-600 text-xs text-center">我们尊重您的隐私，不会发送垃圾邮件。</p>
        </form>
      )}
    </div>
  );
}
