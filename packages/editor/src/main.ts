import { EditorApplication } from "./EditorApplication";

const application = new EditorApplication();
application.Initialize();
application.GameLoop();
window.addEventListener('beforeunload', () => application.Shutdown());