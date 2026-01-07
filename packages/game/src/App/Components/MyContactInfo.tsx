import { I18nText } from "@game/App/Components/I18nText.tsx";
import { Link } from "@game/App/Components/Link";
import { MyEmail } from "@game/App/Components/MyEmail.tsx";
import { Mail, Phone } from "lucide-react";

export function MyContactInfo() {
    return (
        <div className="space-y-1 sm:space-y-1.5">
            <div className="flex items-center gap-3 text-blue-200 text-sm sm:text-base">
                <span className="inline-flex align-middle justify-center">
                    <Phone className="w-5 h-5"/>
                </span>
                <span className="break-all"><I18nText id={"myPhone"}/></span>
            </div>
            <div className="flex items-center gap-3 text-blue-200 text-sm sm:text-base">
                <span className="inline-flex align-middle justify-center">
                    <Mail className="w-5 h-5"/>
                </span>
                <MyEmail/>
            </div>
            <div className="flex items-center gap-3 text-blue-200 text-sm sm:text-base">
                <span className="inline-flex align-middle justify-center">
                    <img className="w-5 h-5" src="images/github.svg" alt="GitHub Profile" title="GitHub profile"/>
                </span>
                <Link href="https://github.com/DoctorNova">
                    <span className="break-all">github.com/DoctorNova</span>
                </Link>
            </div>
            <div className="flex items-center gap-3 text-blue-200 text-sm sm:text-base">
                <span className="inline-flex align-middle justify-center">
                    <img className="w-5 h-5" src="images/linkedin.svg" alt="Linkedin Profile" title="Linkedin Profile"/>
                </span>
                <Link href="https://linkedin.com/in/sebastian-paas">
                    <span className="break-all">linkedin.com/in/sebastian-paas</span>
                </Link>
            </div>
        </div>
    );
}