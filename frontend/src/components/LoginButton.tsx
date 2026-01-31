import { useState } from "react"

export const LoginButton = () => {

    //TODO: Replace with userlogin
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)

    return (
        <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer" onClick={() => setIsUserLoggedIn(!isUserLoggedIn)}>
            {isUserLoggedIn ? "LOG OUT" : "LOGIN"}
        </button>
    )
}