import { useEffect, useState } from "react"
import type { Hardware } from "../types"
import { getHardwareResources, requestHardware, returnHardware } from "../client"

export const HardwareManagement = () => {

    const [hardwareState, setHardwareState] = useState<Hardware[]>([])
    const [projectId, setProjectId] = useState<string>("")
    const [setOneRequest, setSetOneRequest] = useState<number>(0)
    const [setTwoRequest, setSetTwoRequest] = useState<number>(0)
    const [setOneReturn, setSetOneReturn] = useState<number>(0)
    const [setTwoReturn, setSetTwoReturn] = useState<number>(0)
    const [returnFormVisible, setReturnFormVisible] = useState<boolean>(false)

    const [message, setMessage] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (!message && !error) return;
        const timer = setTimeout(() => {
            setMessage("");
            setError("");
        }, 5000);
        return () => clearTimeout(timer);
    }, [message, error]);

    useEffect(() => {
        getHardwareResources()
        .then(resp => {setHardwareState(resp)})
        .catch(() => setError("Failed to load Hardware Resources"))
    }, [])

    const onRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsSubmitting(true)

        try {
            await requestHardware(projectId, [
                { set: "HW Set 1", quantity: setOneRequest },
                { set: "HW Set 2", quantity: setTwoRequest }
            ])
            getHardwareResources().then(resp => setHardwareState(resp))
            setMessage("Hardware requested successfully")
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to request hardware')
        } finally {
            setIsSubmitting(false)
        }
    }

    const onReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setMessage("")
        setIsSubmitting(true)

        try {
            await returnHardware(projectId, [
                { set: "HW Set 1", quantity: setOneReturn },
                { set: "HW Set 2", quantity: setTwoReturn }
            ])
            getHardwareResources().then(resp => setHardwareState(resp))
            setMessage("Hardware returned successfully")
        } catch (err: unknown) {
            const error = err as { response?: { data?: { error?: string } } };
            setError(error.response?.data?.error || 'Failed to return hardware')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="grow bg-[#333f48] text-white p-4 gap-4 items-center flex flex-col">

            {error && (
                <div data-testid="hardware-error" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {message && (
                <div data-testid="hardware-message" className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {message}
                </div>
            )}

            <span className="text-xl font-bold">Hardware Resource Management</span>
            <div className="flex flex-col gap-2 items-center">
                <label className="text-sm">Project ID</label>
                <input
                    data-testid="hardware-project-id"
                    type="text"
                    className="border border-[#BF5700] p-2 bg-white text-black rounded"
                    placeholder="Enter Project ID"
                    value={projectId}
                    onChange={(e) => setProjectId(e.target.value)}
                />
            </div>
            <table data-testid="hardware-table" className="border border-white">
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
                            <input data-testid={`request-${h.set === "HW Set 1" ? "set1" : "set2"}`} type="number" className="border border-[#BF5700] p-2 bg-white text-black w-20 mx-auto" placeholder="0"
                                onChange={(e) => h.set === "HW Set 1" ? setSetOneRequest(Number(e.target.value)) : setSetTwoRequest(Number(e.target.value))}/>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button data-testid="hardware-submit-request" className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold mt-4" onClick={onRequestSubmit}>
                SUBMIT REQUEST
            </button>
            <button data-testid="hardware-return-btn" className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold mt-4" onClick={() => setReturnFormVisible(!returnFormVisible)}>
                RETURN EQUIPMENT
            </button>
            {returnFormVisible &&
                <div data-testid="hardware-return-form" className="flex flex-col gap-4 bg-white  text-black p-4 rounded">
                    <table data-testid="hardware-return-table" className="border border-black">
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
                                    <input data-testid={`return-${h.set === "HW Set 1" ? "set1" : "set2"}`} type="number" className="border border-[#BF5700] p-2 bg-white text-black w-20 mx-auto" placeholder="0"
                                        onChange={(e) => h.set === "HW Set 1" ? setSetOneReturn(Number(e.target.value)) : setSetTwoReturn(Number(e.target.value))}/>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button data-testid="hardware-return-submit" className="flex bg-[#BF5700] text-white p-2 rounded cursor-pointer font-bold text-center mx-auto" onClick={onReturnSubmit}>
                        SUBMIT
                    </button>
                </div>
            }
        </div>
    )
}