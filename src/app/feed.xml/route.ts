import { fetchPosts, stripHtml, getPostImage } from '@/lib/wordpress';
import { getFallbackImageUrl } from '@/lib/utils';

export async function GET() {
  const posts = await fetchPosts(20).catch(() => []);
  const baseUrl = 'https://news.ac878.com.au';

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>878时讯 | AC878 News</title>
    <description>澳洲华语新闻门户 - 提供澳洲本地、财经、中港及国际新闻资讯</description>
    <link>${baseUrl}</link>
    <language>zh-cn</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <managingEditor>news@ac878.com.au (AC878 News Team)</managingEditor>
    <webMaster>webmaster@ac878.com.au (AC878 Technical Team)</webMaster>
    <image>
      <url>https://ac878.com.au/wp-content/uploads/2025/02/1024x1024.png</url>
      <title>878时讯 | AC878 News</title>
      <link>${baseUrl}</link>
      <description>878时讯 Logo</description>
      <width>144</width>
      <height>144</height>
    </image>
    ${posts
      .map(
        (post) => {
          const image = getPostImage(post) || getFallbackImageUrl();
          return `
    <item>
      <title><![CDATA[${stripHtml(post.title.rendered)}]]></title>
      <description><![CDATA[${stripHtml(post.excerpt.rendered).slice(0, 300)}]]></description>
      <link>${baseUrl}/post/${post.slug}</link>
      <guid isPermaLink="true">${baseUrl}/post/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <category>News</category>
      <source url="${baseUrl}/feed.xml">878时讯</source>
      <enclosure url="${image}" type="image/jpeg" length="0"/>
    </item>`;
        }
      )
      .join('')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600', // Cache for 1 hour
    },
  });
}