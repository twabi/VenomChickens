import React, {useEffect, useState} from "react";
import {DatePicker, Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";

import{ init } from 'emailjs-com';
import FireFetch from "../../FireFetch";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";
init("user_2JD2DZg8xAHDW7e9kdorr");

const branchRef = Firebase.database().ref('System/Branches');
const moment = require("moment");
const EditUserModal = (props) => {

    const [branches] = useListVals(branchRef);
    const [user, setUser] = useState(props.editUser)
    const [DOB, setDOB] = useState(null);
    const [gender, setGender] = useState(null);
    const [role, setRole] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);


    function changeGender(option) {
        setGender(option);
    }
    function onChangeOne(date, dateString) {
        setDOB(dateString);
    }
    function changeRole(option) {
        setRole(option);
    }

    useEffect(() => {
        setUser(props.editUser);
    }, [props])

    const editUser = (values) => {


        setShowLoading(true);
        var payload = {
            "firstname" : values.firstname,
            "surname" : values.surname,
            "email" : values.email,
            "phone" : values.phone,
            "gender" : values.gender,
            "branch" : values.branch,
            "dob" : DOB,
            "role" : values.role,
        };

        FireFetch.updateInDB("Users", user.userID, payload)
            .then((result) => {
                if(result === "success"){
                    setMessage("User edited successfully");
                    setColor("success");
                    setShowAlert(true);
                    setShowLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                        props.modal(false);
                    }, 2000);
                }
            })
            .catch((error) => {
                setMessage("Unable to edit user and error occurred :: " + error);
                setColor("danger");
                setShowLoading(false);
                setShowAlert(true);
        });
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div>
            <Form
                layout="vertical"
                onFinish={editUser}
                onFinishFailed={onFinishFailed}
                initialValues={{
                    firstname: user.firstname,
                    surname: user.surname,
                    email: user.email,
                    phone: user.phone,
                    DOB: !user.dob ? undefined : moment(user.dob, "YYYY-MM-DD"),
                    gender: user.gender,
                    role: user.role,
                    branch: user.branch? user.branch : null
                }}
            >

                <Form.Item label="First name" name="firstname">
                    <Input placeholder="enter user firstname" id="firstname"/>
                </Form.Item>
                <Form.Item label="Surname" name="surname">
                    <Input placeholder="enter user surname" id="surname"/>
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type="email" placeholder="enter user email" id="email"/>
                </Form.Item>
                <Form.Item label="Phone" name="phone">
                    <Input type="phone" placeholder="enter user phone number" id="phone"/>
                </Form.Item>
                <Form.Item
                    label="Select Date of Birth" name="DOB">
                    <DatePicker
                        placeholder="select starting date"
                        picker={"date"}
                        className="w-100"
                        onChange={onChangeOne} />

                </Form.Item>

                <Form.Item label="Gender" name="gender">
                    <Select placeholder="Select user gender"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeGender}>
                        {["Male", "Female", "Rather Not Say"].map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item name="branch" label="Branch">
                    <Select placeholder="Select user's Branch"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={() => {}}>
                        {branches.map((item, index) => (
                            <Select.Option key={index}  value={item.branchID}>{item.name}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Role" name="role">
                    <Select placeholder="Select user role"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeRole}>
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
                        Edit
                    </Button>
                </Form.Item>
            </Form>

        </div>
    )

}

export default EditUserModal;
