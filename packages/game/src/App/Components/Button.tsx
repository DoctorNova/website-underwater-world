import type {ComponentProps} from "preact";
import {cn} from "@game/App/utils.ts";

export const buttonStyles = {
    always: "cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    variant: {
        default: "bg-primary text-primary-foreground rounded-lg border border-primary shadow-lg hover:bg-white/10 hover:backdrop-blur-md hover:border-white/30 hover:text-white",
        destructive:
            "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
            "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
            "bg-white/10 backdrop-blur-md border border-white/30 text-white rounded-lg hover:bg-primary hover:border-primary hover:text-primary-foreground shadow-lg",
        ghost:
            "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
    },

    size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md",
    },
};
type Variants = keyof typeof buttonStyles["variant"];
type Size = keyof typeof buttonStyles["size"];

export function Button({className, variant, size, ...props}: ComponentProps<"button"> & { className?: string, variant?: Variants, size?: Size }) {
    return (
        <button
            className={cn(buttonStyles.always, buttonStyles.variant[variant ?? "default"], buttonStyles.size[size ?? "default"], className)}
            {...props}
        />
    );
}
