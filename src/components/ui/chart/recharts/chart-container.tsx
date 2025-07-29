import React from "react";
import { TooltipProps } from "recharts";

export type ChartConfig = Record<
  string,
  {
    label: string;
    color?: string;
    formatter?: (value: number) => string;
  }
>;

interface ChartContainerProps {
  config?: ChartConfig;
  className?: string;
  children: React.ReactNode;
}

export function ChartContainer({
  config,
  className,
  children,
}: ChartContainerProps) {
  return (
    <div
      className={className}
      style={{
        // Add custom variables for chart colors
        "--chart-1": "var(--primary)",
        "--chart-2": "hsla(var(--primary-hsl) / 0.5)",
        "--chart-3": "hsla(var(--primary-hsl) / 0.2)",
        "--chart-4": "var(--muted)",
        "--chart-5": "var(--muted-foreground)",
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

interface ChartTooltipProps extends TooltipProps<any, any> {
  className?: string;
  nameKey?: string;
  labelFormatter?: (label: string) => React.ReactNode;
  valueFormatter?: (value: number) => React.ReactNode;
}

export function ChartTooltip({
  content,
  cursor = { stroke: "hsl(var(--muted))", strokeDasharray: "3 3" },
  ...props
}: ChartTooltipProps) {
  return <Tooltip content={content} cursor={cursor} {...props} />;
}

export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  nameKey = "name",
  labelFormatter = (value) => value,
  valueFormatter = (value: number) => value,
}: ChartTooltipProps & {
  className?: string;
  nameKey?: string;
  labelFormatter?: (label: string) => React.ReactNode;
  valueFormatter?: (value: number) => React.ReactNode;
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className={`rounded-lg border bg-background p-2 shadow-sm ${className}`}>
      <div className="grid gap-0.5 px-2 py-1">
        <p className="text-muted-foreground text-xs">
          {labelFormatter(label)}
        </p>
        {payload.map((entry: any) => {
          const dataKey = entry.dataKey || entry.name;
          const name = entry[nameKey] || dataKey;
          const color = entry.color || entry.stroke;

          return (
            <div key={dataKey} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1">
                {color && (
                  <div
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                )}
                <span className="text-xs font-medium">{name}</span>
              </div>
              <span className="text-xs font-medium">
                {typeof valueFormatter === "function"
                  ? valueFormatter(entry.value)
                  : entry.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Re-export Tooltip type from Recharts for convenience
export { Tooltip } from "recharts";
