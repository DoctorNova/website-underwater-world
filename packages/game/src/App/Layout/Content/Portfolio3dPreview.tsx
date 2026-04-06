import { Button, buttonStyles } from "@game/App/Components/Button.tsx";
import { DuplicatedCanvas } from "@game/App/Components/DuplicateCanvas.tsx";
import { I18nText } from "@game/App/Components/I18nText.tsx";
import { useIsWebGL2Supported } from "@game/App/Hooks/useIsWebGL2Supported";
import { ContentSection } from "@game/App/Layout/Content/ContentSection.tsx";
import { cn } from "@game/App/utils.ts";
import { Sparkles } from "lucide-react";

type GameLoadingBarProps = {
    gameCanvas: HTMLCanvasElement | undefined | null;
    progress: number;
    isShowingGame: boolean;
    isComplete: boolean;
    onClick: () => void;
}

export function Portfolio3dPreview({progress, isComplete, onClick, gameCanvas, isShowingGame}: GameLoadingBarProps) {
    const translation = 100 - (progress * 100 || 0);
    const isWebGl2Supported = useIsWebGL2Supported(gameCanvas);

    return (
        <ContentSection title="3d-portfolio-tour">
            <div className={cn("w-full max-w-6xl mx-auto px-4 sm:px-6 flex justify-center flex-col gap-2")}>
                <div className="flex justify-center">
                    <DuplicatedCanvas active={!isShowingGame} source={gameCanvas}
                                      className={cn("w-full h-md border border-white/30 shadow-lg rounded-lg opacity-100 transition-all duration-250", !isComplete && "opacity-0")}/>
                </div>
                <div className={cn("transition-all duration-500 overflow-hidden h-6 opacity-100 -translate-y-10", isComplete && 'h-0 opacity-0')}>
                    <div
                        className={`flex justify-between items-center text-sm text-blue-200`}>
                        <span><I18nText id="loading"/>...</span>
                        <span>{Math.floor(progress * 100)}%</span>
                    </div>
                </div>
                <div className="flex justify-center -translate-y-10">
                    <div
                        className={cn("flex transition-all duration-250 ease-in overflow-hidden rounded-full w-full h-2 text-center", isComplete && 'rounded-lg h-12 w-40')}>
                        <Button
                            disabled={!isWebGl2Supported.isSupported}
                            onClick={isComplete ? onClick : () => {
                            }}
                            style={{transform: `translateX(-${translation}%)`}}
                            className={cn(
                                buttonStyles.always,
                                buttonStyles.variant.default,
                                "btn-shine py-0 px-0 h-full w-full",
                                isComplete ? "py-2 px-2 cursor-pointer" : "hover:bg-primary hover:border-primary cursor-auto",
                            )}>
                        <span
                            className={`inline-flex justify-center items-center opacity-${isComplete ? "100" : "0"} transition-all duration-250`}>
                            <Sparkles className="h-6 w-6"/>
                            <span className="pl-2 text-lg"><I18nText id="dive-in"/></span>
                        </span>
                        </Button>
                    </div>
                </div>
            </div>
        </ContentSection>
    );
}