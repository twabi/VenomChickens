import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";
import {useAuthState} from "react-firebase-hooks/auth";

const logRef = Firebase.database().ref('System/Logs');
const moment = require('moment');

const EditStock = (props) => {

    const [user] = useAuthState(Firebase.auth());
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(props.editBranch);
    const [selectedProduct, setSelectedProduct] = useState(props.product);
    const [userID, setUserID] = useState(null);


    useEffect(() => {
        setSelectedBranch(props.editBranch);
        setSelectedProduct(props.product);
        if(user){
            setUserID(user.uid);
            //setUserName(user.email);
        }
    }, [props, user])


    const editBranch = (values) => {
        //setShowLoading(true);
        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var branchID = selectedBranch.branchID;
        var productID = selectedProduct.productID;
        var logID = Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var endpoint = "Branches/" + branchID+"/products";

        var object = {
            updatedAt : timeStamp,
            updatedBy : userID,
            stockCount : values.count
        };

        var logObject = {
            type : "stockUpdate",
            branch : branchID,
            oldCount : selectedProduct.stockCount,
            newCount : values.count,
            updatedBy : userID,
            updatedAt : timeStamp
        }

        console.log(logObject);

        const output = FireFetch.updateInDB(endpoint, productID, object);
        output.then((result) => {
            if(result === "success"){
                const output2 = FireFetch.SaveTODB("Logs", logID, logObject);
                setMessage("Stock count updated successfully");
                setShowLoading(false);
                setShowAlert(true);
                setColor("success");
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2100);


            }
        }).catch((error) => {
            setMessage("Unable to update stock count, an error occurred :: " + error);
            setColor("danger");
            setShowAlert(true);
            setShowLoading(false);
        })



    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editBranch}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    count: selectedProduct&&selectedProduct.stockCount,
                }}
            >
                <Form.Item label="Stock Count" name="count"
                           rules={[]}>
                    <Input type="number" placeholder="enter stock count"/>
                </Form.Item>

                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3 font-italic" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }

                <Button appearance="primary" htmlType="submit" isLoading={showLoading}>
                    Update
                </Button>

            </Form>


        </div>
    )

}

export default EditStock;
