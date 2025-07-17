import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from "recharts";

export default function OptionMoneynessExplorer() {
  const [spotPrice, setSpotPrice] = useState(100);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToMaturity, setTimeToMaturity] = useState(0.5);
  const [optionType, setOptionType] = useState("call");

  const intrinsicValue =
    optionType === "call"
      ? Math.max(0, spotPrice - strikePrice)
      : Math.max(0, strikePrice - spotPrice);

  const timeValue = Math.max(0, (0.5 - Math.abs(0.5 - timeToMaturity)) * 20);
  const totalValue = intrinsicValue + timeValue;

  const getMoneyness = () => {
    if (optionType === "call") {
      if (spotPrice < strikePrice) return "Out of the Money (OTM)";
      if (spotPrice === strikePrice) return "At the Money (ATM)";
      if (spotPrice - strikePrice <= 20) return "In the Money (ITM)";
      return "Deep In the Money (Deep ITM)";
    } else {
      if (spotPrice > strikePrice) return "Out of the Money (OTM)";
      if (spotPrice === strikePrice) return "At the Money (ATM)";
      if (strikePrice - spotPrice <= 20) return "In the Money (ITM)";
      return "Deep In the Money (Deep ITM)";
    }
  };

  const moneyness = getMoneyness();

  const minX = Math.max(0, strikePrice - 50);
  const maxX = strikePrice + 50;
  const payoffData = Array.from({ length: maxX - minX + 1 }, (_, i) => {
    const s = minX + i;
    const payoff =
      optionType === "call"
        ? Math.max(0, s - strikePrice)
        : Math.max(0, strikePrice - s);
    return { s, payoff };
  });

  const getColor = () => {
    if (moneyness.includes("Deep")) return "#7a46ff"; // Deep ITM
    if (moneyness.includes("ITM")) return "#4476ff";  // ITM
    if (moneyness.includes("ATM")) return "#f5ca27";  // ATM
    return "#cccccc";                                 // OTM
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h2>Option Moneyness Explorer</h2>

      <label>
        Spot Price (S): {spotPrice}
        <input
          type="range"
          min="0"
          max="200"
          value={spotPrice}
          onChange={(e) => setSpotPrice(Number(e.target.value))}
        />
      </label>
      <br />

      <label>
        Exercise Price (X): {strikePrice}
        <input
          type="range"
          min="0"
          max="200"
          value={strikePrice}
          onChange={(e) => setStrikePrice(Number(e.target.value))}
        />
      </label>
      <br />

      <label>
        Time to Maturity (T): {timeToMaturity.toFixed(2)}
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={timeToMaturity}
          onChange={(e) => setTimeToMaturity(Number(e.target.value))}
        />
      </label>
      <br /><br />

      <label>
        Option Type:
        <select
          value={optionType}
          onChange={(e) => setOptionType(e.target.value)}
        >
          <option value="call">Call</option>
          <option value="put">Put</option>
        </select>
      </label>

      {/* Info box in top right */}
      <div style={{
        float: "right",
        textAlign: "right",
        marginTop: "-90px",
        marginBottom: "10px",
        minWidth: "360px",
        padding: "10px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        background: "#f9f9f9",
        fontFamily: "monospace"
      }}>
        <div><strong>{moneyness}</strong></div>
        <div><strong>Intrinsic Value:</strong> {intrinsicValue.toFixed(2)}</div>
        <div>
          Payoff = max(0,&nbsp;
          {optionType === "call" ? (
            <>
              S<sub>r</sub> - Exercise Price
            </>
          ) : (
            <>
              Exercise Price - S<sub>r</sub>
            </>
          )}
          ) = max(0,&nbsp;
          {optionType === "call"
            ? `${spotPrice} - ${strikePrice}`
            : `${strikePrice} - ${spotPrice}`}
          ) = {intrinsicValue.toFixed(2)}
        </div>
      </div>

      <br style={{ clear: "both" }} />

      {/* Output box */}
      <div style={{
        marginTop: "1rem",
        backgroundColor: getColor(),
        color: "#000",
        padding: "10px",
        borderRadius: "6px"
      }}>
        <strong>Time Value:</strong> {timeValue.toFixed(2)} <br />
        <strong>Total Option Value:</strong> {totalValue.toFixed(2)} <br />
        <strong>Moneyness:</strong> {moneyness}
      </div>

      <div style={{ height: 300, marginTop: 30 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={payoffData}
            margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
          >
            <XAxis
              dataKey="s"
              type="number"
              domain={[minX, maxX]}
              label={{
                value: "Exercise Price (X)",
                position: "insideBottom",
                dy: 20,
                style: { fontSize: 12, fill: "#333" },
              }}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <YAxis
              domain={[0, "dataMax + 10"]}
              label={{
                value: "Payoff",
                angle: -90,
                position: "insideLeft",
                dx: -10,
                style: { fontSize: 12, fill: "#333" },
              }}
              tick={{ fontSize: 12, fill: "#555" }}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="payoff"
              stroke="#6366f1"
              strokeWidth={2}
              dot={false}
            />
            <ReferenceDot
              x={spotPrice}
              y={optionType === "call"
                ? Math.max(0, spotPrice - strikePrice)
                : Math.max(0, strikePrice - spotPrice)}
              r={6}
              fill="#ea792d"
              stroke="black"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
