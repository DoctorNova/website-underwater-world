import {SelectLanguage} from "@game/App/Components/SelectLanguage.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {Button} from "@game/App/Components/Button.tsx";
import {cn} from "@game/App/utils.ts";

export function Header({ runGame, onRunGame }: { runGame: boolean, onRunGame: (enable: boolean) => void })  {
    return (
        <header className="fixed top-4 right-4 left-4 sm:top-6 sm:right-6 sm:left-6 z-50 grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className={cn("justify-self-center sm:col-start-2 transition-all duration-200 delay-200 -translate-y-32", runGame && "translate-y-0")}>
                <Button variant="default" onClick={() => {onRunGame(false)}} >
                    <I18nText id="go-to-startpage"/>
                </Button>
            </div>
            <SelectLanguage className="justify-self-end" />
        </header>
    );
}