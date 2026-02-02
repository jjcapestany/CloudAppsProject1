import { useState } from "react"

export const LoginButton = () => {

    //TODO: Replace with userlogin
    const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false)

    return (
        <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer w-40 font-bold" onClick={() => setIsUserLoggedIn(!isUserLoggedIn)}>
            <span className="mx-auto">{isUserLoggedIn ? "LOG OUT" : "LOGIN"}</span>
        </button>
    )
}