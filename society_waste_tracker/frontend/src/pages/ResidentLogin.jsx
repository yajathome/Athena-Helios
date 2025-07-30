import { useOutletContext } from "react-router-dom"

function ResidentLoginPage() {
    const {developmentBackendLink, productionBackendLink} = useOutletContext();

    const resident_login_submit = (event) => {
        event.preventDefault()

        const requestBody = {
            apartment: event.target.apartment.value,
            flat: event.target.flat.value,
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
                console.log(data);
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