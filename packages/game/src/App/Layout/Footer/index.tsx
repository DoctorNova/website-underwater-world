import {LegalNotice} from "@game/App/Layout/Footer/LegalNotice.tsx";
import {PrivacyPolicy} from "@game/App/Layout/Footer/PrivacyPolicy.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";

export function Footer() {
    return (
        <footer className="w-full bg-background p-3 pt-5">
            <div className="w-full flex justify-center">
                <div className="grid lg:grid-cols-2 grid-cols-1 gap-2 max-w-5xl">
                    <LegalNotice/>
                    <PrivacyPolicy/>
                </div>
            </div>
            <p className="text-right">
                &copy; <I18nText id="myName"/>
            </p>
        </footer>
    );
}