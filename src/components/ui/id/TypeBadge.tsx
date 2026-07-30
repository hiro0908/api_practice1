import { pokemonTypeStyleDictionary } from "@/src/domain/pokemon/pokemonTypeStyle";
type Props = {
  type: string;
};

export function TypeBadge({ type }: Props) {
  const info = pokemonTypeStyleDictionary[type];
  if (!info) return null;
  const Icon = info.icon;
  return (
    <div
      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-bold text-white"
      style={{ backgroundColor: info.color }}
    >
      <Icon size={14} />
      {info.ja}
    </div>
  );
}
