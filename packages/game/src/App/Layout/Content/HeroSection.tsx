import {ProfileImage} from "@game/App/Layout/Content/ProfileImage.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {MyTechStack} from "@game/App/Components/MyTechStack.tsx";
import {MyContactInfo} from "@game/App/Components/MyContactInfo.tsx";
import {Button} from "@game/App/Components/Button.tsx";

export function HeroSection() {
    return (
        <section className="relative z-5 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <ProfileImage/>

                <div className="w-full space-y-4 sm:space-y-6">
                    <div>
                        <h1 className="mb-0.5 text-white"><I18nText id="myName"/></h1>
                        <h2 className="mb-2 sm:mb-3 text-sm"><I18nText id="myDegree"></I18nText></h2>
                        <p className="text-blue-100 leading-relaxed text-sm sm:text-base"><I18nText id={"aboutMeJs"}/></p>
                        <p className="text-blue-100 leading-relaxed text-sm sm:text-base"><I18nText id={"aboutMeC"}/></p>
                    </div>

                    <MyTechStack/>
                    <MyContactInfo/>

                    {/* Download CV Button */}
                    {/* TODO: change url to correct CV path when I upload an updated CV */}
                    <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                        <Button size="lg">
                            <i className="fa-solid fa-download"></i>
                            <I18nText id={"download-cv"}/>
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}