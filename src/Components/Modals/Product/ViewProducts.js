import React, {useEffect, useState} from "react";
import {MDBCard, MDBCol, MDBRow, MDBCardImage, MDBAlert} from 'mdbreact';
import {Text} from "react-font";
import {Button,Card, Modal} from "antd";
import {Dialog, DollarIcon, EditIcon, TrashIcon} from "evergreen-ui";
import EditProductModal from "./EditProductModal";
import { useHistory } from 'react-router-dom';



const moment = require("moment");
const ViewProduct = (props) => {

    const history = useHistory();
    const [productArray, setProductArray] = useState(props.products);
    const [editModal, setEditModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [loading, setLoading] = useState(props.loading);
    const [error, setError] = useState(props.error);
    const [showEmpty, setShowEmpty] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowEmpty(true);
        }, 1000);
        setProductArray(props.products);
        setLoading(props.loading);
        setError(props.error);
    }, [props]);

    const handleEdit = (product) => {
        setEditProduct(product);
        setEditModal(true);
    }

    const handleViewProduct = (product) => {
        history.push({
            pathname: '/product',
            product: product,
        });
    }

    return (
        <div>
            <Modal
                title={"Edit Product"}
                centered
                maskClosable={false}
                visible={editModal}
                footer={false}
                onOk={() => setEditModal(false)}
                onCancel={() => setEditModal(false)}>

                <MDBCol md={12}>
                    <EditProductModal editProduct={editProduct} modal={setEditModal}/>
                </MDBCol>

            </Modal>

            <Card className="pl-4">
                {loading ?
                    <div className="d-flex justify-content-center">
                        <div className="spinner-border mx-4 my-4 indigo-text spinner-border" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>  : null}
                {showEmpty ?  (!loading)&&(!productArray.length) ? <div className="d-flex justify-content-center align-items-center">
                    <MDBAlert color={"danger"} className="my-3 font-italic">
                        {"Oops. This outlet has no products."}
                    </MDBAlert>
                </div> : null : null}
                {
                    error ?
                        <div className="d-flex justify-content-center align-items-center">
                            <MDBAlert color={"danger"} className="my-3 font-italic">
                                {"Oops. This outlet has no products."}
                            </MDBAlert>
                        </div>
                        :
                        null
                }

                {productArray ?
                    <MDBRow className="d-flex">
                        {productArray&&productArray.map((dataItem) => (
                            <MDBCol size="3" className="my-3">
                                <MDBCard className="d-flex justify-content-center">
                                    <div onClick={()=>{handleViewProduct(dataItem)}}>
                                        <MDBCardImage className="img-fluid" style={{width: "20rem", height: "15rem"}}
                                                      src={dataItem&&dataItem.url} waves/>
                                        <Card
                                            className="w-100"
                                            actions={[

                                                <div className="p-1">
                                                    <Text className="d-block h6" family="Nunito">Price</Text>
                                                    <Text className="d-block h6 font-weight-bolder"
                                                          family="Nunito">{dataItem&&dataItem.price}</Text>
                                                </div>,
                                                <div className="p-1">
                                                    <Text className="d-block h6" family="Nunito">Stock</Text>
                                                    <Text className="d-block h6 font-weight-bolder"
                                                          family="Nunito">{dataItem&&dataItem.stockCount}</Text>
                                                </div>,
                                                <div className="p-1">
                                                    <Text className="d-block h6" family="Nunito">Created</Text>
                                                    <Text className="d-block h6 font-weight-bolder" family="Nunito">{
                                                        moment(dataItem&&dataItem.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")
                                                    }</Text>
                                                </div>,
                                            ]}
                                        >
                                            <div className="text-center">
                                                <Text className="d-block h5" family="Nunito">{dataItem&&dataItem.name}</Text>
                                            </div>

                                        </Card>
                                    </div>

                                    <div className="d-flex flex-row mx-3 mt-2 mb-3">
                                        <Button type="primary" className="mx-1" shape="circle" icon={<TrashIcon />} danger onClick={() => {
                                            // eslint-disable-next-line no-restricted-globals
                                            if (confirm("Are you sure you want to delete product?")) {
                                                props.delete(dataItem&&dataItem.productID);
                                            }
                                        }} size='large' />
                                        <Button shape="circle" className="mx-1" icon={<EditIcon />} onClick={() => {
                                            handleEdit(dataItem&&dataItem);
                                        }} size='large' />

                                    </div>

                                </MDBCard>

                            </MDBCol>
                        ))}

                    </MDBRow>

                    : null}

            </Card>
        </div>
    )
}
export default ViewProduct;
