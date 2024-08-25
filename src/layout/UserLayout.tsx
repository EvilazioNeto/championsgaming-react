import { ReactNode } from "react";
import Header from "../components/Header/Header";

function UserLayout({ children }: { children: ReactNode }) {
    return (
        <>
            <Header />
            {children}
        </>
    )
}

export default UserLayout;
