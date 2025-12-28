export default function HomePage() {



    const toggleDarkMode = () => {
        const html = document.documentElement;
        html.classList.toggle('dark');
    };

    return (
        <div className="min-h-screen bg-pearl-aqua-50 dark:bg-pacific-blue-950 text-dusty-grape-900 dark:text-dusty-grape-100 p-8 transition-colors flex flex-col items-center justify-center">
            <button
                className="absolute top-4 right-4 bg-dark-amethyst-500 hover:bg-dark-amethyst-700 text-white px-4 py-2 rounded shadow transition z-10"
                onClick={toggleDarkMode}
            >
                Toggle Dark Mode
            </button>
            <h1 className="text-4xl font-bold mb-8 text-dark-amethyst-700 dark:text-dark-amethyst-300">Survivor Fantasy League UI Palette Demo</h1>
            <div className="max-w-md w-full bg-surface dark:bg-midnight-violet-900 rounded-xl shadow-lg p-8 mb-8 flex flex-col items-center">
                <h2 className="text-2xl font-semibold mb-2 text-pacific-blue-700 dark:text-pacific-blue-200">Player Card</h2>
                <p className="mb-4 text-dusty-grape-700 dark:text-dusty-grape-200">This card demonstrates a real-world use of your custom palette for backgrounds, text, and accents.</p>
                <div className="flex gap-2 mb-4">
                    <span className="inline-block bg-pearl-aqua-200 text-pacific-blue-900 dark:bg-pearl-aqua-700 dark:text-pearl-aqua-50 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
                    <span className="inline-block bg-dark-amethyst-100 text-dark-amethyst-700 dark:bg-dark-amethyst-700 dark:text-dark-amethyst-100 px-3 py-1 rounded-full text-xs font-semibold">Tribe: Azure</span>
                </div>
                <button className="w-full bg-pacific-blue-500 hover:bg-pacific-blue-700 text-white font-bold py-2 px-4 rounded mb-2 transition">Vote</button>
                <button className="w-full bg-midnight-violet-500 hover:bg-midnight-violet-700 text-white font-bold py-2 px-4 rounded transition">Immunity</button>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                <div className="w-48 bg-pearl-aqua-100 dark:bg-pearl-aqua-800 rounded-lg p-4 shadow">
                    <h3 className="font-bold text-pacific-blue-700 dark:text-pacific-blue-200 mb-2">Background</h3>
                    <p className="text-dusty-grape-700 dark:text-dusty-grape-200">bg-pearl-aqua-100<br />dark:bg-pearl-aqua-800</p>
                </div>
                <div className="w-48 bg-dark-amethyst-100 dark:bg-dark-amethyst-800 rounded-lg p-4 shadow">
                    <h3 className="font-bold text-dark-amethyst-700 dark:text-dark-amethyst-200 mb-2">Accent</h3>
                    <p className="text-dusty-grape-700 dark:text-dusty-grape-200">bg-dark-amethyst-100<br />dark:bg-dark-amethyst-800</p>
                </div>
                <div className="w-48 bg-midnight-violet-100 dark:bg-midnight-violet-800 rounded-lg p-4 shadow">
                    <h3 className="font-bold text-midnight-violet-700 dark:text-midnight-violet-200 mb-2">Button</h3>
                    <p className="text-dusty-grape-700 dark:text-dusty-grape-200">bg-midnight-violet-100<br />dark:bg-midnight-violet-800</p>
                </div>
            </div>
            <div className="mt-10 text-center text-xs text-dusty-grape-400 dark:text-dusty-grape-600">
                Try toggling dark mode with the button above to see the palette adapt!
            </div>
        </div>
    );
}