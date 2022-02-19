import React, {useEffect, useState} from 'react';
import SideBar from "../../Navbars/SideBar";
import {Alert, Avatar, Card, Layout, List} from "antd";
import NavBar from "../../Navbars/NavBar";
import {useParams} from "react-router";
import {MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {AddIcon, Button, Dialog, EditIcon, EyeOpenIcon, TrashIcon} from "evergreen-ui";
import Firebase from "../../Firebase";
import {useListVals, useObject} from "react-firebase-hooks/database";
import {LineChart} from "../../Charts/LineChart";
import {PieChart} from "../../Charts/PieChart";
import EditBranchModal from "../../Modals/Branches/EditBranchModal";
import AddProduct from "../../Modals/Branches/AddProduct";


const {Content} = Layout;
const { Meta } = Card;
const dbRef = Firebase.database().ref('System/Branches');
const saleRef = Firebase.database().ref('System/Sales');
const userRef = Firebase.database().ref('System/Users');
const prodRef = Firebase.database().ref('System/Products');
const moment = require("moment");
const BranchDetails = () => {
    const { id } = useParams();
    const [sales] = useListVals(saleRef);
    const [users] = useListVals(userRef);
    const [products] = useListVals(prodRef);
    const [snapshot, loading, error] = useObject(dbRef.child(id));
    const [salesArray, setSalesArray] = useState([]);
    const [branch, setBranch] = useState(null);
    const [checkedData, setCheckedData] = useState(true);
    const [prodArray, setProdArray] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editBranch, setEditBranch] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false);
    const callback = (data) => {
        setCheckedData(data);
    }
    
    useEffect(() => {
        if(snapshot){
            setBranch(snapshot.val())
            setProdArray(Object.values(snapshot.val().products))
        }
        if(sales){
            var tempArray = sales.filter(x => x.branchID === id);
            setSalesArray(tempArray);
        }
    }, [id, sales, snapshot])


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
                                title="Edit Branch"
                                onCloseComplete={() => {setShowEditModal(false)}}
                                shouldCloseOnOverlayClick={false}
                                hasFooter={false}>

                                <MDBCol md={12}>
                                    <EditBranchModal modal={setShowEditModal} editBranch={editBranch}/>
                                </MDBCol>

                            </Dialog>
                            <Dialog
                                isShown={showAddModal}
                                title="Add Products"
                                onCloseComplete={() => {setShowAddModal(false)}}
                                shouldCloseOnOverlayClick={false}
                                hasFooter={false}>
                                <AddProduct editBranch={editBranch} modal={setShowAddModal}/>
                            </Dialog>
                            <MDBCol md={7}>
                                <Card className="mt-2 w-100">
                                    <MDBRow>
                                        <MDBCol md={9}>
                                            <div className="d-block ml-1">
                                                <h3 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Branch Details
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
                                                //showEditModal(projectDet, setEditProject, setEditModal);
                                                setEditBranch(branch); setShowEditModal(true);
                                            }}>
                                                <EditIcon color="info"/>
                                            </Button>
                                            <Button className="mx-1" type="danger" onClick={() => {
                                                // eslint-disable-next-line no-restricted-globals
                                                if (confirm("Are you sure you want to delete branch?")) {
                                                    //deleteProject(projectDet.projectID, setMessage, setColor, setShowAlert);
                                                }

                                            }}>
                                                <TrashIcon color="danger"/>
                                            </Button>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow left style={{height:"350px"}}>
                                        <MDBCol>
                                            <Card bordered={false} className="w-100 bg-white">
                                                <div>
                                                    <Alert message={<>Name: &nbsp;&nbsp;<b>{branch&&branch.name}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>District: &nbsp;&nbsp;<b>{branch&&branch.district}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Area: &nbsp;&nbsp;<b>{branch&&branch.Area}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Manager: &nbsp;&nbsp;<b>{branch&&
                                                    users[users.findIndex(user => user.userID===branch.manager[0])]&&
                                                    users[users.findIndex(user => user.userID===branch.manager[0])].firstname + " " +
                                                    users[users.findIndex(user => user.userID===branch.manager[0])].surname}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>created: &nbsp;&nbsp;<b>{branch&&moment(branch.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>} className="w-100 my-1 deep-orange-text"
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
                                                        Transactions
                                                    </Text>
                                                </h3>
                                            </div>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow>
                                        <Card bordered={false} className="w-100 bg-white scroll">
                                            <List
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
                                                        Products
                                                    </Text>
                                                </h3>
                                            </div>
                                        </MDBCol>
                                        <MDBCol>
                                            <Button type="primary" className="mx-1" onClick={() => {setEditBranch(branch); setShowAddModal(true)}}>
                                                <AddIcon color="info"/>
                                            </Button>
                                        </MDBCol>

                                    </MDBRow>
                                    <hr/>
                                    <MDBRow>
                                        <Card bordered={false} className="w-100 bg-white">
                                            <List
                                                grid={{gutter:16, column: 4 }}
                                                //loading={memberLoading}
                                                dataSource={prodArray}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <Card
                                                            className="w-100"
                                                            actions={[<TrashIcon color="danger" className="mx-4" onClick={() => {
                                                                // eslint-disable-next-line no-restricted-globals
                                                                if (confirm("Are you sure you want to remove user from this project?")) {
                                                                    //deleteMember(item.id)
                                                                }
                                                            }}/>]}>
                                                            <Meta
                                                                avatar={<Avatar className="rounded float-left d-inline"
                                                                                style={{ backgroundColor: "#f06000", verticalAlign: 'middle' }} size={56} gap={1}>
                                                                    {products[products.findIndex(prod => prod.productID===item.productID)]&&
                                                                    products[products.findIndex(prod => prod.productID===item.productID)].name[0]}
                                                                </Avatar>}
                                                                title={"" + products[products.findIndex(prod => prod.productID===item.productID)]&&
                                                                products[products.findIndex(prod => prod.productID===item.productID)].name}
                                                                description={"Stock: " + item.stockCount}
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
                                                        Branch Metrics
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

export default BranchDetails;
