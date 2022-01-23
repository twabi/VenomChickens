import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import {MDBAlert} from "mdbreact";
import FireFetch from "../../FireFetch";
import {useAuthState} from "react-firebase-hooks/auth";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";


var storageRef = Firebase.storage().ref("System/Outlets");
const prodRef = Firebase.database().ref('System/Products');
const moment = require("moment");
const CreateOutletModal = (props) => {

    const districts = ["Balaka", "Blantyre", "Chikwawa", "Chiradzulu", "Chitipa","Dedza", "Dowa", "Karonga","Kasungu", "Lilongwe", "Mchinji", "Nkhotakota", "Ntcheu", "Ntchisi", "Salima",
         "Likoma", 'Mzimba', "Nkhata Bay", "Rumphi", "Machinga", "Mangochi", "Mulanje", "Mwanza", "Neno" , "Nsanje",
        "Thyolo", "Phalombe", "Zomba"]

    const [products] = useListVals(prodRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [filesList, setFilesList] = useState([]);
    const [loggedInUser] = useAuthState(Firebase.auth());
    const [createdByID, setCreatedByID] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const handleFileUpload = (e) => {
        var tempArray = Object.values(e.target.files);
        setFilesList(tempArray)
    }

    function changeProduct(options) {
        setSelectedProducts(options);
    }

    function changeDistrict(option){
        setSelectedDistrict(option);
    }
    
    useEffect(() => {
        if(loggedInUser){
            console.log(loggedInUser.uid);
            setCreatedByID(loggedInUser.uid);
        }

    }, [loggedInUser])


    const addOutlet = () => {
        setShowLoading(true);

        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var name = document.getElementById("outletName").value;
        var area = document.getElementById("area").value;
        var contactName = document.getElementById("contactName").value;
        var contactEmail = document.getElementById("contactEmail").value
        var contactPhone = document.getElementById("contactPhone").value;
        var notes = document.getElementById("feedback").value;
        var longitude = document.getElementById("long").value;
        var latitude = document.getElementById("lat").value;

        var outletID =  Array(20).fill("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
            .map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('');

        var location = selectedDistrict + ", " + area;

        var overObj = {}
        selectedProducts.map((item) => {

            var obj = {
                "quantity" : 0,
                "updatedAt" : timeStamp,
                "productID" : item
            }
            overObj[item] = obj;
            //prodArray.push(overObj);
        })

        if(name.includes("/")){
            alert("The name cannot include a slash, use a dash or another symbol instead")
        } else {
            var object = {
                "name" : name,
                "location" : location,
                "contactPerson" : {
                    "email" : contactEmail,
                    "name" : contactName,
                    "phone" : contactPhone
                },
                "coordinates" : {
                    "longitude" : longitude,
                    "latitude" : latitude
                },
                "dateCreated" : timeStamp,
                "createdByID" : createdByID,
                "feedbackNotes" : notes,
                "outletID" : outletID,
                "products" : overObj
            };

            console.log(object);



            const output = FireFetch.SaveTODB("Outlets", outletID, object);
            output.then((result) => {
                console.log(result);
                if(result === "success"){
                    setMessage("Outlet added successfully");
                    setColor("success");
                    setShowAlert(true);
                    setShowLoading(false);
                    setTimeout(() => {
                        setShowAlert(false);
                        props.modal(false);
                    }, 2000);


                    filesList.map((file, index) => {
                        storageRef.child(outletID).child(""+index).put(file).then(function(snapshot) {
                            console.log('Uploaded a blob or file!');
                        });
                    })
                }
            }).catch((error) => {
                setMessage("Unable to add outlet, an error occurred :: " + error);
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
                onFinish={addOutlet}
                onFinishFailed={onFinishFailed}
            >

                <Form.Item label="Outlet name"
                           name="Outlet name"
                           rules={[{ required: true, message: 'Please input outlet name!' }]}>
                    <Input placeholder="enter outlet name" id="outletName"/>
                </Form.Item>
                <Form.Item label="Location (District)"
                           name="location(district)"
                           rules={[{ required: true, message: 'Please select a district!' }]}>
                    <Select placeholder="Select District of Outlet"
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                            filterSort={(optionA, optionB) =>
                                optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                            }
                            onChange={changeProduct}>
                        {districts.sort().map((item, index) => (
                            <Select.Option key={index}  value={item}>{item}</Select.Option>
                        ))}

                    </Select>
                </Form.Item>
                <Form.Item label="Location (Area)"
                           name="location(area)"
                           rules={[{ required: true, message: 'Please input area!' }]}>
                    <Input placeholder="enter area of outlet in the district" id="area"/>
                </Form.Item>
                <Form.Item label="Latitude" name="latitude"
                           rules={[]}>
                    <Input type="number" placeholder="enter latitude" defaultValue={0} id="lat"/>

                </Form.Item>
                <Form.Item label="Longitude" name="longitude"
                           rules={[]}>
                    <Input type="number" placeholder="enter longitude" defaultValue={0} id="long"/>
                </Form.Item>

                <Form.Item label="Outlet Contact Person Name"
                           name="contactName"
                           rules={[{ required: true, message: 'Please input outlet contact name!' }]}>
                    <Input type="text" placeholder="enter outlet contact person name" id="contactName"/>
                </Form.Item>

                <Form.Item label="Outlet Contact Phone"
                           name="Phone"
                           rules={[{ required: true, message: 'Please input outlet Phone!' }]}>
                    <Input type="phone" placeholder="enter user phone number" id="contactPhone"/>
                </Form.Item>
                <Form.Item label="Outlet Contact Email">
                    <Input type="text" placeholder="enter contact email address" id="contactEmail"/>
                </Form.Item>

                <Form.Item label="Feedback Notes">
                    <Input type="text" placeholder="enter outlet notes" id="feedback"/>
                </Form.Item>

                <Form.Item label="Upload Outlet Images"
                           name="images"
                           rules={[{ required: true, message: 'Please upload atleast one outlet image!' }]}>
                    <Input type="file"
                           multiple
                           style={{ width: "100%" }}
                           accept="image/*"
                           onChange={handleFileUpload}
                           placeholder="outlet image" id="outletImage"/>
                </Form.Item>

                <Form.Item label="Outlet Products">
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

export default CreateOutletModal;
