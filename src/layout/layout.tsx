import {
    Bell,
    CircleUser,
    Home,
    LineChart,
    LogOut,
    Menu,
    Search,
    ShieldHalf,
} from "lucide-react"

import { Button } from "../components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Input } from "../components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet"
import { Link, useNavigate } from "react-router-dom"
import { ReactNode, useState } from "react"
import { ModeToggle } from "../components/mode-toggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFutbol } from "@fortawesome/free-solid-svg-icons"
import { useAuth } from "../contexts/AuthProvider/useAuth"

function Layout({ children }: { children: ReactNode }) {
    const [corLogo, setCorLogo] = useState<string>('dark');
    const [btnSelecionado, setBtnSelecionado] = useState<string>('Home');
    const navigate = useNavigate();
    const { logout } = useAuth();

    function onChangeTheme(e: string) {
        if (e === "dark") {
            setCorLogo("dark")
        } else {
            setCorLogo("light")
        }
    }

    function sair() {
        const confirmar = confirm("Deseja sair da sua conta?")
        if (confirmar) {
            logout();
            navigate("/login")
        }
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                        <Link to="/" className="flex items-center gap-2 font-semibold">
                            <img src={corLogo === "dark" ? "/logo-sem-fundo-branco.png" : "/logo-sem-fundo.png"} width={40} />
                            <span className="">Champions Gaming</span>
                        </Link>
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                            <Link
                                to="/"
                                onClick={() => setBtnSelecionado('Home')}
                                className={`${btnSelecionado === "Home" ? "text-primary bg-muted" : "text-muted-foreground"} flex items-center gap-3 rounded-lg  px-3 py-2  transition-all hover:text-primary`}
                            >
                                <Home className="h-4 w-4" />
                                Home
                            </Link>
                            {/* <Link
                                to="/criar-liga"
                                onClick={() => setBtnSelecionado('Criar liga')}
                                className={`${btnSelecionado === "Criar liga" ? "text-primary bg-muted" : "text-muted-foreground"} flex items-center gap-3 rounded-lg  px-3 py-2  transition-all hover:text-primary`}
                            >
                                <Shield className="h-4 w-4" />
                                Criar liga
                            </Link> */}
                            <Link
                                to="/minhas-ligas"
                                onClick={() => setBtnSelecionado('Minhas Ligas')}
                                className={`${btnSelecionado === "Minhas Ligas" ? "text-primary bg-muted" : "text-muted-foreground"} flex items-center gap-3 rounded-lg  px-3 py-2  transition-all hover:text-primary`}
                            >
                                <ShieldHalf className="h-4 w-4" />
                                Minhas Ligas
                            </Link>
                            <Link
                                to="#"
                                onClick={() => setBtnSelecionado('Artilheiros')}
                                className={`${btnSelecionado === "Artilheiros" ? "text-primary bg-muted" : "text-muted-foreground"} flex items-center gap-3 rounded-lg  px-3 py-2  transition-all hover:text-primary`}
                            >
                                <FontAwesomeIcon icon={faFutbol} className="h-4 w-4" />
                                Artilheiros
                            </Link>
                            <Link
                                to="#"
                                onClick={() => setBtnSelecionado('Analytics')}
                                className={`${btnSelecionado === "Analytics" ? "text-primary bg-muted" : "text-muted-foreground"} flex items-center gap-3 rounded-lg  px-3 py-2  transition-all hover:text-primary`}
                            >
                                <LineChart className="h-4 w-4" />
                                Analytics
                            </Link>
                        </nav>
                    </div>
                    <div className="max-lg:hidden mt-auto p-4 fixed bottom-0 w-[219px] lg:w-[279px]">
                        <Card x-chunk="dashboard-02-chunk-0">
                            <CardHeader className="p-2 pt-0 md:p-4">
                                <CardTitle>Seja Pro</CardTitle>
                                <CardDescription>
                                    Desbloqueie todos os recursos, incluindo a criação de ligas para vários esportes e acesso às copas!
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                <Button size="sm" className="w-full">
                                    Upgrade
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Link
                                    to="#"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <img src={corLogo === "dark" ? "/logo-sem-fundo-branco.png" : "/logo-sem-fundo.png"} width={40} />
                                    <span className="sr-only">Champions Gaming</span>
                                </Link>
                                <Link
                                    to="/"
                                    onClick={() => setBtnSelecionado('Home')}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                                {/* <Link
                                    to="/criar-liga"
                                    onClick={() => setBtnSelecionado('Criar liga')}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <Shield className="h-4 w-4" />
                                    Criar liga
                                </Link> */}
                                <Link
                                    to="/minhas-ligas"
                                    onClick={() => setBtnSelecionado('Minhas Ligas')}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <ShieldHalf className="h-4 w-4" />
                                    Minhas Ligas
                                </Link>
                                <Link
                                    to="#"
                                    onClick={() => setBtnSelecionado('Artilheiros')}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <FontAwesomeIcon icon={faFutbol} className="h-4 w-4" />
                                    Artilheiros
                                </Link>
                                <Link
                                    to="#"
                                    onClick={() => setBtnSelecionado('Analytics')}
                                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                >
                                    <LineChart className="h-4 w-4" />
                                    Analytics
                                </Link>
                            </nav>
                            <div className="mt-auto">
                                <Card>
                                    <CardHeader className="p-2 pt-0 md:p-4">
                                        <CardTitle>Seja Pro</CardTitle>
                                        <CardDescription>
                                            Desbloqueie todos os recursos, incluindo a criação de ligas para vários esportes e acesso às copas!
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1">
                        <form>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="procurar..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                />
                            </div>
                        </form>
                    </div>
                    <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                        <Bell className="h-4 w-4" />
                        <span className="sr-only">Toggle notifications</span>
                    </Button>
                    <ModeToggle onChange={onChangeTheme} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full">
                                <CircleUser className="h-5 w-5" />
                                <span className="sr-only">Toggle user menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer flex">Configurações</DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer flex">Suporte</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer flex justify-between" onClick={() => sair()}>Sair <LogOut /></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}

export default Layout;

