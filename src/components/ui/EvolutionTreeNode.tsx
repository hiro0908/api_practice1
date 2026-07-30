import { PokemonEvolutionNode } from "@/src/domain/pokemon/pokemon";
import { EvolutionNodeButton } from "@/src/components/ui/EvolutionNodeButton"; 
import {
  ChevronRight,
  ArrowUp,
  ArrowRight,
  ArrowDown,
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
} from "lucide-react";
const HUB_POSITIONS = [
  {
    grid: "col-start-2 row-start-1",
    Icon: ArrowUp,
    dir: "col",
    arrowFirst: false,
  }, // 上
  {
    grid: "col-start-3 row-start-2",
    Icon: ArrowRight,
    dir: "row",
    arrowFirst: true,
  }, // 右
  {
    grid: "col-start-2 row-start-3",
    Icon: ArrowDown,
    dir: "col",
    arrowFirst: true,
  }, // 下
  {
    grid: "col-start-1 row-start-2",
    Icon: ArrowLeft,
    dir: "row",
    arrowFirst: false,
  }, // 左
  {
    grid: "col-start-3 row-start-1",
    Icon: ArrowUpRight,
    dir: "col",
    arrowFirst: false,
  }, // 右上
  {
    grid: "col-start-3 row-start-3",
    Icon: ArrowDownRight,
    dir: "col",
    arrowFirst: true,
  }, // 右下
  {
    grid: "col-start-1 row-start-3",
    Icon: ArrowDownLeft,
    dir: "col",
    arrowFirst: true,
  }, // 左下
  {
    grid: "col-start-1 row-start-1",
    Icon: ArrowUpLeft,
    dir: "col",
    arrowFirst: false,
  }, // 左上
] as const;

export function EvolutionTreeNode({
  node,
  currentPokedexId,
}: {
  node: PokemonEvolutionNode;
  currentPokedexId: number;
}) {
  const isCurrent = node.pokedexId === currentPokedexId;

  if (node.evolvesTo.length === 0) {
    return <EvolutionNodeButton node={node} isCurrent={isCurrent} />;
  }

  // イーブイ(8分岐)のように多分岐の場合は、中心から上下左右に広げるレイアウトにする
  if (node.evolvesTo.length >= 5) {
    const hubChildren = node.evolvesTo.slice(0, HUB_POSITIONS.length);
    const overflowChildren = node.evolvesTo.slice(HUB_POSITIONS.length);
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="grid grid-cols-3 grid-rows-3 place-items-center gap-3">
          <div className="col-start-2 row-start-2">
            <EvolutionNodeButton node={node} isCurrent={isCurrent} />
          </div>
          {hubChildren.map((child, index) => {
            const pos = HUB_POSITIONS[index];
            const Icon = pos.Icon;
            const arrow = (
              <Icon size={16} className="shrink-0 text-muted-foreground" />
            );
            const nodeEl = (
              <EvolutionTreeNode
                node={child}
                currentPokedexId={currentPokedexId}
              />
            );
            return (
              <div
                key={child.pokedexId}
                className={`flex items-center justify-center gap-1 ${
                  pos.dir === "row" ? "flex-row" : "flex-col"
                } ${pos.grid}`}
              >
                {pos.arrowFirst ? (
                  <>
                    {arrow}
                    {nodeEl}
                  </>
                ) : (
                  <>
                    {nodeEl}
                    {arrow}
                  </>
                )}
              </div>
            );
          })}
        </div>
        {overflowChildren.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2">
            {overflowChildren.map((child) => (
              <EvolutionTreeNode
                key={child.pokedexId}
                node={child}
                currentPokedexId={currentPokedexId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <EvolutionNodeButton node={node} isCurrent={isCurrent} />
      <div className="flex flex-col gap-2">
        {node.evolvesTo.map((child) => (
          <div key={child.pokedexId} className="flex items-center gap-2">
            <ChevronRight
              size={18}
              className="shrink-0 text-muted-foreground"
            />
            <EvolutionTreeNode
              node={child}
              currentPokedexId={currentPokedexId}
            />
          </div>
        ))}
      </div>
    </div>
  );
}