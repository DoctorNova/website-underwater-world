import {I18nText} from "@game/App/Components/I18nText.tsx";
import {MyEmail} from "@game/App/Components/MyEmail.tsx";

export function LegalNotice() {
    return (
        <div>
            <h1 className="mb-4 text-white"><I18nText id="legal-notice"/></h1>
            <p className="flex flex-col m-2">
                <span><I18nText id="myName"/></span>
                <span><I18nText id="myStreet"/></span>
                <span><I18nText id="myCity"/></span>
                <span><I18nText id="myCountry"/></span>
            </p>
            <div class="flex flex-col m-2">
                <div>
                    <I18nText id="email"/>: <MyEmail/>
                </div>
                <div>
                    <I18nText id="phone"/>: <I18nText id="myPhone"/>
                </div>
            </div>
        </div>

    );
}