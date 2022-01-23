import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";


var storageRef = Firebase.storage().ref("/");
const moment = require("moment");
const CreateProductModal = (props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0])
    }


    const addProduct = (values) => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var productID =  Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var object = {
            "name" : values.name,
            "price" : values.price,
            "productType" : values.type,
            "productID" : productID,
            "dateCreated" : timeStamp,
            "description" : values.description
        };


        const output = FireFetch.SaveTODB("Products", productID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Product added successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);


                storageRef.child("products").child(productID).put(file).then(function(snapshot) {
                    console.log('Uploaded a blob or file!');
                });
            }
        }).catch((error) => {
            setMessage("Unable to add product, an error occurred :: " + error);
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
                onFinish={addProduct}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item label="Upload Product Image"
                           name="images"
                           rules={[{ required: true, message: 'Please upload at-least one product image!' }]}>
                    <Input type="file"
                           style={{ width: "100%" }}
                           accept="image/*"
                           onChange={handleFileUpload}
                           placeholder="product image" id="prodImage"/>
                </Form.Item>

                <Form.Item label="Product name"
                           name="name"
                           rules={[{ required: true, message: 'Please input product name!' }]}>
                    <Input placeholder="enter product name" id="name"/>
                </Form.Item>
                <Form.Item label="Product Type" name="type">
                    <Input placeholder="enter product type" id="type"/>
                </Form.Item>
                <Form.Item label="Product Unit Price (MWK)"
                           name="price"
                           rules={[{ required: true, message: 'Please input product price!' }]}>
                    <Input type="number" placeholder="enter user phone number" id="price"/>
                </Form.Item>
                <Form.Item label="Product Description" name="description">
                    <Input placeholder="enter product description (any)" id="desc"/>
                </Form.Item>

                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3 font-italic" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }

                <Button appearance="primary" htmlType="submit" isLoading={showLoading}>
                    Create
                </Button>

            </Form>

        </div>
    )

}

export default CreateProductModal;
