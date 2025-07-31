import { useOutletContext } from "react-router-dom"

function ApartmentLoginPage() {
    const {developmentBackendLink, productionBackendLink, setErrorAlert, navigate, setSuccessAlert} = useOutletContext();

    const apartment_login_submit = (event) => {
        event.preventDefault()

        const requestBody = {
            apartment_name: event.target.apartment_name.value,
            password: event.target.password.value,  
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        fetch(`${developmentBackendLink}/apartment-login`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    setErrorAlert(data.error_message)
                    console.log(data.error_message)
                    return
                }
                setSuccessAlert("Apartment president successfully logged in")
                sessionStorage.removeItem("resident")
                sessionStorage.setItem("apartment", JSON.stringify(data.user))
                navigate("/apartment-dashboard")
            })
    }
    return (
        <div>
            <form onSubmit={apartment_login_submit}  method="post">
                <h1>Apartment Login</h1>
                <input type="text" name="apartment_name" id="apartment_name" placeholder="Enter Apartment Name" className="form-control" />
                <br />
                <input type="password" name="password" id="password" placeholder="Enter Password" className="form-control" />
                <br />
                <button role="submit" className="btn btn-primary">Enter</button>
            </form>
        </div>
    )
}

export default ApartmentLoginPage