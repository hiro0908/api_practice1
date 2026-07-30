import { calculateTypeEffectiveness } from "@/src/domain/pokemon/calculateEffectiveType";
import { TypeBadge } from "@/src/components/ui/id/TypeBadge";

type Props = {
  types: string[];
};

const GROUPS = [
  { key: "x4", label: "弱点 (×4)" },
  { key: "x2", label: "弱点 (×2)" },
  { key: "x0_5", label: "耐性 (½×)" },
  { key: "x0_25", label: "耐性 (¼×)" },
  { key: "x0", label: "無効 (0×)" },
] as const;

export function TypeEffectivenessSection({ types }: Props) {
  const effectiveness = calculateTypeEffectiveness(types);

  return (
    <div>
      <div className="font-bold mb-2 text-card-foreground">タイプ相性</div>
      <div className="flex flex-col gap-3">
        {GROUPS.map((group) => {
          const list = effectiveness[group.key];
          if (list.length === 0) return null;
          return (
            <div key={group.key}>
              <div className="text-sm text-muted-foreground mb-1">
                {group.label}
              </div>
              <div className="flex flex-wrap gap-2">
                {list.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
