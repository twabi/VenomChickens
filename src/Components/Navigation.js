import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";


const Navigation = () => {

    return (
        <Fragment>
            <Switch>

                <Route path="/" render={(props) => (
                    <Login {...props} />)} exact />

                <Route path="/login" render={(props) => (
                    <Login {...props} />)} exact />

                <Route path="/forgot" render={(props) => (
                    <ForgotPassword {...props} />)} exact />

            </Switch>
        </Fragment>
    );

}

export default Navigation;
