import { Button as WPDSButton } from "@washingtonpost/wpds-ui-kit";
import { type ReactNode, useTransition } from "react";

export default function Button({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <WPDSButton
      variant="primary"
      density="compact"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await onClick();
        });
      }}
    >
      {children}
    </WPDSButton>
  );
}
