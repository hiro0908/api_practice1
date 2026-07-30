import { Drawer } from "@base-ui/react/drawer";

export default function ExampleDrawer({
  title,
  explain,
}: {
  title: string;
  explain: string | null;
}) {
  return (
    <Drawer.Root>
      <Drawer.Trigger className="cursor-pointer">{title}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ease-out data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-end">
          <Drawer.Popup className="w-full rounded-t-2xl bg-card p-6 shadow-xl transition-transform duration-300 ease-out data-[ending-style]:translate-y-full data-[starting-style]:translate-y-full">
            <Drawer.Content>
              <Drawer.Title className="text-base font-bold text-card-foreground">
                {title}
              </Drawer.Title>
              <Drawer.Description className="mt-2 text-sm text-muted-foreground">
                {explain}
              </Drawer.Description>
              <div className="mt-4 flex justify-end">
                <Drawer.Close className="rounded-full border border-border px-4 py-1.5 text-sm font-bold text-muted-foreground">
                  Close
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
