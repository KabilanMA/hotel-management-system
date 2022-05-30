import { useState } from "react";
import { useNavigate } from "react-router-dom"

const CreateRoom = () => {

    const [hotelID, setHotelID] = useState(0)
    const [name, setName] = useState('')
    const [num_of_people, setNumOfPeople] = useState(0)
    const [ac_or_non_ac, setIsAC] = useState('ac')
    const [price, setPrice] = useState(0)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {

        e.preventDefault()

        if (name.length > 254) {
            setError(" Name cannot exceed 254 characters!")
        }
        else {
            setIsPending(true)
            const roomData = { hotelID, name, num_of_people, ac_or_non_ac, price }
            fetch('https://hotel-network-manager1.herokuapp.com/api/create-room', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(roomData),
                
            })
                .then(response => {
                    if (!response.ok) throw Error("Could not fetch the data")
                    response.json()
                })
                .then(data => {
                    console.log('room created: ', data);
                    setIsPending(false)
                    console.error('Success:', data)
                    setError('')
                    navigate("/moderator/all-rooms")
                })
                .catch((error) => {
                    console.error('Error:', error);
                    setIsPending(false)
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

            <h3> Create room </h3>
            <div className="container">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="row mb-3">
                        <label htmlFor="inputHotelID" className="col-sm-2 col-form-label">Hotel ID</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="number" className="form-control" id="inputHotelID" min="1"
                                onChange={(e) => setHotelID(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputName" className="col-sm-2 col-form-label">Name</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="text" className="form-control" id="inputName"
                                onChange={(e) => setName(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputNumOfPeople" className="col-sm-2 col-form-label">Number of People</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="number" className="form-control" id="inputNumOfPeople" min="1"
                                onChange={(e) => setNumOfPeople(e.target.value)} required />
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputIsAC" className="col-sm-2 col-form-label">Is AC</label>
                        <div className="col-sm-10 col-lg-7">
                            <select className="form-select" aria-label="Default select example" id="inputIsAC"
                                onChange={(e) => setIsAC(e.target.value)} required>
                                <option value="ac" defaultValue>AC</option>
                                <option value="non-ac">NON AC</option>
                            </select>
                        </div>
                    </div>
                    <div className="row mb-3">
                        <label htmlFor="inputPrice" className="col-sm-2 col-form-label">Price</label>
                        <div className="col-sm-10 col-lg-7">
                            <input type="number" className="form-control" id="inputPrice" min="1000"
                                onChange={(e) => setPrice(e.target.value)} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary">Create Room</button>
                </form>
                {isPending && <p> Adding room...</p>}
            </div>
        </>
    );
}

export default CreateRoom;