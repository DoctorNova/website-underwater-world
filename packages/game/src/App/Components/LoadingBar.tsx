import {I18nText} from "@game/App/Components/I18nText.tsx";

export type LoadingBarProps = {
    progress: number; // 0..1
    visible: boolean;
};

export function LoadingBar({ progress, visible }: LoadingBarProps) {
    if (!visible) return null;

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-8">
            <div className="space-y-2">
                <div className="flex justify-between items-center text-sm text-blue-200">
                    <span><I18nText id={"loading"}/></span>
                    <span>{progress}%</span>
                </div>
                <div className="bg-primary/20 relative h-2 w-full overflow-hidden rounded-full">
                    <div
                        data-slot="progress-indicator"
                        className="bg-primary h-full w-full flex-1 transition-all"
                        style={{ transform: `translateX(-${Math.max(progress * 100, 5)}%)` }}
                    />
                </div>
            </div>
        </div>
    );
}
