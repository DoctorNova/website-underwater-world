import { I18nText } from "@game/App/Components/I18nText.tsx";
import { MyEmail } from "@game/App/Components/MyEmail.tsx";

export function PrivacyPolicy () {
    return (
        <div>
            <h1 className="mb-4 text-white"><I18nText id="privacy-policy"/></h1>
            <p className="m-2 text-justify sm:text-left"><I18nText id="privacy-policy-1"/></p>
            <p className="m-2 text-justify sm:text-left"><I18nText id="privacy-policy-2"/></p>
            <p className="m-2">
                <I18nText id="privacy-policy-3"/> <I18nText id="contact"/>: <MyEmail />
            </p>
        </div>
    );
}