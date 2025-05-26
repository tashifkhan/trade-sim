"use client";

import React from "react";
import { Box, Typography, Divider, useTheme } from "@mui/material";
import { OrderbookData, OrderbookEntry } from "@/types/types";
import { formatCurrency } from "@/utils/formatters";

interface OrderbookVisualizerProps {
	orderbook: OrderbookData;
	maxRows?: number;
}

export default function OrderbookVisualizer({
	orderbook,
	maxRows = 5,
}: OrderbookVisualizerProps) {
	const theme = useTheme();
	const {
		processedAsks = [],
		processedBids = [],
		spread = 0,
		spreadPercentage = 0,
	} = orderbook;

	// Take only the specified number of rows
	const visibleAsks = processedAsks.slice(0, maxRows).reverse();
	const visibleBids = processedBids.slice(0, maxRows);

	// Function to render a row in the orderbook
	const renderRow = (entry: OrderbookEntry, type: "ask" | "bid") => {
		const isAsk = type === "ask";
		// Use theme-aware colors
		const color = isAsk
			? theme.palette.mode === "dark"
				? "rgba(239, 68, 68, 0.2)"
				: "rgba(239, 68, 68, 0.1)"
			: theme.palette.mode === "dark"
			? "rgba(34, 197, 94, 0.2)"
			: "rgba(34, 197, 94, 0.1)";

		return (
			<Box
				key={`${type}-${entry.price}`}
				sx={{
					display: "flex",
					height: "24px",
					mb: 0.5,
					position: "relative",
					"&:hover": {
						backgroundColor: theme.palette.action.hover,
					},
				}}
			>
				{/* Depth visualization */}
				<Box
					sx={{
						position: "absolute",
						top: 0,
						bottom: 0,
						right: isAsk ? "auto" : 0,
						left: isAsk ? 0 : "auto",
						width: `${entry.percentage}%`,
						backgroundColor: color,
						opacity: 0.8,
						zIndex: 0,
					}}
				/>

				{/* Text content */}
				<Box
					sx={{
						display: "flex",
						width: "100%",
						justifyContent: "space-between",
						zIndex: 1,
						px: 1,
					}}
				>
					<Typography variant="body2" fontFamily="monospace">
						{formatCurrency(entry.price)}
					</Typography>
					<Typography variant="body2" fontFamily="monospace">
						{entry.size.toFixed(4)}
					</Typography>
					<Typography
						variant="body2"
						fontFamily="monospace"
						color="text.secondary"
					>
						{entry.total?.toFixed(4)}
					</Typography>
				</Box>
			</Box>
		);
	};

	return (
		<Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					mb: 1,
					px: 1,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Price
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Size
				</Typography>
				<Typography variant="caption" color="text.secondary">
					Total
				</Typography>
			</Box>

			{/* Asks (Sell orders) */}
			<Box sx={{ mb: 1 }}>
				{visibleAsks.map((ask) => renderRow(ask, "ask"))}
			</Box>

			{/* Spread information */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					py: 0.5,
					bgcolor: "background.paper",
					border: 1,
					borderColor: "divider",
					borderRadius: 1,
					mb: 1,
				}}
			>
				<Typography variant="caption" color="text.secondary">
					Spread: {formatCurrency(spread)} ({spreadPercentage.toFixed(4)}%)
				</Typography>
			</Box>

			{/* Bids (Buy orders) */}
			<Box>{visibleBids.map((bid) => renderRow(bid, "bid"))}</Box>
		</Box>
	);
}
