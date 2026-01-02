
import("./Application").then((module) => {
    const application = new module.GameApplication();
    application.Initialize();
    application.GameLoop();
    window.addEventListener('beforeunload', () => application.Shutdown());
});

