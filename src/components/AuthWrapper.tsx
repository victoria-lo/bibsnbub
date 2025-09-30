'use client';

import DesktopNavigation from '@/components/DesktopNavigation';
import MobileNavigation from '@/components/MobileNavigation';
import { useAuth } from '@clerk/nextjs';

type AuthWrapperProps = {
  children: React.ReactNode;
  currentLocale: string;
  availableLocales: string[];
};

export default function AuthWrapper({
  children,
  currentLocale,
  availableLocales,
}: AuthWrapperProps) {
  const { isSignedIn } = useAuth();

  return (
    <>
      <DesktopNavigation
        isLoggedIn={isSignedIn ?? false}
        currentLocale={currentLocale}
        availableLocales={availableLocales}
      />
      <MobileNavigation
        isLoggedIn={isSignedIn ?? false}
        currentLocale={currentLocale}
        availableLocales={availableLocales}
      />
      {children}
    </>
  );
}
