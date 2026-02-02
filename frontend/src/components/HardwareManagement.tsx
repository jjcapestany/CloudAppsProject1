import { useEffect, useState } from "react"
import type { Hardware } from "../types"
import { getHardwareResources, requestHardware, returnHardware } from "../client"

export const HardwareManagement = () => {

    const [hardwareState, setHardwareState] = useState<Hardware[]>([])
    const [setOneRequest, setSetOneRequest] = useState<number>(0)
    const [setTwoRequest, setSetTwoRequest] = useState<number>(0)
    const [setOneReturn, setSetOneReturn] = useState<number>(0)
    const [setTwoReturn, setSetTwoReturn] = useState<number>(0)
    const [returnFormVisible, setReturnFormVisible] = useState<boolean>(false)

    useEffect(() => {
        getHardwareResources().then(resp => {setHardwareState(resp)})
    }, [])

    const onRequestSubmit = () => {
        requestHardware([
            { set: "HW Set 1", quantity: setOneRequest },
            { set: "HW Set 2", quantity: setTwoRequest }
        ])
    }

    const onReturnSubmit = () => {
        returnHardware([
            { set: "HW Set 1", quantity: 0 },
            { set: "HW Set 2", quantity: 0 }
        ]).then(() => setReturnFormVisible(false))
    }

    return (
        <div className="grow bg-[#333f48] text-white p-4 gap-4 items-center flex flex-col">
            <span className="text-xl font-bold">Hardware Resource Management</span>
            <table className="border border-white">
                <thead>
                    <tr className="border border-white">
                        <th className="border border-white p-2">Name</th>
                        <th className="border border-white p-2">Capacity</th>
                        <th className="border border-white p-2">Available</th>
                        <th className="border border-white p-2">Request</th>
                    </tr>
                </thead>
                <tbody>
                    {hardwareState.map(h => (
                        <tr key={h.set} className="border border-white">
                            <td className="border border-white p-2">{h.set}</td>
                            <td className="border border-white p-2">{h.capacity}</td>
                            <td className="border border-white p-2">{h.available}</td>
                            <input type="number" className="border border-[#BF5700] p-2 bg-white text-black w-20 mx-auto" placeholder="0" 
                                onChange={(e) => h.set === "HW Set 1" ? setSetOneRequest(Number(e.target.value)) : setSetTwoRequest(Number(e.target.value))}/>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold mt-4" onClick={onRequestSubmit}>
                SUBMIT REQUEST
            </button>
            <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold mt-4" onClick={() => setReturnFormVisible(!returnFormVisible)}>
                RETURN EQUIPMENT
            </button>
            {returnFormVisible &&
                <div className="flex flex-col gap-4 bg-white  text-black p-4 rounded">
                    <table className="border border-black">
                        <thead>
                            <tr className="border border-black">
                                <th className="border border-black p-2">Name</th>
                                <th className="border border-black p-2">Checked Out</th>
                                <th className="border border-black p-2">Return</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hardwareState.map(h => (
                                <tr key={h.set} className="border border-black">
                                    <td className="border border-black p-2">{h.set}</td>
                                    <td className="border border-black p-2">{h.checkedOut}</td>
                                    <input type="number" className="border border-[#BF5700] p-2 bg-white text-black w-20 mx-auto" placeholder="0" 
                                        onChange={(e) => h.set === "HW Set 1" ? setSetOneReturn(Number(e.target.value)) : setSetTwoReturn(Number(e.target.value))}/>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold text-center mx-auto" onClick={onReturnSubmit}>
                        SUBMIT
                    </button>
                </div>
            }
        </div>
    )
}