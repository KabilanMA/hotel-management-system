import useFetch from "../useFetch";
import { useState } from "react";
import EditOverlay from './EditOverlay';

// import EditOverlay from "./EditOverlay";


const AllCustomers = () => {

    var {data, isPending, error} = useFetch('https://hotel-network-manager1.herokuapp.com/api/get-all-customers')

    let [edit, setEdit] = useState(false);
    let [userid, setId] = useState(0);

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this customer?")){
            let res = await fetch('/api/delete-user/'+id, {
                method: 'DELETE',
                headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                }
            });

            let result = await res.json();
            if(result && result.success) {
                console.log("Successfully deleted");
            }
        }
    }

    const handleEdit = (user_id) => {
        setId(user_id)
        setEdit(true);
    }

    return (
        <>
        <h2>All Customers</h2>
        {isPending && <p> Loading...</p>}
        {error && <p>ERROR OCCURED!! : {error} </p>}
        {edit && <EditOverlay visibility={true} userid={userid} onClick={()=>setEdit(false)}/>}
        {data && 
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>First name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Type</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.result.map(customer => (
                        <tr key={customer.user_id}>
                        <td> {customer.first_name} </td>
                        <td> {customer.last_name} </td>
                        <td> {customer.email} </td>
                        <td> {customer.type} </td>

                        <td><a href={window.location.href} className="btn btn-danger" 
                        onClick={() =>handleDelete(customer.user_id)}
                        >Delete</a></td>
                        <td><button className="btn btn-info"
                         onClick={() => handleEdit(customer.user_id)} 
                        >Edit</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        }
        </>
    );
}
 
export default AllCustomers;