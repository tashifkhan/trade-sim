"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import {
	CssBaseline,
	createTheme,
	ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import { useTheme } from "next-themes";

// Create the light theme
const lightTheme = createTheme({
	palette: {
		mode: "light",
		primary: {
			main: "#1976d2",
		},
		secondary: {
			main: "#14B8A6",
		},
		success: {
			main: "#22c55e",
		},
		error: {
			main: "#ef4444",
		},
		warning: {
			main: "#f59e0b",
		},
		info: {
			main: "#3b82f6",
		},
		background: {
			default: "#ffffff",
			paper: "#f8fafc",
		},
		text: {
			primary: "#0f172a",
			secondary: "#64748b",
		},
	},
	typography: {
		fontFamily:
			'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		h4: {
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow:
						"0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
					border: "1px solid #e2e8f0",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 500,
				},
			},
		},
	},
});

// Create the dark theme
const darkTheme = createTheme({
	palette: {
		mode: "dark",
		primary: {
			main: "#60a5fa",
		},
		secondary: {
			main: "#34d399",
		},
		success: {
			main: "#10b981",
		},
		error: {
			main: "#ef4444",
		},
		warning: {
			main: "#f59e0b",
		},
		info: {
			main: "#3b82f6",
		},
		background: {
			default: "#0f172a",
			paper: "#1e293b",
		},
		text: {
			primary: "#f8fafc",
			secondary: "#94a3b8",
		},
	},
	typography: {
		fontFamily:
			'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
		h4: {
			fontWeight: 600,
		},
	},
	shape: {
		borderRadius: 8,
	},
	components: {
		MuiCard: {
			styleOverrides: {
				root: {
					boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
					border: "1px solid #334155",
				},
			},
		},
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					fontWeight: 500,
				},
			},
		},
	},
});

export function MuiThemeWrapper({ children }: { children: React.ReactNode }) {
	const { resolvedTheme } = useTheme();
	const theme = resolvedTheme === "dark" ? darkTheme : lightTheme;

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</MuiThemeProvider>
	);
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
