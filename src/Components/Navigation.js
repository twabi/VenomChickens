import React, {Fragment} from "react";
import {
    Switch,
    Route,
} from "react-router-dom";
import ForgotPassword from "./Auth/ForgotPassword";
import Login from "./Auth/Login";
import Home from "./Pages/Home";
import Employees from "./Pages/Employees";
import Dealers from "./Pages/Dealers/Dealers";
import DealerDetails from "./Pages/Dealers/DealerDetails";


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

                <Route path="/home" render={(props) => (
                    <Home {...props} />)} exact />

                <Route path="/employees" render={(props) => (
                    <Employees {...props} />)} exact />

                <Route path="/dealers" render={(props) => (
                    <Dealers {...props} />)} exact />

                <Route path="/dealers/:id" render={(props) => (
                    <DealerDetails {...props} />)} exact />
            </Switch>
        </Fragment>
    );

}

export default Navigation;
