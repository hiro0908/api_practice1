"use client";
import { PokemonEvolutionNode } from "@/src/domain/pokemon/pokemon";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function EvolutionNodeButton({
  node,
  isCurrent,
}: {
  node: PokemonEvolutionNode;
  isCurrent: boolean;
}) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.push(`/pokemon/${node.pokeApiId}`)}
      className={`flex cursor-pointer flex-col items-center gap-1 rounded-2xl border px-3 py-2 transition-colors duration-150 ${
        isCurrent
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-card hover:bg-accent"
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
        {node.imageUrl && (
          <Image
            src={node.imageUrl}
            alt={node.japaneseName}
            width={48}
            height={48}
          />
        )}
      </div>
      <div
        className={`text-xs font-bold ${
          isCurrent ? "text-primary" : "text-card-foreground"
        }`}
      >
        {node.japaneseName}
      </div>
    </button>
  );
}
