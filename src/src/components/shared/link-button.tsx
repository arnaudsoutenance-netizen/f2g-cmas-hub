import Link from "next/link";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";

type LinkButtonProps = Omit<ComponentProps<typeof Button>, "render" | "nativeButton"> & { href: string };

/** A navigation link styled as a button; stays an <a> for the accessibility tree. */
export function LinkButton({ href, ...props }: LinkButtonProps) {
  return <Button nativeButton={false} render={<Link href={href} />} {...props} />;
}
