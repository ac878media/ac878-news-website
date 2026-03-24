import Image from 'next/image';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata = {
  title: '关于我们 | 878时讯',
  description: '878时讯 - AC878 Media Group Pty Ltd，澳洲华语新闻门户，为华人社区提供及时准确的新闻资讯。',
  alternates: {
    canonical: 'https://news.ac878.com.au/about',
  },
  openGraph: {
    title: '关于我们 | 878时讯',
    description: '了解878时讯，澳洲华语新闻门户',
    type: 'website',
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { label: '首页', href: '/' },
    { label: '关于我们' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} className="mb-6" />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-8 text-center">
          <Image
            src="https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png"
            alt="AC878 Logo"
            width={120}
            height={120}
            className="rounded-xl mx-auto mb-6"
          />
          <h1 className="text-3xl font-bold mb-2">878时讯</h1>
          <p className="text-xl text-gray-200 mb-2">AC878 News</p>
          <p className="text-gray-300">澳洲华语新闻门户</p>
        </div>

        <div className="p-8 space-y-8">
          {/* About Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full"></div>
              关于我们
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                878时讯是由AC878 Media Group Pty Ltd运营的澳洲华语新闻门户网站，致力于为澳洲华人社区提供及时、准确、全面的新闻资讯服务。我们深耕华语新闻领域，以专业的新闻团队和先进的技术平台，为读者带来最新的澳洲本地、商业财经、中港以及国际新闻。
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                作为澳洲华语媒体的重要一员，我们秉承"及时、客观、专业"的新闻理念，为澳洲华人社区构建了一个获取权威资讯的重要平台。无论是澳洲政策变化、经济动态，还是中国发展动向、国际时事，我们都以华人视角提供深度解读。
              </p>
            </div>
          </section>

          {/* Services Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full"></div>
              我们的服务
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                    📰
                  </div>
                  <h3 className="text-lg font-semibold">新闻资讯</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  涵盖澳洲本地、财经商业、中港新闻、国际时事四大板块，为华人读者提供全方位新闻覆盖。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                    🎙️
                  </div>
                  <h3 className="text-lg font-semibold">新闻播报</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  提供每日新闻播报服务，方便繁忙的读者通过听觉获取最新资讯。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                    📱
                  </div>
                  <h3 className="text-lg font-semibold">移动优先</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  响应式设计，完美适配手机、平板、电脑等各种设备，随时随地获取新闻。
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-accent text-white rounded-lg flex items-center justify-center">
                    🔍
                  </div>
                  <h3 className="text-lg font-semibold">智能搜索</h3>
                </div>
                <p className="text-gray-600 text-sm">
                  强大的搜索功能，帮助读者快速找到感兴趣的新闻内容和历史资讯。
                </p>
              </div>
            </div>
          </section>

          {/* Company Info */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full"></div>
              公司信息
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg">
              <dl className="grid md:grid-cols-2 gap-4">
                <div>
                  <dt className="font-semibold text-gray-700 mb-1">公司名称</dt>
                  <dd className="text-gray-600">AC878 Media Group Pty Ltd</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700 mb-1">品牌名称</dt>
                  <dd className="text-gray-600">878时讯 | AC878 News</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700 mb-1">公司地址</dt>
                  <dd className="text-gray-600">Suite 11, 89-97 Jones St, Ultimo NSW 2007</dd>
                </div>
                <div>
                  <dt className="font-semibold text-gray-700 mb-1">成立时间</dt>
                  <dd className="text-gray-600">2025年</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Mission Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <div className="w-1 h-8 bg-accent rounded-full"></div>
              使命愿景
            </h2>
            <div className="bg-gradient-to-r from-accent/5 to-orange-500/5 p-6 rounded-lg border-l-4 border-accent">
              <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                我们的使命是成为澳洲华人社区最值得信赖的新闻资讯平台，通过专业、客观、及时的新闻报道，帮助华人更好地了解澳洲社会，促进中澳文化交流与理解。
              </p>
              <p className="text-gray-600 leading-relaxed">
                我们致力于打造一个连接澳洲与中国、传统与现代、本地与全球的新闻桥梁，为澳洲华人社区的发展贡献力量。
              </p>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center border-t pt-8">
            <h2 className="text-xl font-bold mb-4">联系我们</h2>
            <p className="text-gray-600 mb-6">
              如有新闻线索、合作意向或其他咨询，欢迎与我们联系。
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-dark text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m0 0V11a1 1 0 011-1h2a1 1 0 011 1v10m0 0h3a1 1 0 001-1V10M9 21h6" />
                </svg>
                返回首页
              </Link>
              <Link
                href="/listen"
                className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                收听新闻
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}