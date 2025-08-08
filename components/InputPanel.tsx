"use client";

import React, { useState, useEffect } from "react";
import {
	Card,
	CardHeader,
	CardContent,
	TextField,
	Select,
	MenuItem,
	InputLabel,
	FormControl,
	Button,
	Slider,
	Typography,
	Box,
	Chip,
	InputAdornment,
	Tooltip,
} from "@mui/material";
import {
	Info as InfoIcon,
	PlayArrow as PlayArrowIcon,
} from "@mui/icons-material";
import { getFeeTiers } from "@/utils/fees";
import { SimulationParams, WebSocketStatus } from "@/types/types";
const cryptoPairs = [
	"BTC-USDT",
	"ETH-USDT",
	"SOL-USDT",
	"BNB-USDT",
	"XRP-USDT",
];

interface InputPanelProps {
	params: SimulationParams;
	onRunSimulation: (params: SimulationParams) => void;
	websocketStatus: WebSocketStatus;
}

export default function InputPanel({
	params,
	onRunSimulation,
	websocketStatus,
}: InputPanelProps) {
	const [localParams, setLocalParams] = useState<SimulationParams>(params);
	const feeTiers = getFeeTiers();

	// Handle input changes for TextField
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>
	) => {
		const { name, value } = e.target;
		if (!name) return;
		setLocalParams((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle Select changes
	const handleSelectChange = (
		event: any /* SelectChangeEvent<string> */,
		child?: React.ReactNode
	) => {
		const { name, value } = event.target;
		setLocalParams((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	// Handle slider changes
	const handleSliderChange =
		(name: string) => (e: Event, value: number | number[]) => {
			setLocalParams((prev) => ({
				...prev,
				[name]: value as number,
			}));
		};

	// Handle form submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onRunSimulation(localParams);
	};

	// Status chip color based on WebSocket connection state
	const getStatusColor = () => {
		switch (websocketStatus) {
			case "OPEN":
				return "success";
			case "CONNECTING":
				return "warning";
			case "ERROR":
			case "CLOSED":
				return "error";
			default:
				return "default";
		}
	};

	return (
		<Card
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				borderRadius: 2,
			}}
		>
			<CardHeader
				title="Simulation Parameters"
				action={
					<Chip
						label={websocketStatus}
						color={getStatusColor()}
						size="small"
						sx={{ mr: 1 }}
					/>
				}
				sx={{ borderBottom: 1, borderColor: "divider" }}
			/>
			<CardContent sx={{ flexGrow: 1, overflowY: "auto" }}>
				<form onSubmit={handleSubmit}>
					<Box sx={{ mb: 3 }}>
						<FormControl fullWidth>
							<InputLabel id="symbol-label">Trading Pair</InputLabel>
							<Select
								labelId="symbol-label"
								id="symbol"
								name="symbol"
								value={localParams.symbol}
								onChange={handleSelectChange}
								label="Trading Pair"
							>
								{cryptoPairs.map((pair) => (
									<MenuItem key={pair} value={pair}>
										{pair}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Box sx={{ mb: 3 }}>
						<TextField
							fullWidth
							label="Order Size"
							name="quantityUsd"
							type="number"
							value={localParams.quantityUsd}
							onChange={handleChange}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">$</InputAdornment>
								),
							}}
							inputProps={{
								min: 100,
								step: 100,
							}}
						/>
					</Box>

					<Box sx={{ mb: 4 }}>
						<Typography gutterBottom display="flex" alignItems="center">
							Volatility (σ)
							<Tooltip title="Asset volatility affects market impact. Higher volatility increases the impact of large orders.">
								<InfoIcon fontSize="small" sx={{ ml: 1 }} />
							</Tooltip>
						</Typography>
						<Slider
							value={localParams.volatility}
							onChange={handleSliderChange("volatility")}
							min={0.01}
							max={0.2}
							step={0.01}
							valueLabelDisplay="auto"
							valueLabelFormat={(value) => `${(value * 100).toFixed(1)}%`}
							marks={[
								{ value: 0.01, label: "1%" },
								{ value: 0.05, label: "5%" },
								{ value: 0.1, label: "10%" },
								{ value: 0.2, label: "20%" },
							]}
						/>
					</Box>

					<Box sx={{ mb: 4 }}>
						<FormControl fullWidth>
							<InputLabel id="fee-tier-label">Fee Tier</InputLabel>
							<Select
								labelId="fee-tier-label"
								id="feeTier"
								name="feeTier"
								value={localParams.feeTier}
								onChange={handleSelectChange}
								label="Fee Tier"
							>
								{feeTiers.map((tier) => (
									<MenuItem key={tier.name} value={tier.name}>
										{tier.name} - Maker: {tier.makerFee * 100}% / Taker:{" "}
										{tier.takerFee * 100}%
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>

					<Button
						variant="contained"
						color="primary"
						size="large"
						type="submit"
						fullWidth
						startIcon={<PlayArrowIcon />}
						disabled={websocketStatus !== "OPEN"}
						sx={{
							mt: 2,
							py: 1.5,
							fontWeight: 600,
							letterSpacing: 1,
							borderRadius: 2,
							boxShadow: 2,
							transition: "all 0.2s",
							"&:hover": {
								transform: "translateY(-2px)",
								boxShadow: 6,
								bgcolor: "primary.dark",
							},
						}}
					>
						Run Simulation
					</Button>
				</form>
			</CardContent>
		</Card>
	);
}
