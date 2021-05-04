import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    function onChange(event){
        setFormData({ ...formData, [event.target.name]: event.target.value})
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if(password !== password2){
            console.log('Passwords do not match')
        }
        else{
            console.log('Success!');
        }
    }

    return (
        <section className="container">
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" action="create-profile.html" onSubmit={e => onSubmit()}>
                <div className="form-group">
                <input 
                    type="text" 
                    placeholder="Name" 
                    name="name" 
                    value={name} 
                    onChange={onChange}
                    required 
                />
                </div>
                <div className="form-group">
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    name="email"
                    value={email}
                    onChange={onChange}
                    required 
                />
                <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
                    Gravatar email</small>
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    minLength="6"
                    value={password}
                    onChange={onChange}
                    required
                />
                </div>
                <div className="form-group">
                <input
                    type="password"
                    placeholder="Confirm Password"
                    name="password2"
                    minLength="6"
                    value={password2}
                    onChange={onChange}
                    required
                />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to='login'>Sing In</Link>
            </p>
        </section>
    )
}

export default Register;
