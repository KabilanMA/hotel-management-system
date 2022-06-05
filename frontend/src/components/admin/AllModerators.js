import useFetch from "../useFetch";
import { useState } from "react";
import EditOverlay from './EditOverlay';

// import EditOverlay from "./EditOverlay";


const AllModerators = () => {

    var {data, isPending, error} = useFetch('https://hotel-network-manager1.herokuapp.com/api/get-all-moderators')

    let [edit, setEdit] = useState(false);
    let [userid, setId] = useState(0);

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this moderator?")){
            let res = await fetch('https://hotel-network-manager1.herokuapp.com/api/delete-user/'+id, {
                method: 'DELETE',
                headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                }
            });

            let result = await res.json();
            if(result && result.success) {
                console.log("Successfully deleted");
                window.location.reload(false);
            }
        }
    }

    const handleEdit = (user_id) => {
        setId(user_id)
        setEdit(true);
    }

    return (
        <>
        <h2>All moderators</h2>
        {isPending && <p> Loading...</p>}
        {error && <p>ERROR OCCURED!! : {error} </p>}
        {edit && <EditOverlay visibility={true} userid={userid} onClick={()=>setEdit(false)}/>}
        {data && 
        <table className="table table-hover">
            <thead>
                <tr>
                    <th>User id</th>
                    <th>Fisrt name</th>
                    <th>Last name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Type</th>
                    <th></th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.result.map(moderator => (
                        <tr key={moderator.user_id}>
                        <td> {moderator.user_id} </td>
                        <td> {moderator.first_name} </td>
                        <td> {moderator.last_name} </td>
                        <td> {moderator.email} </td>
                        <td> {moderator.mobile} </td>
                        <td> {moderator.type} </td>
                        <td><a href={window.location.href} className="btn btn-danger" 
                        onClick={() =>handleDelete(moderator.user_id)}
                        >Delete</a></td>
                        <td><button className="btn btn-info"
                         onClick={() => handleEdit(moderator.user_id)} 
                        >Edit</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
        }
        </>
    );
}
 
export default AllModerators;