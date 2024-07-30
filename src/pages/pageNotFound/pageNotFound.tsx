import { Link } from "react-router-dom";
import referee from "/referee.png"
import { Button } from "../../components/ui/button";

function PageNotFound() {
    return (
        <div className="m-auto w-full max-w-screen-xl flex gap-4 items-center justify-center">
            <img className="w-[400px]" src={referee} alt="" />
            <div className="flex flex-col gap-2">
                <h2 className="text-2xl">Erro 404</h2>
                <h1 className="text-4xl">Página não encontrada :(</h1>
                <Link to="/">
                    <Button variant='secondary'>
                        Home
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default PageNotFound;
