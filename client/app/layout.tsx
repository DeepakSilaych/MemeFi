'use client';

import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { WalletProvider } from './context/WalletContext';
import Navbar from './components/Navbar';
import theme from './theme/theme';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WalletProvider>
            <Navbar />
            <Box component="main" sx={{ 
              minHeight: 'calc(100vh - 80px)',
              background: 'linear-gradient(180deg, #0A0B0D 0%, #13151A 100%)',
            }}>
              {children}
            </Box>
          </WalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
