import { Outlet } from "react-router-dom"
function AuthLayout() {
    return (
        <div className="">
            <div>
                <h2 className="capitalize">Xush kelibsiz</h2>
                <Outlet />
            </div>
        </div>
    )
}

export default AuthLayout