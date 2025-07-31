import { useOutletContext } from "react-router-dom"

function ResidentLoginPage() {
    const {developmentBackendLink, productionBackendLink, setErrorAlert, navigate, setSuccessAlert} = useOutletContext();

    const resident_login_submit = (event) => {
        event.preventDefault()

        const requestBody = {
            apartment_name: event.target.apartment.value,
            flat_number: event.target.flat.value,
            password: event.target.password.value,
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        fetch(`${developmentBackendLink}/resident-login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    console.log(data.error_message)
                    setErrorAlert(data.error_message)
                    return
                }
                setSuccessAlert("Successfully logged in")
                sessionStorage.removeItem("apartment")
                sessionStorage.setItem("resident", JSON.stringify(data.user))
                navigate("/resident-dashboard")
            })
    }
    return (
        <div>
            <form onSubmit={resident_login_submit}  method="post">
                <h1>Resident Login</h1>
                <input type="text" name="name" id="apartment" placeholder="Enter Apartment Name" className="form-control" />
                <br />
                <input type="text" name="name" id="flat" placeholder="Enter Flat Number" className="form-control" />
                <br />
                <input type="password" name="password" id="password" placeholder="Enter Password" className="form-control" />
                <br />
                <button role="submit" className="btn btn-primary">Enter</button>
            </form>
        </div>
    )
}

export default ResidentLoginPage