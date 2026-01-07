import { cn } from "@game/App/utils";
import type { ComponentProps } from "preact";

interface LinkProps extends Omit<ComponentProps<"a">, "href" | "target" | "rel"> {
  href: string;
  className?: string;
  inNewTab?: boolean;
}

export function Link({href, children, className, inNewTab = true, ...props}: LinkProps){
  const newTabProps = inNewTab ? { target:"_blank", rel:"noopener noreferrer"} : {};

  return <a className={cn("hover:text-cyan-300 [@media(hover:none)]:text-cyan-300", className)} {...newTabProps} {...props} href={href}>{children}</a>
}