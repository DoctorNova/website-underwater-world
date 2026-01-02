type GameLoadingBarProps = {
    progress: number;
    visible: boolean;
}

export function GameLoadingBar({ progress, visible }: GameLoadingBarProps) {
    return (
        <div className="relative z-5">TODO: Loading {`${visible ? `${progress * 100}%` : "completed"}`}</div>
    );
}