import React from 'react';
import SubmitButton from '../SubmitButton';
import './editoverlay.css';


class EditOverlay extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visibility: props.visibility,
            roomID: props.roomID,
            hotelID: -1,
            name: '',
            num_of_people: -1,
            ac_or_non_ac: '',
            price: -1,
        }
    }

    async makeChange() {
        if(this.state.roomID > 0) {
            try{
                let res = await fetch('https://hotel-network-manager1.herokuapp.com//modifyRoom', {
                    method:'POST', 
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        roomID: this.state.roomID,
                        hotelID: this.state.hotelID,
                        name: this.state.name,
                        num_of_people: this.state.num_of_people,
                        ac_or_non_ac: this.state.ac_or_non_ac,
                        price: this.state.price,
                    }),
                })

                let result = await res.json();
                if(result && result.success) {
                    alert("Successfully Updated");
                    window.location.reload(false);
                }else {
                    alert("Data didn't modify completely. Refresh and try again");
                }
            }catch(err){
                console.log(err);
            }
        }
    }

    render() {
        return(
            <div className='overlay' style={{
                display: (this.state.visibility ? 'display' : 'none'),
            }}>
                <div className='container-overlay rounded'>
                <button type='button' className='btn btn-danger' style={{
                    padding: '0px 10px',
                    paddingBottom:'2px',
                    marginRight:'5px',
                    marginTop:'5px',
                    float:'right',
                    marginBottom:'10px'
                }} onClick={()=>{
                    this.setState({
                    visibility: false
                    });
                    this.props.onClick()
                    }
                }>&times;</button>
                    <form className='ml-5 mt-2' style={{
                        paddingLeft:'10px', paddingRight:'10px'
                    }}>
                        <div className='form-group mb-3'>
                            <label style={{color: "black", paddingLeft:'10px'}}htmlFor='hotelID' className='mb-1'>Hotel ID</label>
                            <input className='form-control' id='hotelID' placeholder='Fill if wanted to change' min="1" onChange={(e)=>{this.setState({
                                hotelID: e.target.value
                            })}}></input>
                        </div>
                        <div className='form-group mb-3'>
                            <label style={{color: "black", paddingLeft:'10px'}}htmlFor='name' className='mb-1'>Name</label>
                            <input className='form-control' id='name' placeholder='Fill if wanted to change' onChange={(e)=>{this.setState({
                                name: e.target.value
                            })}}></input>
                        </div>
                        <div className='form-group mb-3'>
                            <label style={{color: "black", paddingLeft:'10px'}}htmlFor='num_of_people' className='mb-1'>Number of People</label>
                            <input type='number' className='form-control' id='num_of_people' placeholder='Fill if wanted to change' min="1" onChange={(e)=>{this.setState({
                                num_of_people: e.target.value
                            })}}></input>
                        </div>
                        <div className='form-group mb-3'>
                            <label style={{color: "black", paddingLeft:'10px'}}htmlFor='ac_or_non_ac' className='mb-1'>Is AC</label>
                            <select className="form-select" aria-label="Default select example" id="ac_or_non_ac"
                                onChange={(e)=>{this.setState({
                                    ac_or_non_ac: e.target.value
                                })}}>
                                <option value="" defaultValue>Choose if wanted to change</option>
                                <option value="ac">AC</option>
                                <option value="non-ac">NON AC</option>
                            </select>
                        </div>
                        <div className='form-group mb-3'>
                            <label style={{color: "black", paddingLeft:'10px'}}htmlFor='price' className='mb-1'>Price</label>
                            <input type='number' className='form-control' id='price' placeholder='Fill if wanted to change' min="1000" onChange={(e)=>{this.setState({
                                price: e.target.value
                            })}}></input>
                        </div>
                    </form>
                    <div className='btn-center mb-3'>
                        <SubmitButton className='col btn-primary ' text='Make Change' onClick={()=>this.makeChange()}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default EditOverlay;