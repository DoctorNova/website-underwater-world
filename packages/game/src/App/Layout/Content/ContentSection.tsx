import {I18nText} from "@game/App/Components/I18nText.tsx";
import {type ReactNode} from "preact/compat";

export function ContentSection({ title, children }: { title: string, children: ReactNode }) {
    return (
        <section className="relative z-5 w-full max-w-6xl mx-auto px-6 py-16">
            <div className="w-full">
                <h2 className="text-center mb-2 text-white"><I18nText id={title}/></h2>
                {/* Decorative line that fades out to both sides */}
                <div className="relative w-full h-px mb-7 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#ffff35] to-transparent opacity-60"></div>
                </div>
            </div>
            {children}
        </section>
    );
}