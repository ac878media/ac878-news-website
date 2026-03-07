import { WPPost } from '@/lib/wordpress';
import { PostCardLarge, PostCardSmall } from './PostCard';

interface Props {
  id: string;
  title: string;
  subtitle: string;
  posts: WPPost[];
}

export default function CategorySection({ id, title, subtitle, posts }: Props) {
  if (posts.length === 0) return null;

  const [featured, ...rest] = posts;

  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 bg-accent rounded-full"></div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <PostCardLarge post={featured} />
        <div className="space-y-3">
          {rest.map((post) => (
            <PostCardSmall key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
