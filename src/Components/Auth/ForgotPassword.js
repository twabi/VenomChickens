import React, {useState} from "react";
import {
    MDBAlert,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBFooter,
    MDBInput,
    MDBRow
} from "mdbreact";
import logo from "../../logo.png";
import {Input} from "antd";
import Button from "@material-tailwind/react/Button";
import {useHistory} from 'react-router-dom';
import Firebase from "../Firebase";
import {MailOutlined, UserOutlined} from "@ant-design/icons";


const ForgotPassword = () => {

    const history = useHistory();
    const [email, setEmail] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [errorMessage, setErrorMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    const handleEmail = ({target : {value}}) => {
        setEmail(value);
    };

    const handleBack = () => {
        history.push("/login");
    };

    const sendEmailAdmin = () => {
        if(email == null || email === "") {
            setColor("danger");
            setErrorMessage("Email field is empty!");
            setShowAlert(true);
        } else {
            setShowLoading(false);
            Firebase.auth().sendPasswordResetEmail(email)
                .then(function () {
                    setColor("info");
                    setErrorMessage("Check your email for the password reset link");
                    setShowAlert(true);
                    setTimeout(() => {
                        setShowAlert(false);
                        handleBack();
                    }, 3000);
                    //handleBack();
                }).catch(function (e) {
                console.log(e)
            });

        }
    }

    return(
        <div className="vh-100">
            <MDBContainer>
                <MDBRow center={true}>
                    <MDBCol md="4" className="my-5">
                        <MDBCard  className="my-5 p-3">
                            <MDBCardBody>
                                <MDBRow>
                                    <MDBCol>
                                        <img src={logo} style={{width:"10rem", height:"10rem"}} className="rounded mx-auto d-block" alt="aligment" />
                                    </MDBCol>
                                </MDBRow>
                                <form>

                                    <div className="grey-text">
                                        <Input size="large"
                                               type="email"
                                               placeholder="Your email address"
                                               className="mt-4 mb-2"
                                               prefix={<MailOutlined style={{color:"#ffa610"}}/>}
                                               onChange={handleEmail}
                                               value={email}
                                        />
                                    </div>

                                    {showAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3" >
                                                {errorMessage}
                                            </MDBAlert>
                                        </>
                                        : null }

                                    <div className="text-center py-4 mt-2">
                                        <Button onClick={sendEmailAdmin} className="w-100 bg-orange-500" type="primary" shape="round" size="large">
                                            REPORT TO ADMIN {showLoading ? <div className="spinner-border mx-2 text-white spinner-border-sm" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div> : null}
                                        </Button>
                                    </div>
                                </form>
                            </MDBCardBody>
                            <MDBFooter>
                                <div className="text-center text-black-50 d-flex justify-content-center mt-1">
                                    <a onClick={handleBack} href className="font-italic orange-text">Back to log in</a>
                                </div>
                            </MDBFooter>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    )
}

export default ForgotPassword;
