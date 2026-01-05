import {ProfileImage} from "@game/App/Layout/Content/ProfileImage.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {MyTechStack} from "@game/App/Components/MyTechStack.tsx";
import {MyContactInfo} from "@game/App/Components/MyContactInfo.tsx";
import {Button} from "@game/App/Components/Button.tsx";
import {ContentSection} from "@game/App/Layout/Content/ContentSection.tsx";
import {Download} from "lucide-react";
import {useI18n} from "@game/App/Hooks/useI18n.ts";

export function HeroSection() {
    const { t } = useI18n();
    const aboutMeSecondPart = t("aboutMeC");
    const linkToDigiPen = '<a class="text-blue-100 font-bold hover:text-cyan-300" href="https://www.digipen.es/" target="_blank" rel="noopener noreferrer">DigiPen Europe–Bilbao</a>';
    const aboutMeSecondPartWithLink = aboutMeSecondPart.replace("DigiPen Europe–Bilbao", linkToDigiPen)

    return (
        <ContentSection>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <ProfileImage/>

                <div className="w-full space-y-4 sm:space-y-6">
                    <div>
                        <h1 className="mb-0.5 text-white"><I18nText id="myName"/></h1>
                        <h2 className="mb-2 sm:mb-3 text-sm"><I18nText id="myDegree"></I18nText></h2>
                        <p className="text-blue-100 leading-relaxed text-sm sm:text-base"><I18nText id={"aboutMeJs"}/></p>
                        <p className="text-blue-100 leading-relaxed text-sm sm:text-base" dangerouslySetInnerHTML={{ __html: aboutMeSecondPartWithLink }}></p>
                    </div>

                    <MyTechStack/>
                    <MyContactInfo/>

                    {/* Download CV Button */}
                    <a href="/cv.pdf" target="_blank" rel="noopener noreferrer">
                        <Button size="lg">
                            <Download />
                            <I18nText id={"download-cv"}/>
                        </Button>
                    </a>
                </div>
            </div>
        </ContentSection>
    );
}