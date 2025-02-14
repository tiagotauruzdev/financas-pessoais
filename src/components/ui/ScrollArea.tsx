import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

export function ScrollArea({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <ScrollAreaPrimitive.Root className={className}>
      <ScrollAreaPrimitive.Viewport className="w-full h-full">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className="flex select-none touch-none p-0.5 bg-navy-700 transition-colors duration-150 ease-out hover:bg-navy-600 data-[orientation=vertical]:w-2 data-[orientation=horizontal]:flex-col data-[orientation=horizontal]:h-2"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="flex-1 bg-navy-600 rounded-[10px] relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-full before:h-full before:min-w-[44px] before:min-h-[44px]" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}