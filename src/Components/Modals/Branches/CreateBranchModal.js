import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";
import FireFetch from "../../FireFetch";
import {useAuthState} from "react-firebase-hooks/auth";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";


const prodRef = Firebase.database().ref('System/Products');
const userRef = Firebase.database().ref('System/Users');
const moment = require("moment");
const CreateBranchModal = (props) => {

    const districts = ["Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa","Dedza", "Dowa", "Karonga","Kasungu", "Lilongwe", "Mchinji", "Nkhotakota", "Ntcheu", "Ntchisi", "Salima",
         "Likoma", 'Mzimba', "Nkhata Bay", "Rumphi", "Machinga", "Mangochi", "Mulanje", "Mwanza", "Neno" , "Nsanje",
        "Thyolo", "Phalombe", "Zomba"]

    const [products] = useListVals(prodRef);
    const [users] = useListVals(userRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [createdByID, setCreatedByID] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    function changeProduct(options) {
        setSelectedProducts(options);
    }

    function changeDistrict(option){
        setSelectedDistrict(option);
    }
    function changeUser(option){
        setSelectedUser(option);
    }

    
    useEffect(() => {
        if(loggedInUser){
            console.log(loggedInUser.uid);
            setCreatedByID(loggedInUser.uid);
        }

    }, [loggedInUser])


    const addBranch = (values) => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var branchID =  Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var overObj = {}
        selectedProducts.map((item) => {

            var obj = {
                "stockCount" : 0,
                "updatedAt" : timeStamp,
                "productID" : item
            }
            overObj[item] = obj;
            //prodArray.push(overObj);
        })

        console.log(values);
        var object = {
            "name" : values.name,
            "district" : values.district,
            "Area" : values.area,
            "coordinates" : {
                "longitude" : values.longitude,
                "latitude" : values.latitude
            },
            "dateCreated" : timeStamp,
            "manager" : values.manager,
            "createdByID" : createdByID,
            "branchID" : branchID,
            "products" : overObj
        };

        console.log(object);

        const output = FireFetch.SaveTODB("Branches", branchID, object);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("Branch added successfully");
                setColor("success");
                setShowAlert(true);
                setShowLoading(false);
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2000);
            }
        }).catch((error) => {
            setMessage("Unable to add branch, an error occurred :: " + error);
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
                onFinish={addBranch}
                onFinishFailed={onFinishFailed}
                initialValues={{longitude: 0, latitude: 0}}
            >

                <Form.Item label="Branch name"
                           name="name"
                           rules={[{ required: true, message: 'Please input outlet name!' }]}>
                    <Input placeholder="enter name" id="outletName"/>
                </Form.Item>
                <Form.Item label="Location (District)"
                           name="district"
                           rules={[{ required: true, message: 'Please select a district!' }]}>
                    <Select placeholder="Select District"
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
                <Form.Item label="Latitude" name="latitude"
                           rules={[]}>
                    <Input type="number" placeholder="enter latitude" id="lat"/>

                </Form.Item>
                <Form.Item label="Longitude" name="longitude"
                           rules={[]}>
                    <Input type="number" placeholder="enter longitude" id="long"/>
                </Form.Item>

                <Form.Item label="Branch Manager"
                           name="manager"
                           rules={[{ required: true, message: 'Please select manager!' }]}>
                    <Select placeholder="Select Products that the Outlet has"
                            showSearch
                            mode="multiple"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeUser}>
                        {users.map((item, index) => (
                            <Select.Option key={index}  value={item.userID}>{item.firstname + " " + item.surname}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>

                <Form.Item name="products" label="Branch Products">
                    <Select placeholder="Select Products"
                            showSearch
                            mode="multiple"
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

export default CreateBranchModal;
