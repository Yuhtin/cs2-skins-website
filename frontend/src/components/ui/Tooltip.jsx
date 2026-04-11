import * as RadixTooltip from '@radix-ui/react-tooltip';

export function TooltipProvider({ children }) {
  return <RadixTooltip.Provider delayDuration={200}>{children}</RadixTooltip.Provider>;
}

export function Tooltip({ content, children, side = 'top' }) {
  return (
    <RadixTooltip.Root>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={6}
          className="bg-elevated text-fg border border-subtle rounded-md px-2.5 py-1.5 text-xs shadow-elevated z-50"
        >
          {content}
          <RadixTooltip.Arrow className="fill-elevated" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
