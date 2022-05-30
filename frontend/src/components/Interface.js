import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './admin/SignupForm';

class Interface extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stateVar:props.state,
        }
    }

    render() {
        return(
            <>
                <div className="Container-fluid mt-5 mb-5">
                <ul className="nav nav-pills nav-fill">
                    <li className="nav-item" >
                        <button className="nav-link" onClick={()=>this.setState({stateVar:0})}>Login</button>
                    </li>
                    <li className="nav-item">
                        <button className="nav-link" onClick={()=>this.setState({stateVar:1})}>Signup</button>
                    </li>
                </ul>
                </div>
                {this.state.stateVar === 0 &&
                <LoginForm />}
                {this.state.stateVar === 1 &&<SignupForm />}
            </>
        );
    }
}

export default Interface;