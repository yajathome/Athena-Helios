import { useEffect } from "react";
import { useOutletContext } from "react-router-dom"

function Logout() {
    const { navigate } = useOutletContext()
    useEffect(() => {
        sessionStorage.removeItem("apartment")
        sessionStorage.removeItem("resident")
    }, [])

    navigate("/")

    return (
        <div></div>
    )
}

export default Logout