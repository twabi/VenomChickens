import React, {useEffect, useState} from "react";
import {MDBContainer, MDBRow, MDBFooter, MDBAlert} from "mdbreact";
import { MDBBtn, MDBCard, MDBCardBody, MDBCol } from 'mdbreact';
import {MDBInput } from 'mdbreact';
import logo from "../../logo.png";
import 'mdbreact/dist/css/mdb.css';
import Button from "@material-tailwind/react/Button";
import { useHistory } from 'react-router-dom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import Firebase from "../Firebase";
import { Input } from 'antd';
import {LockOutlined, MailOutlined} from '@ant-design/icons';

const dbRef = Firebase.database().ref("System/Users");
const Login = () => {
    const history = useHistory();
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
    ] = useSignInWithEmailAndPassword(Firebase.auth());
    const [showLoading, setShowLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [color, setColor] = useState("info");

    const handleEmail = ({target : {value}}) => {
        setEmail(value);
    };

    useEffect(() => {
        if(email !== null){
            setShowAlert(false);
        }
        
        if(user){
            var userArray = [];
            dbRef.on("child_added", function (snapshot) {
               var oneUser = snapshot.val();
               userArray.push(oneUser);

               var thisUser = userArray[userArray.findIndex(x => x.email === email)];
               console.log(thisUser);
               if(thisUser !== undefined){
                   var role = thisUser.role;
                   if(role === "SalesRep"){
                       setShowLoading(false);
                       setShowAlert(true);
                       setColor("danger");
                       setErrorMessage("A salesrep cannot access this platform. Contact your Supervisor for more.");

                   } else if(role === "Admin") {
                       setShowLoading(false);
                       gotoHome();
                   }
               }
            });

        }

        if(error){
            setShowLoading(false);
            setShowAlert(true);
            setColor("danger");
            setErrorMessage(error.message);
        }

        if(loading){
            setShowLoading(true);
        }
    }, [email, error, loading, user])


    const handlePassword = ({target : {value}}) => {
        setPassword(value);
    };

    const handleForgot = () => {
        history.push("/forgot");
    };

    const gotoHome = () => {
        history.push("/home");
    };

    const handleLogin = () => {
        
        if((email == null || password == null) || (email === "" || password === "")) {
            setErrorMessage("Fields cannot be left empty!");
            setShowAlert(true);
        } else {
            setShowLoading(true);
            signInWithEmailAndPassword(email, password)
        }

    }

    return (
        <div className="vh-100">

            <MDBContainer >
                <MDBRow center={true}>
                    <MDBCol md="4" className="my-5">
                        <MDBCard  className="my-5 p-3">
                            <MDBCardBody>
                                <MDBRow className="mb-4">
                                    <MDBCol>
                                        <img src={logo} style={{width:"10rem", height:"10rem"}} className="rounded mx-auto d-block" alt="aligment" />
                                    </MDBCol>
                                </MDBRow>
                                <form className="mt-4">
                                    <div className="grey-text mt-4">

                                        <Input size="large"
                                               type="email"
                                               placeholder="Your email address"
                                               className="my-3"
                                               prefix={<MailOutlined style={{color:"#ffa610"}}/>}
                                               onChange={handleEmail}
                                               value={email}
                                        />
                                        <Input.Password
                                            size="large"
                                            placeholder="Your password"
                                            value={password}
                                            className="mt-2 mb-3"
                                            onChange={handlePassword}
                                            prefix={<LockOutlined style={{color:"#ffa610"}}/>}
                                        />

                                    </div>

                                    {showAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3" >
                                                {errorMessage}
                                            </MDBAlert>
                                        </>
                                        : null }


                                    <div className="text-center py-4 mt-3">
                                        <Button className="w-100 bg-orange-500"  onClick={handleLogin} type="primary" shape="round" size="large">
                                            LOGIN {showLoading ? <div className="spinner-border mx-2 text-white spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : null}
                                        </Button>
                                    </div>
                                </form>
                            </MDBCardBody>
                            <MDBFooter>
                                <div className="text-center text-black-50 d-flex justify-content-center mb-3">
                                    forgot your password? <a onClick={handleForgot} href className="font-italic orange-text"> click here</a>
                                </div>
                            </MDBFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    )
}

export default Login;
