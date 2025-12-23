import { Application } from "./Application";

const application = new Application();
application.Initialize();
application.GameLoop();
window.addEventListener('beforeunload', () => application.Shutdown());