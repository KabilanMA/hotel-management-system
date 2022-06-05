import React from 'react';
import InputField from './InputField';
import SubmitButton from './SubmitButton';
import UserStore from './stores/UserStore';

class LoginForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            buttonDisabled: false,
        };
    }

    setInputValue(property, val) {
        val = val.trim();
        if(val.length > 20) {
            return
        }
        this.setState({
            [property]: val,
        });
    }

    async doLogin() {
        if(!this.state.email) {
            alert("Enter Email");
            return;
        }
        if(!this.state.password) {
            alert("Enter password");
            return;
        }

        this.setState({
            buttonDisabled: true,
        });

        try {
            let res = await fetch('https://hotel-network-manager1.herokuapp.com/login', {
                method: 'POST',
                headers : {
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: this.state.email,
                    password: this.state.password
                }),
                credentials:'include',
                mode:'cors'
            })

            let result = await res.json();
            console.log(result);
            if(result && result.success) {
                UserStore.modifyObservable(false, true, result.first_name, result.email, result.type);
            } else if(result && result.success === false) {
                this.resetForm();
                alert(result.msg);
            }
        } catch(error) {
            console.log(error);
            this.resetForm();
        }
    }

    resetForm() {
        this.setState({
            email: '',
            password: '',
            buttonDisabled: false,
        });
    }

    render() {
        return (
            <div className = 'loginform'>
                <h3>Log In</h3>
                <InputField 
                    type='text'
                    className='mt-4 mb-3'
                    placeholder='Email'
                    value={this.state.email ? this.state.email : ''}
                    onChange = {(val)=> this.setInputValue('email', val)}
                />
                <InputField 
                    type='password'
                    placeholder='password'
                    value={this.state.password ? this.state.password : ''}
                    onChange = {(val)=> this.setInputValue('password', val)}
                />

                <SubmitButton 
                    text='Login'
                    className='btn btn-secondary mt-4'
                    disabled={this.state.buttonDisabled}
                    onClick={()=> this.doLogin()}
                />
            </div>
        );
    }
}

export default LoginForm;