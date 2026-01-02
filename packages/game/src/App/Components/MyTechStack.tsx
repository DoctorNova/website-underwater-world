function ToSnakeCase(str: string): string {
    return str.toLowerCase().replace(/\s/g, '_');
}

const technologiesIKnow = ["C++", "Unreal Engine", "JavaScript", "React", "TypeScript", "Node JS", "Jest", "Vite"];

export function MyTechStack() {
    const icons = technologiesIKnow.map((tech: string) => (
        <img className="max-h-7 h-auto w-auto object-contain px-1"
             key={tech}
             src={`images/technologies/${ToSnakeCase(tech)}.png`} alt={tech}
             title={tech}/>
    ));

    return (
        <div className="flex flex-wrap items-start gap-1">
            {icons}
        </div>
    )
}