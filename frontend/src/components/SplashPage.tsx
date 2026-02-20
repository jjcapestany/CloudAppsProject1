import * as BEVO from "../assets/BEVO.png";

export const SplashPage = () => {
    return (
        <div className="grow bg-[#333f48] text-white p-4 gap-4 items-center flex flex-col">
            <img data-testid="splash-logo" src={BEVO.default} alt="Longhorns Logo"/>
        </div>
    )
}