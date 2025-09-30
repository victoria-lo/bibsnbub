import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <svg
        width="180"
        height="180"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="24" height="24" rx="4" fill="#ffffff" />
        <circle cx="12" cy="7" r="4" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 22a7 7 0 0 1 14 0" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 11.5c.9.9 5.1.9 6 0" stroke="#0f172a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    {
      ...size,
    },
  );
}
