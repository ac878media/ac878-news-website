import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET || 'ac878-revalidate-2026';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, slug, paths, tag } = body;

    // Verify secret
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
    }

    const revalidated: string[] = [];

    // Revalidate specific post by slug
    if (slug) {
      revalidatePath(`/post/${slug}`);
      revalidated.push(`/post/${slug}`);
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      for (const path of paths) {
        revalidatePath(path);
        revalidated.push(path);
      }
    }

    // Revalidate by tag
    if (tag) {
      revalidateTag(tag);
      revalidated.push(`tag:${tag}`);
    }

    // Always revalidate homepage (shows latest posts)
    revalidatePath('/');
    revalidated.push('/');

    // Revalidate category pages
    for (const cat of ['australia', 'china-hk', 'finance', 'international', 'community']) {
      revalidatePath(`/category/${cat}`);
      revalidated.push(`/category/${cat}`);
    }

    return NextResponse.json({
      revalidated: true,
      paths: revalidated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to revalidate', details: String(error) },
      { status: 500 }
    );
  }
}

// Also support GET for simple revalidation (with secret as query param)
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const slug = request.nextUrl.searchParams.get('slug');

  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (slug) {
    revalidatePath(`/post/${slug}`);
  }
  revalidatePath('/');

  return NextResponse.json({
    revalidated: true,
    slug: slug || 'all',
    timestamp: new Date().toISOString(),
  });
}
