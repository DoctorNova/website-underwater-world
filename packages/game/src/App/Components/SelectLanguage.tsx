import {useEffect, useRef, useState} from "preact/hooks";
import {useI18n} from "@game/App/Hooks/useI18n.ts";
import {Flag} from "@game/App/Components/Flag.tsx";
import {Button} from "@game/App/Components/Button.tsx";
import {Check, ChevronDown, Languages} from "lucide-react";

export function SelectLanguage({className}:{className?:string}) {
    const { language, languages, setLanguage } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLanguageSelect = (langCode: 'en' | 'de' | 'es') => {
        setLanguage(langCode);
        setIsOpen(false);
    };

    return (
        <div className={className} ref={dropdownRef}>
            <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="secondary"
            >
                <Languages />
                <Flag className="max-h-4" lang={language}/> <span>{language.toUpperCase()}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}/>
            </Button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0d2438]/95 backdrop-blur-md border border-white/30 rounded-lg shadow-xl overflow-hidden">
                    {languages.map((lang) => (
                        <button
                            key={lang}
                            onClick={() => handleLanguageSelect(lang)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer ${
                                language === lang
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-blue-100 hover:bg-white/10'
                            }`}
                        >
                            <Flag className="max-h-4" lang={lang}/>
                            <span>{lang.toUpperCase()}</span>
                            {language === lang && (
                                <Check className="ml-auto w-4 h-4"/>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}