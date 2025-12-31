import type { SceneRoot } from "@engine/Composition/SceneRoot.ts";
import { globalEngine } from "@engine/index.ts";
import {ListBladeApi, Pane} from "tweakpane";
import {type Demo, demos} from "./Demos";

export class EditorUI {
    private leftPanel: Pane;
    private centerPanel: HTMLElement;
    private rightPanel: Pane;

    constructor(
        private gameScene: SceneRoot,
        leftContainer: HTMLElement | null,
        centerPanel: HTMLElement | null,
        rightContainer: HTMLElement | null,
        private demo: Demo,
        initialDemoIndex: number
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

        const demoList = this.leftPanel.addBlade({
            view: 'list',
            label: 'Demo',
            options: demos.map((aDemo, index) => ({
                text: aDemo.Create.name.replace(/Create|Update|Scene/ig, ""),
                value: index,
            })),
            value: initialDemoIndex,
        }) as ListBladeApi<number>;

        demoList.on('change', (event) => {
            const index = event.value;

            demo.Create = demos[index].Create;
            demo.Update = demos[index].Update;

            globalEngine.EmptyScene(this.gameScene);
            demo.Create(this.gameScene);
        });
    }

    private CreateGameControls() {
        const playPauseButton = this.centerPanel.querySelector(".game-play");
        const onPlayPauseButton = () => {
            if (globalEngine.isPaused){
                globalEngine.Play();
                playPauseButton?.classList.add("paused");
            } else {
                globalEngine.Pause();
                playPauseButton?.classList.remove("paused");
            }
        };

        playPauseButton?.addEventListener("click", onPlayPauseButton);
        if (globalEngine.isPaused){
            playPauseButton?.classList.remove("paused");
        } else {
            playPauseButton?.classList.add("paused");
        }

        const resetButton = this.centerPanel.querySelector(".game-reset");
        resetButton?.addEventListener("click", () => {
            globalEngine.EmptyScene(this.gameScene);
            this.demo.Create(this.gameScene);
        });

    }
}