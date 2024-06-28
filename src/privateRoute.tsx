import { Navigate } from "react-router-dom";
import { getUserLocalStorage } from "./contexts/AuthProvider/util";

export function PrivateRoute({ children }: { children: React.ReactNode }) {
    const user = getUserLocalStorage();

    return user && user.token ? (
        <>{children}</>
    ) : (
        <Navigate to="/login" replace />
    );
}
