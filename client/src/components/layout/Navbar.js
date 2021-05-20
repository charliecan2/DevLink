import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

function Navbar({auth: { isAuthenticated, loading }, logout }){
    const authLinks = (
        <ul>
            <li>
                <Link to="/dashboard">
                <FontAwesomeIcon icon={faUser} />{' '} 
                <span className="hide-sm">Dashboard</span>
                </Link>
            </li>
            <li>
                <a onClick={logout} href="#!">
                    <FontAwesomeIcon icon={faSignOutAlt} />{' '} 
                    <span className="hide-sm">Logout</span>
                </a> 
            </li>
        </ul>
    );
    
    const guestLinks = (
        <ul>
            <li>
                <a href="#!">Developers</a>
            </li>
            <li>
                <Link to="/register">
                    Register
                </Link>
            </li>
            <li>
                <Link to="/login">
                    Login
                </Link>
            </li>
        </ul>
    )

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to='/'>
                    <FontAwesomeIcon icon={faCode}/> DevLink
                </Link>
            </h1>
            <Fragment>{isAuthenticated ? authLinks : guestLinks}</Fragment>
        </nav>
    )
}

Navbar.propTypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);