import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: Props) {
  if (items.length <= 1) return null;

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="面包屑导航">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 text-gray-400 mx-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}
          
          {item.href ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-accent transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-800 font-medium truncate max-w-xs">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}