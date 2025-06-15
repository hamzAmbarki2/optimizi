import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  shadows: Array(25).fill('none').map((_, index) => {
    if (index === 0) return 'none'; // Elevation 0 is 'none'
    // Define custom shadows for each level; this is a simplified version
    return `0px ${index}px ${index * 2}px rgba(0, 0, 0, 0.1)`;
  }),

  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#60a5fa',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#a78bfa',
      dark: '#5b21b6',
      contrastText: '#ffffff',
    },
    success: {
      main: '#059669',
      light: '#34d399',
      dark: '#047857',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#d97706',
      light: '#fbbf24',
      dark: '#b45309',
      contrastText: '#ffffff',
    },
    error: {
      main: '#dc2626',
      light: '#f87171',
      dark: '#b91c1c',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0284c7',
      light: '#38bdf8',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    grey: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 1px 5px rgba(0, 0, 0, 0.06), 0px 2px 5px rgba(0, 0, 0, 0.1)',
    '0px 1px 8px rgba(0, 0, 0, 0.06), 0px 3px 7px rgba(0, 0, 0, 0.1)',
    '0px 2px 10px rgba(0, 0, 0, 0.06), 0px 4px 9px rgba(0, 0, 0, 0.1)',
    '0px 3px 12px rgba(0, 0, 0, 0.06), 0px 5px 11px rgba(0, 0, 0, 0.1)',
    '0px 3px 14px rgba(0, 0, 0, 0.06), 0px 6px 13px rgba(0, 0, 0, 0.1)',
    '0px 4px 16px rgba(0, 0, 0, 0.06), 0px 7px 15px rgba(0, 0, 0, 0.1)',
    '0px 5px 18px rgba(0, 0, 0, 0.06), 0px 8px 17px rgba(0, 0, 0, 0.1)',
    '0px 5px 20px rgba(0, 0, 0, 0.06), 0px 9px 19px rgba(0, 0, 0, 0.1)',
    '0px 6px 22px rgba(0, 0, 0, 0.06), 0px 10px 21px rgba(0, 0, 0, 0.1)',
    '0px 7px 24px rgba(0, 0, 0, 0.06), 0px 11px 23px rgba(0, 0, 0, 0.1)',
    '0px 7px 26px rgba(0, 0, 0, 0.06), 0px 12px 25px rgba(0, 0, 0, 0.1)',
    '0px 8px 28px rgba(0, 0, 0, 0.06), 0px 13px 27px rgba(0, 0, 0, 0.1)',
    '0px 8px 30px rgba(0, 0, 0, 0.06), 0px 14px 29px rgba(0, 0, 0, 0.1)',
    '0px 9px 32px rgba(0, 0, 0, 0.06), 0px 15px 31px rgba(0, 0, 0, 0.1)',
    '0px 10px 34px rgba(0, 0, 0, 0.06), 0px 16px 33px rgba(0, 0, 0, 0.1)',
    '0px 10px 36px rgba(0, 0, 0, 0.06), 0px 17px 35px rgba(0, 0, 0, 0.1)',
    '0px 11px 38px rgba(0, 0, 0, 0.06), 0px 18px 37px rgba(0, 0, 0, 0.1)',
    '0px 11px 40px rgba(0, 0, 0, 0.06), 0px 19px 39px rgba(0, 0, 0, 0.1)',
    '0px 12px 42px rgba(0, 0, 0, 0.06), 0px 20px 41px rgba(0, 0, 0, 0.1)',
    '0px 12px 44px rgba(0, 0, 0, 0.06), 0px 21px 43px rgba(0, 0, 0, 0.1)',
    '0px 13px 46px rgba(0, 0, 0, 0.06), 0px 22px 45px rgba(0, 0, 0, 0.1)',
    '0px 13px 48px rgba(0, 0, 0, 0.06), 0px 23px 47px rgba(0, 0, 0, 0.1)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          scrollbarColor: '#9ca3af transparent',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#9ca3af',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#6b7280',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
        },
        contained: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 16px',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f9fafb',
          color: '#374151',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
          '&:hover': {
            backgroundColor: '#f9fafb',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#1f2937',
          fontSize: '0.75rem',
          padding: '6px 12px',
          borderRadius: 6,
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(17, 24, 39, 0.6)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: '#e5e7eb',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
  },
});

export default theme;