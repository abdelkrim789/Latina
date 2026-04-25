'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { EntryExperience } from '@/components/EntryExperience';
import { HomeExperience } from '@/components/HomeExperience';

export default function LocalizedHomePage() {
  const [entered, setEntered] = useState(false);
  const locale = useLocale();
  const t = useTranslations('home');

  return (
    <>
      <EntryExperience
        locale={locale}
        prompt={t('entryPrompt')}
        skip={t('skip')}
        onComplete={() => setEntered(true)}
      />
      <HomeExperience locale={locale} hidden={!entered} />
    </>
  );
}
