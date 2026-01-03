import {Header} from "@game/App/Layout/Header";
import {Footer} from "@game/App/Layout/Footer";
import {Content} from "@game/App/Layout/Content";
import {useHistoryState} from "@game/App/Hooks/useHistoryState.ts";

export function App() {
    const [runGame, setRunGame] = useHistoryState("run-game", () => {
        const runGameInitially = new URLSearchParams(window.location.search).get("runGame") === "true";
        if (runGameInitially) {
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
        return runGameInitially;
    });

    const onRunGame = (enable: boolean) => {
        setRunGame(enable);
        if (enable){
            window.scrollTo({top: 0, behavior: 'smooth'});
        }
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <Header runGame={runGame} onRunGame={onRunGame}></Header>
            <Content runGame={runGame} onRunGame={onRunGame}></Content>
            <Footer></Footer>
        </div>
    );
}
