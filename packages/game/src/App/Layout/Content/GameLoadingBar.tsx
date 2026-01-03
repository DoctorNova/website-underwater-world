import {I18nText} from "@game/App/Components/I18nText.tsx";
import {buttonStyles} from "@game/App/Components/Button.tsx";
import {cn} from "@game/App/utils.ts";
import {ContentSection} from "@game/App/Layout/Content/ContentSection.tsx";
import {Sparkles} from "lucide-react";

type GameLoadingBarProps = {
    progress: number;
    isComplete: boolean;
    onClick: () => void;
}

export function GameLoadingBar({progress, isComplete, onClick}: GameLoadingBarProps) {

    return (
        <ContentSection title="portfolio">
            <div className={cn("w-full max-w-6xl mx-auto px-4 sm:px-6 flex justify-center flex-col gap-2")}>
                <div
                    className={`flex overflow-hidden justify-between items-center text-sm text-blue-200 transition-all h-xs ${isComplete && 'h-0'}`}>
                    <span><I18nText id="loading"/>...</span>
                    <span>{Math.floor(progress * 100)}%</span>
                </div>
                <div
                    className={cn("flex justify-center transition-all duration-200", isComplete ? 'h-auto rounded-none bg-transparent' : "overflow-hidden rounded-full")}>
                    <div
                        style={{transform: `translateX(-${100 - (progress * 100 || 0)}%)`}}
                        onClick={onClick}
                        className={cn(buttonStyles.always, buttonStyles.variant.default, "block text-center btn-shine", isComplete ? " py-3 px-3 h-xs w-40" : "py-0 px-0 h-2 w-full hover:bg-primary hover:border-primary")}>
                        <span className="inline-flex justify-center items-center">
                            <Sparkles className="h-6 w-6"/>
                            <span className={`pl-2 text-lg opacity-${isComplete ? "100" : "0"}`}><I18nText id="dive-in"/></span>
                        </span>
                    </div>
                </div>
            </div>
        </ContentSection>
    );
}