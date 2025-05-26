"use client";

import React from "react";
import { Paper, Typography, Box, useTheme } from "@mui/material";
import { TrendingUp, TrendingDown } from "@mui/icons-material";

interface MetricCardProps {
	title: string;
	value: string | number;
	description?: string;
	color?: "primary" | "secondary" | "success" | "error" | "info" | "warning";
	trend?: "up" | "down" | "neutral";
}

export default function MetricCard({
	title,
	value,
	description,
	color = "primary",
	trend = "neutral",
}: MetricCardProps) {
	const theme = useTheme();

	const getColorStyles = () => {
		const paletteColor = theme.palette[color];

		return {
			backgroundColor:
				theme.palette.mode === "dark"
					? `${paletteColor.main}20`
					: `${paletteColor.main}10`,
			color: paletteColor.main,
			borderLeft: `4px solid ${paletteColor.main}`,
		};
	};

	const getTrendIcon = () => {
		switch (trend) {
			case "up":
				return <TrendingUp fontSize="small" color="success" />;
			case "down":
				return <TrendingDown fontSize="small" color="error" />;
			default:
				return null;
		}
	};

	return (
		<Paper
			elevation={0}
			sx={{
				p: 2,
				height: "100%",
				...getColorStyles(),
				transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
				"&:hover": {
					transform: "translateY(-2px)",
					boxShadow: 2,
				},
			}}
		>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "flex-start",
				}}
			>
				<Typography variant="subtitle2" color="text.secondary" gutterBottom>
					{title}
				</Typography>
				{getTrendIcon()}
			</Box>
			<Typography variant="h5" component="div" fontWeight="bold">
				{value}
			</Typography>
			{description && (
				<Typography variant="body2" color="text.secondary">
					{description}
				</Typography>
			)}
		</Paper>
	);
}
