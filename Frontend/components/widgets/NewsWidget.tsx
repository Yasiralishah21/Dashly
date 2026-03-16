
"use client";

import { useEffect, useState } from "react";

/**
 * NewsWidget: Fetches latest news from /api/news. Shows 3 headlines by default,
 * then "Show more" with dropdown to expand and see all.
 */

type Article = { title: string; url: string; source: string };

const VISIBLE_INITIAL = 3;

interface NewsWidgetProps {
  /** City from Home flow; news query includes city when set. */
  city?: string | null;
}

export default function NewsWidget({ city }: NewsWidgetProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const url = city
        ? `/api/news?city=${encodeURIComponent(city)}`
        : "/api/news";
      const res = await fetch(url);
      const data = await res.json();
      if (data.articles) setArticles(data.articles);
    } catch (err) {
      console.error("Failed to fetch news", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [city]);

  const showExpand = articles.length > VISIBLE_INITIAL;
  const visibleArticles = expanded
    ? articles
    : articles.slice(0, VISIBLE_INITIAL);

  return (
    <div className="card-hover rounded-xl border border-slate-400 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/50">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        Top Headlines
        <button
          type="button"
          onClick={fetchNews}
          className="btn-secondary ml-2 py-1 px-2 text-xs"
        >
          Refresh
        </button>
      </h3>
      <ul className="space-y-3">
        {visibleArticles.map((article, i) => (
          <li key={i}>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-lg p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/50"
            >
              <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                {article.title}
              </p>
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {article.source}
              </p>
            </a>
          </li>
        ))}
        {loading && <li className="text-xs text-slate-500">Loading...</li>}
      </ul>
      {showExpand && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="btn-secondary mt-2 flex w-full items-center justify-center gap-1 py-2 text-sm"
          aria-expanded={expanded}
        >
          {expanded ? (
            <>
              Show less
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Show more ({articles.length - VISIBLE_INITIAL} more)
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      )}
    </div>
  );
}