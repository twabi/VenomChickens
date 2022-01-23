import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";


var storageRef = Firebase.storage().ref("System/Products");
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


    const addProduct = () => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var name = document.getElementById("name").value;
        var price = document.getElementById("price").value;
        var stockCount = document.getElementById("count").value;
        var productType = document.getElementById("type").value;
        var description =  document.getElementById("desc").value;

        var productID =  Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        if(name.includes("/")){
            alert("The name cannot include a slash, use a dash or another symbol instead")
        } else {
            var object = {
                "name" : name,
                "price" : price,
                "stockCount" : stockCount,
                "productType" : productType,
                "productID" : productID,
                "dateCreated" : timeStamp,
                "description" : description
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


                    storageRef.child(productID).child("image").put(file).then(function(snapshot) {
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
                           name="Product name"
                           rules={[{ required: true, message: 'Please input product name!' }]}>
                    <Input placeholder="enter product name" id="name"/>
                </Form.Item>
                <Form.Item label="Product Type">
                    <Input placeholder="enter product type" id="type"/>
                </Form.Item>
                <Form.Item label="Product Unit Price (MWK)"
                           name="price"
                           rules={[{ required: true, message: 'Please input product price!' }]}>
                    <Input type="number" placeholder="enter user phone number" id="price"/>
                </Form.Item>
                <Form.Item label="Stock Count" name="count"
                           rules={[{ required: true, message: 'Please input stock count!' }]}>
                    <Input type="number" placeholder="enter stock count" id="count"/>
                </Form.Item>
                <Form.Item label="Product Description">
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
