import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import {useListVals} from "react-firebase-hooks/database";
import Firebase from "../../Firebase";

const moment = require("moment");
const branchRef = Firebase.database().ref('System/Branches');
const userRef = Firebase.database().ref('System/Users');
const prodRef = Firebase.database().ref('System/Products');
const dealerRef = Firebase.database().ref('System/Dealers');
const CreateSaleModal = (props) => {

    const [products] = useListVals(prodRef);
    const [users] = useListVals(userRef);
    const [dealers] = useListVals(dealerRef);
    const [branches] = useListVals(branchRef);
    const [gender, setGender] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(null);

    function onChange(option) {
        console.log(option);
    }


    const addSale = (values) => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var saleID = Array(20).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var object = {
            "quantity" : values.quantity,
            "totalPrice" : values.totalPrice,
            "dealer" : values.dealer,
            "branch" : values.branch,
            "product" : values.product,
            "paymentType" : values.paymentType,
            "dateCreated" : timeStamp,
        };

        const output = FireFetch.SaveTODB("Sales", saleID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Sale added successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);


            }
        }).catch((error) => {
            setMessage("Unable to add sale, an error occurred :: " + error);
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
                onFinish={addSale}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item name="dealer" label="Dealer"
                           rules={[{ required: true, message: 'Please select dealer!' }]}>
                    <Select placeholder="Select Dealer"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={onChange}>
                        {dealers.map((item, index) => (
                            <Select.Option key={index}  value={item.dealerID}>{item.firstname + " " + item.surname}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item name="product" label="Product"
                           rules={[{ required: true, message: 'Please select product to sell!' }]}>
                    <Select placeholder="Select Product"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={onChange}>
                        {products.map((item, index) => (
                            <Select.Option key={index}  value={item.productID}>{item.name}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Quantity" name="quantity"
                           rules={[{ required: true, message: 'Please input quantity!' }]}>
                    <Input type="number" placeholder="enter product quantity"/>
                </Form.Item>
                <Form.Item label="Total Price" name="total">
                    <Input type="number" value={totalPrice} disabled={true} placeholder="total price"/>
                </Form.Item>

                <Form.Item label="Payment Type"
                           name="paymentType"
                           rules={[{ required: true, message: 'Please input payment type!' }]}>
                    <Select placeholder="Select payment type"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={onChange}>
                        {["Direct-Payment", "On-Credit"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Role"
                           name="role"
                           rules={[{ required: true, message: 'Please input user Role!' }]}>
                    <Select placeholder="Select role"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={onChange}>
                        {["Team-Principal", "Sales-Rep", "Storage-Manager", "Branches-Manager"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
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
                        Create
                    </Button>
                </Form.Item>

            </Form>

        </div>
    )

}

export default CreateSaleModal;
