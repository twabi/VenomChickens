import React, {useEffect, useState} from "react";
import {Form, Input, Select} from "antd";
import {Button} from "evergreen-ui";
import FireFetch from "../../FireFetch";
import {MDBAlert} from "mdbreact";
import Firebase from "../../Firebase";
import {useListVals} from "react-firebase-hooks/database";

const prodRef = Firebase.database().ref('System/Products');
const userRef = Firebase.database().ref('System/Users');
const moment = require('moment');

const AddProduct = (props) => {

    const [products] = useListVals(prodRef);
    const [showAlert, setShowAlert] = useState(false);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showLoading, setShowLoading] = useState(false);
    const [selectedBranch, setSelectedBranch] = useState(props.editBranch);
    const [selectedProducts, setSelectedProducts] = useState([]);

    function changeProduct(options) {
        setSelectedProducts(options);
    }

    useEffect(() => {
        setSelectedBranch(props.editBranch);
    }, [props])


    const editBranch = (values) => {
        //setShowLoading(true);
        var timeStamp = moment().format("YYYY-MM-DDTh:mm:ss");
        var overObj = {}
        selectedProducts.map((item) => {
            var index = Object.values(selectedBranch.products).findIndex(x => x.productID === item)

            if(index === -1){
                var obj = {
                    "stockCount" : 0,
                    "updatedAt" : timeStamp,
                    "productID" : item
                }
            } else {
                var obj = Object.values(selectedBranch.products)[index];
            }

            overObj[item] = obj;
        })

        var object = {
            "products" : overObj
        };


        const output = FireFetch.updateInDB("Branches", selectedBranch.branchID, object);
        output.then((result) => {
            if(result === "success"){
                setMessage("Branch edited successfully");
                setShowLoading(false);
                setShowAlert(true);
                setColor("success");
                setTimeout(() => {
                    setShowAlert(false);
                    props.modal(false);
                }, 2100);


            }
        }).catch((error) => {
            setMessage("Unable to edit branch, an error occurred :: " + error);
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
                    products: Object.keys(selectedBranch.products)
                }}
            >
                <Form.Item label="Branch Products" name="products">
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
                    Edit
                </Button>

            </Form>


        </div>
    )

}

export default AddProduct;
