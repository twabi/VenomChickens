import React, {useEffect, useState} from 'react';
import SideBar from "../../Navbars/SideBar";
import {Alert, Card, Layout, List} from "antd";
import NavBar from "../../Navbars/NavBar";
import {useParams} from "react-router";
import {MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {AddIcon, Button, Dialog, EditIcon, EyeOpenIcon, TrashIcon} from "evergreen-ui";
import Firebase from "../../Firebase";
import {useListVals, useObject} from "react-firebase-hooks/database";
import {LineChart} from "../../Charts/LineChart";
import {PieChart} from "../../Charts/PieChart";
import EditProductModal from "../../Modals/Product/EditProductModal";

const {Content} = Layout;
const { Meta } = Card;
const dbRef = Firebase.database().ref('System/Products');
const ProductDetails = (props) => {
    const { id } = useParams();
    const [snapshot, loading, error] = useObject(dbRef.child(id));
    const [showEditModal, setShowEditModal] = useState(false);
    const [product, setProduct] = useState(null);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }
    
    useEffect(() => {
        const url = props.history.location.state?.url
        if(snapshot){
            var object = snapshot.val();
            object.url = url;
            setProduct(object);
        }
    }, [props.history.location.state?.url, snapshot])


    return (
        <>
            <Layout style={{width: "100vw"}}>
                <SideBar checked={checkedData}/>
                <Layout className="site-layout">
                    <NavBar token={"token"} checkBack={callback}/>
                    <Content
                        className="site-layout-background"
                        style={{ margin: '10px 16px 15px'}}
                    >
                        <MDBRow>
                            <Dialog
                                isShown={showEditModal}
                                title="Edit Product"
                                onCloseComplete={() => {setShowEditModal(false)}}
                                shouldCloseOnOverlayClick={false}
                                hasFooter={false}>

                                <MDBCol md={12}>
                                    <EditProductModal modal={setShowEditModal} editProduct={product}/>
                                </MDBCol>

                            </Dialog>
                            <MDBCol md={9}>
                                <Card className="mt-2 w-100">
                                    <MDBRow>
                                        <MDBCol md={9}>
                                            <div className="d-block ml-1">
                                                <h3 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Product Details
                                                    </Text>
                                                </h3>
                                            </div>
                                            {loading ?
                                                <div className="d-flex justify-content-center">
                                                    <div className="spinner-border mx-4 my-4 indigo-text spinner-border" role="status">
                                                        <span className="sr-only">Loading...</span>
                                                    </div>
                                                </div> : null}
                                        </MDBCol>
                                        <MDBCol>
                                            <Button type="primary" className="mx-1" onClick={() => {
                                                setShowEditModal(true);
                                            }}>
                                                <EditIcon color="info"/>
                                            </Button>
                                            <Button className="mx-1" type="danger" onClick={() => {
                                                // eslint-disable-next-line no-restricted-globals
                                                if (confirm("Are you sure you want to delete project?")) {
                                                    //deleteProject(projectDet.projectID, setMessage, setColor, setShowAlert);
                                                }

                                            }}>
                                                <TrashIcon color="danger"/>
                                            </Button>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow left style={{height:"300px"}}>
                                        <MDBCol>
                                            <Card bordered={false} className="">
                                                <img className="w-100" style={{ height:"17rem"}} src={product&&product.url}/>
                                            </Card>
                                        </MDBCol>
                                        <MDBCol md={7}>
                                            <Card bordered={false} className="w-100 bg-white">
                                                <div>
                                                    <Alert message={<>Name: &nbsp;&nbsp;<b>{product&&product.name}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Type: &nbsp;&nbsp;<b>{product&&product.productType}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Price: &nbsp;&nbsp;<b>{product&&product.price}</b></>}
                                                           className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Stock: &nbsp;&nbsp;<b>33</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Description: &nbsp;&nbsp;<b>{product&&product.description}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />

                                                </div>
                                            </Card>
                                        </MDBCol>


                                    </MDBRow>

                                </Card>

                            </MDBCol>

                            <MDBCol>
                                <Card className="mt-2 w-100">
                                    <MDBRow>
                                        <MDBCol md={9}>
                                            <div className="d-block ml-1">
                                                <h3 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Updates
                                                    </Text>
                                                </h3>
                                            </div>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow>
                                        <Card bordered={false} className="w-100 bg-white scroll">
                                            <List
                                                grid={{gutter:21 }}
                                                //loading={memberLoading}
                                                dataSource={[
                                                    {key:1, name: "Magazines"},
                                                    {key:1, name: "Novel"},
                                                    {key:1, name: "Fiction"},
                                                ]}
                                                renderItem={item => (
                                                    <List.Item className="w-100">
                                                        <Card
                                                            className="w-100"
                                                            actions={[
                                                                <b><i className="eye icon"/>3545 views</b>,
                                                                <b><i className="book icon"/>46 books</b>,
                                                                <Button><EyeOpenIcon color="primary" onClick={() => {}}/></Button>,
                                                            ]}>
                                                            <Meta
                                                                title={<b>{item.name}</b>}
                                                                description={"Shelf"}
                                                            />
                                                        </Card>
                                                    </List.Item>
                                                )}
                                            />

                                        </Card>

                                    </MDBRow>

                                </Card>
                            </MDBCol>
                        </MDBRow>

                        <MDBRow>
                            <MDBCol>
                                <Card className="mt-2 w-100">
                                    <MDBRow>
                                        <MDBCol md={10}>
                                            <div className="d-block ml-1">
                                                <h3 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Product Metrics
                                                    </Text>
                                                </h3>
                                            </div>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow>
                                        <MDBCol md="8">
                                            <Card title={"Read Chart"} bordered={false} className="w-100 bg-white">
                                                <LineChart/>
                                            </Card>
                                        </MDBCol>
                                        <MDBCol>
                                            <Card title={"Market Share"} bordered={false} className="w-100 bg-white">
                                                <PieChart/>
                                            </Card>
                                        </MDBCol>


                                    </MDBRow>

                                </Card>
                            </MDBCol>
                        </MDBRow>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default ProductDetails;
