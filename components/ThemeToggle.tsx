"use client";

import { IconButton, Tooltip } from "@mui/material";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	// Ensure component is mounted to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return (
			<IconButton size="small" disabled>
				<Sun size={20} />
			</IconButton>
		);
	}

	const isDark = resolvedTheme === "dark";

	return (
		<Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
			<IconButton
				size="small"
				onClick={() => setTheme(isDark ? "light" : "dark")}
				sx={{
					color: "text.primary",
					"&:hover": {
						backgroundColor: "action.hover",
					},
				}}
			>
				{isDark ? <Sun size={20} /> : <Moon size={20} />}
			</IconButton>
		</Tooltip>
	);
}
