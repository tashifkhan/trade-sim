"use client";

import { useState, useEffect } from "react";
import { Box, Container, Typography } from "@mui/material";
import InputPanel from "@/components/InputPanel";
import OutputPanel from "@/components/OutputPanel";
import { ThemeToggle } from "@/components/ThemeToggle";
import useWebSocket from "@/hooks/useWebSocket";
import { calculateSlippage } from "@/utils/slippage";
import { calculateFees } from "@/utils/fees";
import { calculateImpact } from "@/utils/impact";
import { makerProbability } from "@/utils/makerTaker";
import { formatNumber } from "@/utils/formatters";
import {
	OrderbookData,
	SimulationParams,
	SimulationResults,
} from "@/types/types";

const DEFAULT_PARAMS: SimulationParams = {
	symbol: "BTC-USDT",
	quantityUsd: 10000,
	volatility: 0.05, // 5%
	feeTier: "VIP1",
	run: false,
};

export default function Home() {
	const [params, setParams] = useState<SimulationParams>(DEFAULT_PARAMS);
	const [results, setResults] = useState<SimulationResults | null>(null);

	// For demo/development, we're using a mock WebSocket URL
	// In production, replace with actual WebSocket URL from env
	const wsUrl =
		process.env.NEXT_PUBLIC_WS_URL || "wss://ws.okx.com:8443/ws/v5/public";
	const {
		data: orderbook,
		latency,
		status,
	} = useWebSocket(wsUrl, params.symbol);

	useEffect(() => {
		if (
			params.run &&
			orderbook &&
			orderbook.bids.length > 0 &&
			orderbook.asks.length > 0
		) {
			// Get the top ask price to calculate quantity in crypto
			const topAskPrice = orderbook.asks[0][0];
			const quantityCrypto = params.quantityUsd / topAskPrice;

			// Calculate metrics
			const slippageBps = calculateSlippage(orderbook, params.quantityUsd);
			const feesUsd = calculateFees(params.quantityUsd, params.feeTier);
			const impactBps = calculateImpact(
				quantityCrypto,
				10000,
				params.volatility
			);
			const makerProb = makerProbability(params.quantityUsd);

			// Calculate net cost in basis points
			const feesBps = (feesUsd / params.quantityUsd) * 10000;
			const netCostBps = slippageBps + impactBps + feesBps;

			setResults({
				timestamp: new Date().toISOString(),
				topBid: orderbook.bids[0][0],
				topAsk: topAskPrice,
				quantityCrypto,
				slippageBps,
				feesUsd,
				feesBps,
				impactBps,
				makerProb,
				netCostBps,
				latency,
			});
		}
	}, [params, orderbook, latency]);

	const handleRunSimulation = (newParams: SimulationParams) => {
		setParams({ ...newParams, run: true });
	};

	return (
		<Container maxWidth={false} sx={{ height: "100vh", py: 4 }}>
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Typography variant="h4" component="h1">
					Crypto Trade Simulator
				</Typography>
				<ThemeToggle />
			</Box>

			<Box
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					gap: 4,
					height: { md: "calc(100% - 100px)" },
				}}
			>
				<Box
					sx={{ width: { xs: "100%", md: "30%" }, minWidth: { md: "300px" } }}
				>
					<InputPanel
						params={params}
						onRunSimulation={handleRunSimulation}
						websocketStatus={status}
					/>
				</Box>

				<Box sx={{ width: { xs: "100%", md: "70%" }, mt: { xs: 4, md: 0 } }}>
					<OutputPanel
						results={results}
						orderbook={orderbook}
						isLoading={status !== "OPEN" || !params.run}
					/>
				</Box>
			</Box>
		</Container>
	);
}
