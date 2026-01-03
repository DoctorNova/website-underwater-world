import {Canvas3D} from "@game/App/Components/Canvas3D.tsx";
import {useState} from "preact/hooks";
import {Recommendations} from "@game/App/Layout/Content/Recommendations.tsx";
import {HeroSection} from "@game/App/Layout/Content/HeroSection.tsx";
import {GameLoadingBar} from "@game/App/Layout/Content/GameLoadingBar.tsx";
import {Background} from "@game/App/Layout/Background.tsx";
import {cn} from "@game/App/utils.ts";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {Button} from "@game/App/Components/Button.tsx";
import {useHistoryState} from "@game/App/Hooks/useHistoryState.ts";

export function Content() {
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [runGame, setRunGame] = useHistoryState("run-game", () => {
        const runGameInitially = new URLSearchParams(window.location.search).get("runGame") === "true";
        if (runGameInitially) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
        return runGameInitially;
    });

    return (
        <div className="relative z-10">
            <Button
                variant="default"
                onClick={() => {setRunGame(false)}}
                className={cn("fixed top-4 left-1/2 sm:top-6 z-50 transition-all duration-200 delay-200 -translate-x-1/2 -translate-y-32", runGame && "translate-y-0")}>
                <I18nText id="go-to-startpage"/>
            </Button>
            <Canvas3D
                className={cn(
                    "absolute top-0 left-0 w-full h-full z-1", // Default styling and styling to apply when the hero section is showing
                    runGame && "w-screen h-screen", // styling to show the game
                )}
                onProgress={setProgress}
                onComplete={() => setLoading(false)}
            />
            <Background className={runGame && "z-0"} />
            <div className={cn(
                "transition-all duration-200 relative z-10 opacity-100", // Default styling and styling to apply when the hero section is showing
                runGame && "opacity-0 pointer-events-none", // styling to hide the hero section so that the game is visible
                runGame && "h-[calc(100vh-12rem)] overflow-hidden" // styling to show the loading bar even if the hero section is hidden
            )}>
                <HeroSection />
                <Recommendations />
            </div>
            <div className={cn("transition-all duration-200 relative z-10 opacity-100", runGame && !loading && "opacity-0 pointer-events-none max-h-[12rem] overflow-hidden")}>
                <GameLoadingBar progress={progress} isComplete={!loading} onClick={() => {
                    setRunGame(true);
                    window.scrollTo({top: 0, behavior: 'smooth'});
                }} />
            </div>
        </div>
    );
}