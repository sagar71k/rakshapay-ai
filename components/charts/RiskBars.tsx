"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function RiskBars({
  messageRisk,
  urlRisk,
  deviceRisk,
  transactionRisk,
}: {
  messageRisk: number;
  urlRisk: number;
  deviceRisk: number;
  transactionRisk: number;
}) {
  const data = [
    { name: "Message", value: messageRisk },
    { name: "URL", value: urlRisk },
    { name: "Device", value: deviceRisk },
    { name: "Txn", value: transactionRisk },
  ];
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#8b9bb4" fontSize={12} />
          <YAxis stroke="#8b9bb4" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ background: "#0c1220", border: "1px solid rgba(148,163,184,0.2)" }}
          />
          <Bar dataKey="value" fill="#22d3ee" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
