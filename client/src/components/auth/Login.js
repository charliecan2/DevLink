import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { email, password } = formData;

    function onChange(event){
        setFormData({ ...formData, [event.target.name]: event.target.value})
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        console.log('Success!');
    }

    return (
        <section className="container">
            <div className="alert alert-danger">
                Invalid credentials
            </div>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
            <form className="form" action="dashboard.html" onSubmit={onSubmit}>
                <div className="form-group">
                <input
                    type="email"
                    placeholder="Email Address"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={onChange}
                />
                </div>
                <input
                    type="submit" 
                    className="btn btn-primary" 
                    value="Login" 
                />
            </form>
            <p className="my-1">
                Don't have an account? <Link to='/register'>Sign Up</Link>
            </p>
        </section>
    )
}

export default Login;
