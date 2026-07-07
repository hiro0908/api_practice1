import type { PokemonStat } from "@/src/domain/pokemon/pokemon";

type Props = {
  stats: PokemonStat[];
};

const STAT_ROWS = [
  { key: "hp", label: "HP" },
  { key: "attack", label: "攻撃" },
  { key: "defense", label: "防御" },
  { key: "special-attack", label: "特攻" },
  { key: "special-defense", label: "特防" },
  { key: "speed", label: "すばやさ" },
] as const;

const MAX_STAT = 200;

function getBarColor(value: number): string {
  if (value < 50) return "bg-red-500";
  if (value < 80) return "bg-orange-400";
  if (value < 100) return "bg-yellow-400";
  if (value < 120) return "bg-lime-500";
  if (value < 150) return "bg-green-500";
  return "bg-cyan-500";
}

export function BaseStatBarChart({ stats }: Props) {
  const getValue = (name: string) =>
    stats.find((stat) => stat.name === name)?.value ?? 0;

  const rows = STAT_ROWS.map((row) => ({ ...row, value: getValue(row.key) }));
  const total = rows.reduce((sum, row) => sum + row.value, 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="font-bold text-slate-700">種族値</div>
        <div className="text-sm font-bold text-slate-700">{total}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <div
            key={row.key}
            className="grid grid-cols-[3rem_1fr_2.5rem] items-center gap-2"
          >
            <span className="text-sm">{row.label}</span>
            <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${getBarColor(row.value)}`}
                style={{
                  width: `${Math.min(100, (row.value / MAX_STAT) * 100)}%`,
                }}
              />
            </div>
            <span className="text-sm text-right">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
