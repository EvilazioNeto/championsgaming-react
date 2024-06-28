import { ReactNode } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";

function Layout({ children }: { children: ReactNode }) {

    return (
        <>
            <Header />
            <Sidebar />
            {children}
        </>
    )
}

export default Layout;