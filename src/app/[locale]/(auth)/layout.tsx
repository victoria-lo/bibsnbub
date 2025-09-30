import { routing } from '@/libs/i18nRouting';
import { enUS, zhCN } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { setRequestLocale } from 'next-intl/server';

export default async function AuthLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  let clerkLocale = enUS;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let userProfileUrl = '/user-profile';
  let afterSignOutUrl = '/';

  if (locale === 'zh') {
    clerkLocale = zhCN;
  }

  if (locale !== routing.defaultLocale) {
    signInUrl = `/${locale}${signInUrl}`;
    signUpUrl = `/${locale}${signUpUrl}`;
    userProfileUrl = `/${locale}${userProfileUrl}`;
    afterSignOutUrl = `/${locale}${afterSignOutUrl}`;
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={userProfileUrl}
      signUpFallbackRedirectUrl={userProfileUrl}
      afterSignOutUrl={afterSignOutUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}
