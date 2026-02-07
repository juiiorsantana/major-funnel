
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DataPoint {
  name: string;
  value: number;
  label: string;
}

interface WaveFunnelProps {
  data: DataPoint[];
}

export const WaveFunnel: React.FC<WaveFunnelProps> = ({ data }) => {
  const width = 800;
  const height = 400;
  const padding = 60;
  const innerWidth = width - padding * 2;
  const centerY = height / 2;

  // Normalization
  const maxValue = Math.max(...data.map(d => d.value));

  // Non-linear thickness for visual appeal (thicker waves)
  const getThickness = (val: number) => {
    if (val <= 0) return 4;
    // Increased base thickness for more "presence"
    const normalized = Math.pow(val / maxValue, 0.4);
    return Math.max(12, normalized * (height - 100));
  };

  const points = useMemo(() => {
    const step = innerWidth / (data.length - 1);
    return data.map((d, i) => ({
      x: padding + i * step,
      thickness: getThickness(d.value),
      value: d.value,
      name: d.name,
      label: d.label
    }));
  }, [data, innerWidth, height]);

  // Generate smooth Bézier paths (The "Previous Style")
  const generateWavePath = () => {
    if (points.length < 2) return '';

    let topPath = `M ${points[0].x} ${centerY - points[0].thickness / 2}`;

    // Smooth forward curve
    for (let i = 0; i < points.length - 1; i++) {
      const curr = points[i];
      const next = points[i + 1];
      const controlX1 = curr.x + (next.x - curr.x) * 0.5;
      const controlX2 = curr.x + (next.x - curr.x) * 0.5;

      topPath += ` C ${controlX1} ${centerY - curr.thickness / 2}, ${controlX2} ${centerY - next.thickness / 2}, ${next.x} ${centerY - next.thickness / 2}`;
    }

    // Connect and go backward
    let bottomPath = `L ${points[points.length - 1].x} ${centerY + points[points.length - 1].thickness / 2}`;
    for (let i = points.length - 1; i > 0; i--) {
      const curr = points[i];
      const next = points[i - 1];
      const controlX1 = curr.x - (curr.x - next.x) * 0.5;
      const controlX2 = curr.x - (curr.x - next.x) * 0.5;

      bottomPath += ` C ${controlX1} ${centerY + curr.thickness / 2}, ${controlX2} ${centerY + next.thickness / 2}, ${next.x} ${centerY + next.thickness / 2}`;
    }

    return `${topPath} ${bottomPath} Z`;
  };

  // Get color for each stage
  const getStageColor = (index: number) => {
    const colors = ['#0369a1', '#0ea5e9', '#06b6d4', '#14b8a6', '#10b981'];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          {/* Premium Gradient: Deep Blue → Tech Blue → Cyan → Emerald */}
          <linearGradient id="premiumWaveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.85" />
            <stop offset="75%" stopColor="#14b8a6" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>

          {/* Subtle inner shadow */}
          <filter id="innerGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Glow effect for nodes */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background glow layer */}
        <motion.path
          d={generateWavePath()}
          fill="url(#premiumWaveGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          className="blur-xl"
        />

        {/* The Wave Path with Motion */}
        <motion.path
          d={generateWavePath()}
          fill="url(#premiumWaveGradient)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="drop-shadow-[0_8px_30px_rgba(6,182,212,0.35)]"
        />

        {/* Data Points & Labels */}
        {points.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            {/* Outer pulse ring */}
            <motion.circle
              cx={p.x}
              cy={centerY}
              r={18}
              fill="transparent"
              stroke={getStageColor(i)}
              strokeWidth={1.5}
              strokeOpacity={0.3}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.2 }}
            />

            {/* Middle ring */}
            <circle
              cx={p.x}
              cy={centerY}
              r={14}
              stroke="white"
              strokeWidth={2}
              fill="transparent"
              className="opacity-40 group-hover:opacity-70 transition-opacity duration-300"
            />

            {/* Core node with gradient */}
            <circle
              cx={p.x}
              cy={centerY}
              r={8}
              fill="white"
              filter="url(#nodeGlow)"
              className="drop-shadow-lg"
            />
            <circle
              cx={p.x}
              cy={centerY}
              r={4}
              fill={getStageColor(i)}
            />

            {/* Always visible value (above node) */}
            <g className="transition-all duration-300">
              <rect
                x={p.x - 45}
                y={centerY - p.thickness / 2 - 42}
                width={90}
                height={28}
                rx={8}
                fill="#0f172a"
                fillOpacity={0.9}
                className="group-hover:fill-opacity-100"
              />
              <rect
                x={p.x - 45}
                y={centerY - p.thickness / 2 - 42}
                width={90}
                height={28}
                rx={8}
                fill="transparent"
                stroke="white"
                strokeWidth={1}
                strokeOpacity={0.1}
              />
              <text
                x={p.x}
                y={centerY - p.thickness / 2 - 23}
                textAnchor="middle"
                className="text-[13px] font-black fill-white tracking-tight"
              >
                {p.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
              </text>
            </g>

            {/* Stage Name (Bottom) */}
            <text
              x={p.x}
              y={height - 15}
              textAnchor="middle"
              className="text-[12px] font-black uppercase tracking-[0.15em] fill-slate-500 group-hover:fill-tech-600 transition-colors duration-300"
            >
              {p.name}
            </text>

            {/* Stage Label (Below name) */}
            <text
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              className="text-[8px] font-bold uppercase tracking-widest fill-slate-300"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};
