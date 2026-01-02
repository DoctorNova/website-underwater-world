import {AboutMe} from "@game/App/Layout/Content/AboutMe.tsx";
import {ProfileImage} from "@game/App/Layout/Content/ProfileImage.tsx";

export function HeroSection() {
    return (
        <section className="relative z-5 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
            <div className="flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <ProfileImage/>
                <AboutMe/>
            </div>
        </section>
    );
}