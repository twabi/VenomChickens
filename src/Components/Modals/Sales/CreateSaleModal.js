import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import {useListVals} from "react-firebase-hooks/database";
import Firebase from "../../Firebase";
import {useAuthState} from "react-firebase-hooks/auth";

const moment = require("moment");
const branchRef = Firebase.database().ref('System/Branches');
const userRef = Firebase.database().ref('System/Users');
const prodRef = Firebase.database().ref('System/Products');
const dealerRef = Firebase.database().ref('System/Dealers');
const accRef = Firebase.database().ref('System/Accounts');
const CreateSaleModal = (props) => {

    const [user] = useAuthState(Firebase.auth());
    const [products] = useListVals(prodRef);
    const [users] = useListVals(userRef);
    const [dealers] = useListVals(dealerRef);
    const [branches] = useListVals(branchRef);
    const [gender, setGender] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const [userID, setUserID] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [price, setPrice] = useState(null);

    function onChange(option) {
        console.log(option);
    }

    function changeProduct(option) {
        var prod = products[products.findIndex(x => x.productID === option)];
        setPrice(parseFloat(prod.price));
    }

    function getTotal(value) {
        var total = price * parseFloat(value);
        setTotalPrice(total);
    }
    
    useEffect(() => {
        if(user){
            setUserID(user.uid);
        }
    }, [user])


    const addSale = (values) => {
        setShowLoading(true);
        //getTotal();
        var user = users.findIndex(x => x.userID === userID)&&users[users.findIndex(x => x.userID === userID)];

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var saleID = Array(20).fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var object = {
            "quantity" : values.quantity,
            "totalPrice" : values.total,
            "dealer" : values.dealer,
            "product" : values.product,
            "paymentType" : values.paymentType,
            "salesRep" : userID,
            "saleID" : saleID,
            "branch" : user ? user.branch : null,
            "dateCreated" : timeStamp,
        };

        console.log(object);

        if(values.paymentType === "On-Credit"){
            accRef.orderByChild("dealerID").equalTo(values.dealer).on("child_added", function (snapshot){
                var account = snapshot.val();
                console.log(account);
                var newBalance = parseFloat(account.balance) - parseFloat(values.total);
                //stdout.write(newBalance);
                console.log(newBalance);
                var newObject = {
                    "balance" : newBalance
                }
                FireFetch.updateInDB("Accounts", account.accountID, newObject).then((result) => {
                    console.log(result);
                });
            });
        }
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
                fields={[{
                    name: ['total'],
                    value: totalPrice,
                }]}
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
                            onChange={changeProduct}>
                        {products.map((item, index) => (
                            <Select.Option key={index}  value={item.productID}>{item.name}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Quantity" name="quantity"
                           rules={[{ required: true, message: 'Please input quantity!' }]}>
                    <Input type="number" placeholder="enter product quantity" onChange={(e) => {setQuantity(e.target.value); getTotal(e.target.value);}}/>
                </Form.Item>
                <Form.Item label="Total Price" name="total">
                    <Input type="number" disabled={true}/>
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
