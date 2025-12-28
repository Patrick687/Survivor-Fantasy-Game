import { Link } from "react-router-dom";
import Button from "../ui/Button";
import Card from "../ui/Card";

export default function SplashPage() {
    return (
        <div id="splash-root" className="min-h-screen flex flex-col items-center justify-center p-8">
            <Card id="splash-content" className="max-w-lg">
                <h1 className="text-5xl font-extrabold text-dark-amethyst-700 dark:text-dark-amethyst-300 mb-2 text-center">Survivor Fantasy League</h1>
                <p className="text-lg text-dusty-grape-700 dark:text-dusty-grape-200 text-center mb-4">
                    Play, strategize, and outwit your friends in the ultimate Survivor fantasy experience.
                </p>
                <div id="splash-actions" className="flex gap-4 w-full justify-center">
                    <Link to="/signup" className="w-1/2">
                        <Button variant="primary">Sign Up</Button>
                    </Link>
                    <Link to="/login" className="w-1/2">
                        <Button variant="secondary">Login</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
