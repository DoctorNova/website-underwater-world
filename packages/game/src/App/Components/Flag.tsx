import type {ComponentProps} from "preact";

export function Flag({ lang, ...props }: { lang: string } & Omit<ComponentProps<"img">, "src" | "alt" | "title">) {
    return (
        <img {...props} src={`flags/${lang}.png`} alt={lang} title={lang}/>
    );
}