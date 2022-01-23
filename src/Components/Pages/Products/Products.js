import React, {useEffect, useState} from 'react'
import SideBar from "../../Navbars/SideBar";
import NavBar from "../../Navbars/NavBar";
import Button from "@material-tailwind/react/Button";
import {Card, Layout, List, Table, Tooltip} from "antd";
import {
    Dialog,
    SearchInput, EyeOpenIcon, TrashIcon, EditIcon, IconButton, DollarIcon,
} from "evergreen-ui";
import {
    MDBAlert,
    MDBCol, MDBIcon,
    MDBRow,
} from "mdbreact";
import {Text} from "react-font";
import {useListVals} from "react-firebase-hooks/database";
import Firebase from "../../Firebase";
import {useHistory} from "react-router-dom";
import {generatePath} from "react-router";
import CreateProductModal from "../../Modals/Product/CreateProductModal";
import {useGetImages} from "../../hooks/useGetImages";


const dbRef = Firebase.database().ref('System/Products');
const { Content } = Layout;
const { Meta } = Card;
const Products = () => {

    const history = useHistory();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [products, loading, error] = useListVals(dbRef);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const {images, setImages} = useGetImages("products")
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }


    useEffect(() => {

        var tempArray = [];
        if(products){
            products.map((product) => {
                var url = images&&images[images.findIndex(x => x.name === String(product.productID))];
                product.url = url&&url.url;
                tempArray.push(product);
            });

            setDataArray([...tempArray]);
        }
        
        if(error){
            setShowDeleteAlert(true);
            setMessage("Unable to fetch products");
            setColor("danger");
        }
    }, [error, images, products]);

    const handleProceed = (id, url) => {
        history.push({pathname : generatePath("/products/:id", { id }), state: {url: url}});
    };

    const handleSearch = searchText => {
        const filteredEvents = [].filter(({ name, email, dpt, userRole }) => {
            name = name.toLowerCase();
            email = email.toLowerCase();
            dpt = dpt.toLowerCase();
            userRole = userRole.toLowerCase();
            return name.includes(searchText) || email.includes(searchText) || dpt.includes(searchText) || userRole.includes(searchText);
        });

        setDataArray(filteredEvents);
    };

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
                        <MDBRow className="w-100">
                            <MDBCol md={12}>

                                <Dialog
                                    isShown={showModal}
                                    title="Create New Product"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateProductModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={showEditModal}
                                    title="Edit Product"
                                    onCloseComplete={() => {setShowEditModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={viewModal}
                                    title={
                                        <div className="w-100 d-flex justify-content-between">
                                            <b>View Product</b>
                                        </div>
                                    }
                                    onCloseComplete={() => {setViewModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>

                                    </MDBCol>

                                </Dialog>

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Products
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search members" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <Button size="large" type="primary" style={{background: "#f69a00", borderColor: "#f69a06"}} className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Product
                                                </Button>
                                            </MDBRow>
                                        </MDBCol>

                                    </MDBRow>

                                </Card>

                                <Card>
                                    {showDeleteAlert?
                                        <>
                                            <MDBAlert color={color} className="my-3 font-italic" >
                                                {message}
                                            </MDBAlert>
                                        </>
                                        : null }
                                    <Card className="d-flex flex-column">
                                        <div>
                                            <List
                                                grid={{gutter:18, column: 3 }}
                                                loading={loading}
                                                dataSource={dataArray}
                                                renderItem={item => (
                                                    <List.Item className="w-100">
                                                        <Card
                                                            className="w-100"
                                                            actions={[
                                                                <div
                                                                    onClick={() => {handleProceed(item.productID, item.url)}}
                                                                    className="d-flex justify-content-between align-items-center mx-3">
                                                                    <b className="mx-2"><MDBIcon icon="warehouse"/>&nbsp;3545</b>
                                                                    <Button type="primary"
                                                                            className="white-text mx-2"
                                                                            style={{background: "#f69a00", borderColor: "#f69a06"}}>
                                                                        <EyeOpenIcon color="white" onClick={() => {}}/></Button>
                                                                </div>

                                                            ]}>
                                                            <img className="w-100 mb-2" style={{ height:"12rem"}} src={item.url}/>
                                                            <Meta
                                                                title={<b>{item.name}</b>}
                                                                description={item.description}
                                                            />
                                                        </Card>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                    </Card>
                                </Card>

                            </MDBCol>
                        </MDBRow>
                    </Content>
                </Layout>
            </Layout>

        </>

    )
}

export default Products;
