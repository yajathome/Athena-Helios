import { useOutletContext } from "react-router-dom"

function ResidentRegisterPage() {
    const {developmentBackendLink, productionBackendLink} = useOutletContext();

    const resident_register_submit = (event) => {
        event.preventDefault()

        const requestBody = {
            apartment_name: event.target.apartment_name.value,
            flat_number: event.target.flat_number.value,
            password: event.target.password.value,
        }

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        }

        fetch(`${developmentBackendLink}/resident-register`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
    }

    return (
        <div>
            <form onSubmit={resident_register_submit} method="post">
                <h1>Resident Register</h1>
                <input type="text" name="apartment_name" id="apartment_name" placeholder="Apartment Number" className="form-control" />
                <br />
                <input type="text" name="flat_number" id="flat_number" placeholder="Flat Number" className="form-control" />
                <br />
                <input type="password" name="password" id="password" placeholder="Password" className="form-control" />
                <br />
                <button type="submit" className="btn btn-primary">Enter</button>
            </form>
        </div>
    )
}

export default ResidentRegisterPage