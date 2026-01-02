export function ProfileImage() {
    return (
        <div className="flex justify-center">
            <div className="relative w-full max-w-70 sm:max-w-sm md:max-w-md aspect-square overflow-hidden rounded-2xl shadow-xl">
                {/* ODO: Change photo to an actual photo of myself */}
                <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjcyMDYzMTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Professional portrait"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    );
}