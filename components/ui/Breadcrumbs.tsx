import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-[11px] sm:text-xs font-bold uppercase tracking-[0.15em] text-black/40 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap pb-2 sm:pb-0 scrollbar-hide">
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center space-x-2 shrink-0">
          {index > 0 && <ChevronRight className="size-3 text-black/20" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-black transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-black">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
