import { useState } from "react";
import { useNavigate } from "react-router-dom"

const CreateCustomer = () => {

    const [firstName, setfirstName] = useState('')
    const [lastName, setlastName] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [mobile, setmobile] = useState(0)
    const [isPending, setisPending] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {

        e.preventDefault()

        if (firstName.length > 254) {
            setError(" Firstname cannot exceed 254 characters!")
        }
        else if (lastName.length > 254) {
            setError(" Lastname cannot exceed 254 characters!")
        }
        else if (email.length > 254) {
            setError(" Email cannot exceed 254 characters!")
        }
        else if (password.length > 254) {
            setError(" Password cannot exceed 254 characters!")
        }
        else if (mobile.length > 10) {
            setError(" Mobile number cannot exceed 10 characters!")
        }
        else {
            setisPending(true)
            const customerData = { first_name: firstName, last_name: lastName, email, password, mobile }

            fetch('https://hotel-network-manager1.herokuapp.com/api/create-customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(customerData),
            })
                .then(response => {
                    if (!response.ok) throw Error("Could not fetch the data")
                    response.json()
                })
                .then(data => {
                    console.log('customer created: ', data);
                    setisPending(false)
                    console.error('Success:', data)
                    setError('')
                    navigate("/admin/all-customers")
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setisPending(false)
                    setError(error.message)
                });

        }
    }

    return (
        <>
            {error &&
                <div class="alert alert-warning" role="alert">
                    {error}
                </div>
            }

            <h3> Create customer </h3>
            <div className="container">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="row mb-3">
                        <label htmlFor="inputFirstname" className="col-sm-2 col-form-label">Firstname</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="text" className="form-control" id="inputFirstname"
                                onChange={(e) => setfirstName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputLastName" className="col-sm-2 col-form-label">Lastname</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="text" className="form-control" id="inputLastName"
                                onChange={(e) => setlastName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Email</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="email" className="form-control" id="inputEmail3"
                                onChange={(e) => setemail(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="password" className="form-control" id="inputPassword3"
                                onChange={(e) => setpassword(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputMobile" className="col-sm-2 col-form-label">Mobile</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="number" className="form-control" id="inputMobile"
                                onChange={(e) => setmobile(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Create Customer</button>
                </form>
                {isPending && <p> Adding customer...</p>}
            </div>
        </>
    );
}

export default CreateCustomer;