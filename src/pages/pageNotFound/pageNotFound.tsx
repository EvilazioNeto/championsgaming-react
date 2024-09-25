import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";

function PageNotFound() {
    return (
        <main className="relative">
            <img src="/pagenotfound.jpg" className="rounded-lg w-full" alt="" />
            <Button className="absolute right-4 top-4">
                <Link to="/">Dashboard</Link>
            </Button>
        </main>
    )
}

export default PageNotFound;
