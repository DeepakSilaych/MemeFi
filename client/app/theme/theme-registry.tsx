'use client';

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './emotion-cache';
import theme from './theme';
import { outfit, spaceGrotesk, inter } from '../styles/fonts';

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={`${outfit.variable} ${spaceGrotesk.variable} ${inter.variable}`}>
          {children}
        </div>
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
