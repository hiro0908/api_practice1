type Props={
    gene:number;
}
export const generationColor: Record<number, string> = {
  1: "bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300",
  2: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-300",
  3: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
  4: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
  5: "bg-neutral-100 text-neutral-600 dark:bg-neutral-950 dark:text-neutral-300",
  6: "bg-pink-100 text-pink-600 dark:bg-pink-950 dark:text-pink-300",
  7: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-300",
  8: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
  9: "bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300",
};
export function GenerationBadge({gene}:Props){
    return(
      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${generationColor[gene]}`}>
        第{gene}世代
      </div>
    );
}