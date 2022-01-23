import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";


var storageRef = Firebase.storage().ref("/");
const moment = require("moment");
const EditProductModal = (props) => {

    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [file, setFile] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(props.editProduct)
    const [name, setName] = useState(null);
    const [price, setPrice] = useState(null);
    const [count, setCount] = useState(null);
    const [type, setType] = useState(null);

    const handleFileUpload = (e) => {
        setFile(e.target.files[0])
    }


    useEffect(() => {
        setSelectedProduct(props.editProduct);
        setName(selectedProduct.name); setPrice(selectedProduct.price);
        setCount(selectedProduct.stockCount); setType(selectedProduct.productType);
    }, [props, selectedProduct])


    const editProduct = (values) => {
        setShowLoading(true);

        var object = {
            "name" : values.name,
            "price" : values.price,
            "description" : values.description,
            "productType" : values.type,
        };

        const output = FireFetch.updateInDB("Products", selectedProduct.productID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Product edited successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);

                storageRef.child("products").child(selectedProduct.productID).put(file).then(function(snapshot) {
                    console.log('Uploaded a blob or file!');
                });


            }
        }).catch((error) => {
            setMessage("Unable to edit product, an error occurred :: " + error);
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
                onFinish={editProduct}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    name: selectedProduct.name,
                    price: selectedProduct.price,
                    type: selectedProduct.productType,
                    description: selectedProduct.description,
                }}
            >
                <Form.Item label="Upload Product Image">
                    <Input type="file"
                           style={{ width: "100%" }}
                           accept="image/*"
                           onChange={handleFileUpload}
                           placeholder="product image" id="prodImage"/>
                </Form.Item>

                <Form.Item label="Product name" name={"name"}>
                    <Input placeholder="enter product name" id="name" onChange={e => setName(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Product Type" name={"type"}>
                    <Input placeholder="enter product type" id="type" onChange={e => setType(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Product Unit Price (MWK)" name={"price"}>
                    <Input type="number" placeholder="enter user phone number" id="price" onChange={e => setPrice(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Description" name={"description"}>
                    <Input placeholder="enter product description" id="description" />
                </Form.Item>

                {showAlert?
                    <>
                        <MDBAlert color={color} className="my-3 font-italic" >
                            {message}
                        </MDBAlert>
                    </>
                    : null }

                <Form.Item>
                    <Button appearance="primary" htmlType="submit" isLoading={showLoading}>
                        Edit
                    </Button>
                </Form.Item>

            </Form>

        </div>
    )

}

export default EditProductModal;
