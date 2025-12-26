import type { SceneRoot } from "@engine/Composition/SceneRoot.ts";
import { globalEngine } from "@engine/index.ts";
import { CreateGameScene } from "@game/CreateGameScene.ts";
import { Pane } from "tweakpane";

export class EditorUI {
    private leftPanel: Pane;
    private centerPanel: HTMLElement;
    private rightPanel: Pane;

    constructor(
        private gameScene: SceneRoot,
        leftContainer: HTMLElement | null,
        centerPanel: HTMLElement | null,
        rightContainer: HTMLElement | null
    ) {
        if (!centerPanel) {
            throw new Error('Invalid center panel');
        }
        this.leftPanel = new Pane({
            title: "Left Panel",
            container: leftContainer ?? undefined,
        });
        this.leftPanel.on("fold", (event) => {
            if (event.expanded){
                leftContainer?.parentElement?.classList.remove("collapsed-left");
            } else {
                leftContainer?.parentElement?.classList.add("collapsed-left");
            }
        });
        this.centerPanel = centerPanel;
        this.CreateGameControls();
        this.rightPanel = new Pane({
            title: "Right Panel",
            container: rightContainer ?? undefined,
        });
        this.rightPanel.on("fold", (event) => {
            if (event.expanded){
                rightContainer?.parentElement?.classList.remove("collapsed-right");
            } else {
                rightContainer?.parentElement?.classList.add("collapsed-right");
            }
        });


        const PARAMS = {
            factor: 123,
            title: 'hello',
            color: '#ff0055',
        };

        this.leftPanel.addBinding(PARAMS, 'factor');
        this.leftPanel.addBinding(PARAMS, 'title');
        this.leftPanel.addBinding(PARAMS, 'color');

        this.leftPanel.on('change', (ev) => {
            console.log('changed: ' + JSON.stringify(ev.value));
        });
    }

    private CreateGameControls() {
        const playPauseButton = this.centerPanel.querySelector(".game-play");
        if (globalEngine.isPaused){
            playPauseButton?.classList.remove("paused");
        }
        playPauseButton?.addEventListener("click", () => {
            if (globalEngine.isPaused){
                globalEngine.Play();
                playPauseButton?.classList.add("paused");
            } else {
                globalEngine.Pause();
                playPauseButton?.classList.remove("paused");
            }
        });

        const resetButton = this.centerPanel.querySelector(".game-reset");
        resetButton?.addEventListener("click", () => {
            globalEngine.EmptyScene(this.gameScene);
            CreateGameScene(this.gameScene);
        });

    }
}