type Props = {
  title: string;
};
export function PageTitle({ title }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 py-4">
      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-white shadow-md">
        <div className="absolute top-0 left-0 h-1/2 w-full bg-white" />
        <div className="absolute bottom-0 left-0 h-1/2 w-full bg-white" />
        <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-slate-900" />
        <div className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-slate-900 bg-white" />
      </div>
      <h1 className="text-center text-3xl font-extrabold tracking-wide text-white drop-shadow-sm sm:text-4xl">
        {title}
      </h1>
    </div>
  );
}
