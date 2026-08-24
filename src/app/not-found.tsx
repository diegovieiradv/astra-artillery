'use client';

import Link from 'next/link';
import { useI18n } from '@/hooks/useI18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center px-4">
        <div className="text-8xl font-bold text-cyan-500 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-4">{t('notFound.title')}</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          {t('notFound.description')}
        </p>

        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
          >
            {t('notFound.backToHome')}
          </Link>
          <Link
            href="/game"
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-lg transition-colors"
          >
            {t('notFound.play')}
          </Link>
        </div>
      </div>
    </div>
  );
}
