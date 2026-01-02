import {MyTechStack} from "@game/App/Components/MyTechStack.tsx";
import {MyContactInfo} from "@game/App/Components/MyContactInfo.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {Button} from "@game/App/Components/Button.tsx";

export function AboutMe() {
    return (
        <div className="w-full space-y-4 sm:space-y-6">
            <div>
                <h1 className="mb-3 sm:mb-4 text-white"><I18nText id={"myName"}/></h1>
                <p className="text-blue-100 leading-relaxed text-sm sm:text-base"><I18nText id={"aboutMeJs"}/></p>
                <p className="text-blue-100 leading-relaxed text-sm sm:text-base"><I18nText id={"aboutMeC"}/></p>
            </div>

            <MyTechStack/>
            <MyContactInfo/>

            {/* Download CV Button */}
            {/* TODO: change url to correct CV path when I upload an updated CV */}
            <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                <Button>
                    <i className="fa-solid fa-download"></i>
                    <I18nText id={"download-cv"}/>
                </Button>
            </a>
        </div>
    );
}