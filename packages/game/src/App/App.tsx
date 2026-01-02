import {Header} from "@game/App/Layout/Header";
import {Footer} from "@game/App/Layout/Footer";
import {Content} from "@game/App/Layout/Content";

export function App() {
    return (
        <div className="min-h-screen relative overflow-hidden">
            <Header></Header>
            <Content></Content>
            <Footer></Footer>
        </div>
    );
}
