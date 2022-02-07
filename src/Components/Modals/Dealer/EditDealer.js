import React, {useEffect, useState} from "react";
import { Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import{ init } from 'emailjs-com';
init("user_2JD2DZg8xAHDW7e9kdorr");

const regEx = /((?:\+|00)[17](?: |\-)?|(?:\+|00)[1-9]\d{0,2}(?: |\-)?|(?:\+|00)1\-\d{3}(?: |\-)?)?(0\d|\([0-9]{3}\)|[1-9]{0,3})(?:((?: |\-)[0-9]{2}){4}|((?:[0-9]{2}){4})|((?: |\-)[0-9]{3}(?: |\-)[0-9]{4})|([0-9]{7}))/g;
const moment = require("moment");
const EditDealer = (props) => {

    const districts = ["Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa","Dedza", "Dowa", "Karonga","Kasungu", "Lilongwe", "Mchinji", "Nkhotakota", "Ntcheu", "Ntchisi", "Salima",
        "Likoma", 'Mzimba', "Nkhata Bay", "Rumphi", "Machinga", "Mangochi", "Mulanje", "Mwanza", "Neno" , "Nsanje",
        "Thyolo", "Phalombe", "Zomba"]
    const [dealer, setDealer] = useState(props.dealer);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    function changeDistrict(option) {
        setSelectedDistrict(option);
    }

    const editDealer = (values) => {
        setShowLoading(true);

        var object = {
            "firstname" : values.firstname,
            "surname" : values.surname,
            "email" : values.email,
            "phone" : values.phone,
            "code" : values.code,
            "district" : values.district,
            "area" : values.area,
        };

        const output = FireFetch.updateInDB("Dealers", dealer.dealerID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Dealer edited successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);


            }
        }).catch((error) => {
            setMessage("Unable to edit dealer and error occurred :: " + error);
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
                onFinish={editDealer}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    firstname: dealer.firstname,
                    surname: dealer.surname,
                    email: dealer.email,
                    phone: dealer.phone,
                    district: dealer.district,
                    area: dealer.area,
                    code: dealer.code
                }}
            >

                <Form.Item label="First name"
                           name="firstname"
                           rules={[{ required: true, message: 'Please input first name!' }]}>
                    <Input placeholder="Enter firstname" id="firstname"/>
                </Form.Item>
                <Form.Item label="Surname"
                           name="surname"
                           rules={[{ required: true, message: 'Please input surname!' }]}>
                    <Input placeholder="Enter surname" id="surname"/>
                </Form.Item>
                <Form.Item label="Email" name="email"
                           rules={[{ required: true, message: 'Please input Email!' }]}>
                    <Input type="email" placeholder="Enter email" id="email"/>
                </Form.Item>
                <Form.Item label="Phone"
                           name="phone"
                           rules={[{ required: true, message: 'Please input Phone!' },
                               { min: 9, message: 'phone number must be minimum 9 characters.' },
                               { max: 13, message: 'phone number cannot exceed 12 characters.' },
                               {
                                   required: true,
                                   pattern: new RegExp(regEx),
                                   message: "Wrong phone number format!"}
                           ]}>
                    <Input type="phone" placeholder="Enter phone number" id="phone"/>
                </Form.Item>
                <Form.Item label="Dealer Code" name="code"
                           rules={[{ required: true, message: 'Please input code!' }]}>
                    <Input type="text" placeholder="Enter dealer code" id="email"/>
                </Form.Item>
                <Form.Item label="Location (District)"
                           name="district"
                           rules={[{ required: true, message: 'Please select a district!' }]}>
                    <Select placeholder="Select Dealer's District"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeDistrict}>
                        {districts.sort().map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Location (Area)"
                           name="area"
                           rules={[{ required: true, message: 'Please input area!' }]}>
                    <Input placeholder="enter area of outlet in the district" id="area"/>
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

export default EditDealer;
