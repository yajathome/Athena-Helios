import { useOutletContext } from "react-router-dom"

function ApartmentRegisterPage() {
    const {developmentBackendLink, productionBackendLink} = useOutletContext();

    const apartment_register_submit = (event) => {
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

        fetch(`${developmentBackendLink}/apartment-register`, requestOptions)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
    }

    return (
        <div>
            <form onSubmit={apartment_register_submit} method="post">
                <h1>Apartment Register</h1>
                <input type="text" name="apartment_name" id="apartment_name" placeholder="Apartment Name" className="form-control" />
                <br />
                <input type="password" name="password" id="password" placeholder="Password" className="form-control" />
                <br />
                <button type="submit" className="btn btn-primary">Enter</button>
            </form>
        </div>
    )
}

export default ApartmentRegisterPage