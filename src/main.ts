import { Application } from "Game";

const application = new Application();
application.Initialize();
application.RenderLoop();
window.addEventListener('beforeunload', () => application.Shutdown());