'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function BackButton({ label }: { label?: string }) {
  const router = useRouter();
  const t = useTranslations('Navigation');
  const computedLabel = label ?? t('back');
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 active:opacity-80"
      aria-label={computedLabel}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{computedLabel}</span>
    </button>
  );
}
