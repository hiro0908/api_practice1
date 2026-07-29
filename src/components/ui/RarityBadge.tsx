import { Crown, Sparkle } from "lucide-react";

type Props = {
  legendary: boolean;
  mythical: boolean;
};

export function RarityBadge({ legendary, mythical }: Props) {
  if (mythical) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-fuchsia-100 px-3 py-1.5 text-fuchsia-600 dark:bg-fuchsia-950 dark:text-fuchsia-300">
        <Sparkle size={16} />
        幻
      </div>
    );
  }

  if (legendary) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
        <Crown size={16} />
        伝説
      </div>
    );
  }

  return null;
}
