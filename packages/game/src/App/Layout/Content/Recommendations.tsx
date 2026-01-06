import { Button } from "@game/App/Components/Button.tsx";
import { Card, CardContent } from "@game/App/Components/Card.tsx";
import { Carousel } from "@game/App/Components/Carousel.tsx";
import { Flag } from "@game/App/Components/Flag.tsx";
import { I18nText } from "@game/App/Components/I18nText.tsx";
import { ContentSection } from "@game/App/Layout/Content/ContentSection.tsx";
import { typedKeys } from "@game/App/utils.ts";
import { Download, Quote } from "lucide-react";

interface Recommendation {
    name: string;
    company: string;
    position: string;
    quote: string;
    source?: {
        de?: string;
        en?: string;
    }
}

const recommendations: Recommendation[] = [
    {
        name: "Bettina Stracke",
        company: "Sprengnetter Verlag und Software GmbH",
        position: "Head of Human Resources",
        quote: "quote-sprengnetter",
        source: {
            "de": "testimony/de-2018-sprengnetter.pdf",
            "en": "testimony/en-2018-sprengnetter.pdf",
        }
    },
    {
        name: "Robin Gilke",
        company: "HEUFT Systemtechnik GmbH",
        position: "Head of Business IT",
        quote: "quote-heuft",
        source: {
            "de": "testimony/de-2020-heuft.pdf",
            "en": "testimony/en-2020-heuft.pdf",
        }
    },
    {
        name: "Maurice Wallbott",
        company: "Upsidecode GmbH",
        position: "Managing Director",
        quote: "quote-upsidecode",
        source: {
            "de": "testimony/de-2024-upsidecode.pdf",
        }
    },
    {
        name: "Nadine Pesso",
        company: "Factor Eleven GmbH",
        position: "Software Developer | Frontend",
        quote: "quote-nadine-pesso",
    }
];

function DownloadEmploymentReference({ rec }: { rec: Recommendation}) {
    if (!rec.source){
        return null;
    }

    return (
        <div className="border-t border-white/20 pt-3 sm:pt-4">
            <h2 className="inline-flex justify-center align-middle items-center text-white text-sm sm:text-base w-full pb-3">
                <Download className="inline-flex w-4 h-4 sm:w-4 sm:h-4 mr-1.5"/> <I18nText id="job-certificate"/>
            </h2>
            <div className="flex flex-row gap-2 justify-center">
                {typedKeys(rec.source).map((lang) => (
                    <a className="" href={rec.source?.[lang]} target="_blank"
                       rel="noopener noreferrer">
                        <Button
                            variant="secondary"
                            size="sm"
                            className="text-xs sm:text-sm"
                        >
                            <Flag className="max-h-4" lang={lang}/>
                            <span>{lang.toUpperCase()}</span>
                        </Button>
                    </a>
                ))}
            </div>
        </div>
    )
}

export function Recommendations() {
    return (
        <ContentSection title="recommendations">
            <Carousel>
                {recommendations.map((rec) => (
                    <div key={rec.name} className="px-3">
                        <Card
                            className="relative hover:shadow-lg transition-shadow bg-white/10 backdrop-blur-sm border-white/20 hover:border-primary w-xs">
                            <CardContent className="p-4 sm:p-4 min-w-2xs">
                                <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-orange-300 mb-3 sm:mb-4"/>
                                <p className="text-blue-100 mb-4 sm:mb-6 italic text-sm sm:text-base line-clamp-9 h-55">
                                    "<I18nText id={rec.quote}/>"
                                </p>
                                <div className="border-t border-white/20 pt-3 sm:pt-4 mb-3 sm:mb-4">
                                    <p className="text-white text-sm sm:text-base">{rec.name}</p>
                                    <p className="text-blue-200 text-xs sm:text-sm">{rec.position}</p>
                                    <p className="text-blue-200 text-xs sm:text-sm">{rec.company}</p>
                                </div>
                                <DownloadEmploymentReference rec={rec} />
                            </CardContent>
                        </Card>
                    </div>
                ))}
            </Carousel>
        </ContentSection>
    )
}