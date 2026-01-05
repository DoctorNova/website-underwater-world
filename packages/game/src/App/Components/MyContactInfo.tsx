import {MyEmail} from "@game/App/Components/MyEmail.tsx";
import {I18nText} from "@game/App/Components/I18nText.tsx";
import {Mail, Phone} from "lucide-react";

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
                <a href="https://github.com/DoctorNova" target="_blank" rel="noopener noreferrer">
                    <span className="break-all hover:text-cyan-300">github.com/DoctorNova</span>
                </a>
            </div>
            <div className="flex items-center gap-3 text-blue-200 text-sm sm:text-base">
                <span className="inline-flex align-middle justify-center">
                    <img className="w-5 h-5" src="images/linkedin.svg" alt="Linkedin Profile" title="Linkedin Profile"/>
                </span>
                <a href="https://linkedin.com/in/sebastian-paas" target="_blank" rel="noopener noreferrer">
                    <span className="break-all hover:text-cyan-300">linkedin.com/in/sebastian-paas</span>
                </a>
            </div>
        </div>
    );
}