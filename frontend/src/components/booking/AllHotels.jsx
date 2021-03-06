import useFetch from "../useFetch";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './AllHotels.css';
import SearchHotelCard from "../searchHotelCard/searchHotelCard";


const AllHotels = () => {

    const [searchName, setSearchName] = useState()
    const [filterCity, setFilterCity] = useState()
    const [filterStreetName, setFilterStreetName] = useState()
    const [filterStreetNumber, setFilterStreetNumber] = useState()
    var {data, isPending, error} = useFetch('http://localhost:3001/book/hotels')
    const [reRender, setreRender] = useState(false)  
    if(isPending){
        var data = null
    }else{
        if(data){
            data.hotels.forEach(hotel => {
                hotel.selectUrl = `/hotel/${hotel.hotelID}`
            });
        }
    }

    useEffect(()=>{
        setreRender(false)
    }, [reRender])

    const handleSearch = async ()=>{
        let url = "/book/hotels"
        if(searchName || filterCity || filterStreetName || filterStreetNumber){
            url = url + "/?"
        }
        if(searchName)  url = url + `name=${searchName}&`
        if(filterCity && filterCity!=="byCity")  url = url + `city=${filterCity}&`
        if(filterStreetNumber&& filterStreetNumber!=="byStreetNumber")  url = url + `street_number=${filterStreetNumber}&`
        if(filterStreetName&& filterStreetName!=="byStreetName")  url = url + `street_name=${filterStreetName}&`
        let res = await fetch(url, {
            method:'GET', 
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        let result = await res.json();
        if(result && result.success) {
            data.hotels = result.hotels
            setreRender(true)
        }
    }


    const renderSearchHotelCardRows = ()=>{
        let hotels = data.hotels;
        let finalArr = [], columns = [];
        let j = 0;
        hotels.forEach((hotel, i)=>{
            columns.push(
                <div key={i} className="col-md-12 col-lg-6">
                    <SearchHotelCard hotel={hotel} />
                </div>
            );
            if((i+1)%2 === 0){
                finalArr.push(<div key={i} className="row searchCards">{columns}</div>);
                columns = [];
            }
            j=i;
        });
        if(hotels.length%2===1){
            finalArr.push(<div key={j} className="row searchCards">{columns}</div>);
        }
        return finalArr;
    }

    return (
        <>
        {isPending && <p> Loading...</p>}
        {error && <p>ERROR OCCURED!! : {error} </p>}
        {!isPending && data && 
        <div className="container all-hotels">
            <div className="row">
                <h2>All Hotels</h2>
            </div>
            <div style={{marginLeft:'10px'}}>
                <div className="row mb-3">
                    <div className="col-sm-8 col-lg-3">
                    </div>
                    <div className="col-sm-8 col-lg-3">
                        <select defaultValue={"byCity"} onChange={(e)=>setFilterCity(e.target.value)} >
                            <option value="byCity" >By City</option>
                            {data.cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-8 col-lg-3">
                        <select defaultValue={"byStreetName"} onChange={(e)=>setFilterStreetName(e.target.value)} >
                            <option value="byStreetName">By Street Name</option>
                            {data.streetNames.map(streetName => (
                                <option key={streetName} value={streetName}>{streetName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-sm-8 col-lg-3">
                        <select defaultValue={"byStreetNumber"} onChange={(e)=>setFilterStreetNumber(e.target.value)} >
                            <option value="byStreetNumber">By Street Number</option>
                            {data.streetNumbers.map(StreetNumber => (
                                <option key={StreetNumber} value={StreetNumber}>{StreetNumber}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
            <div>
                <div style={{marginLeft:'10px'}}>
                    <div className="row mb-3">
                        <div className="col-sm-10 col-lg-7">
                            <input type="text" className="form-control" placeholer="Search by hotel name" onChange={(e)=>setSearchName(e.target.value)}/>
                        </div>
                        <button id="searchButton" className="col-sm-2 btn btn-info" onClick={handleSearch}>Search</button>
                    </div>
                </div>   
            </div>
              
            <div>
                {renderSearchHotelCardRows()}
            </div>






        </div>
        }
        </>
    );
}
export default AllHotels;

