import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getCurrentProfile } from '../../actions/profile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const Dashboard = ({ getCurrentProfile, auth : { user }, profile: { profile, loading} }) => {
    useEffect(() => {
        getCurrentProfile();
    }, [])

    return (loading && profile === null ? (<Spinner />) : 
    (<Fragment>
        <div className="container">
        <h1 className="large text-primary">Dashboard</h1>
        <p className="lead">
            <FontAwesomeIcon icon={faUser}/> Welcome { user && user.name}
        </p>
        </div>
        {profile !== null ? 
        (<Fragment>Has</Fragment>) : (
        <Fragment>
            <div className="container">
                <p>You have not yet setup a profile, please add some info</p>
                <Link to="/create-profile" className="btn btn-primary my-1">
                    Create Profile
                </Link>
            </div>
        </Fragment>
        )}
    </Fragment>))
}

Dashboard.propTypes = {
    getCurrentProfile: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    profiles: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile })(Dashboard)
