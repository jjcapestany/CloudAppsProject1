import { Link } from "react-router-dom"
import { LoginButton } from "./LoginButton"

export const Header = () => {
    return (
        <div className="flex flex-row bg-white p-4 justify-between">
            <Link className="font-bold text-3xl text-[#BF5700]" to={"/"}>LONGHORNS HARDWARE</Link>
            <Link className="flex text-[#BF5700] border border-[#BF5700] p-2 rounded cursor-pointer hover:bg-[#BF5700] hover:text-white" to={"/projects"}>PROJECTS</Link>
            <LoginButton/>
        </div>
    )
}