import React, {useEffect, useState} from 'react';
import SideBar from "../../Navbars/SideBar";
import {Alert, Card, Layout, List} from "antd";
import NavBar from "../../Navbars/NavBar";
import {useParams} from "react-router";
import {MDBCol, MDBRow} from "mdbreact";
import {Text} from "react-font";
import {AddIcon, Button, EditIcon, EyeOpenIcon, TrashIcon} from "evergreen-ui";
import Firebase from "../../Firebase";
import {useListVals, useObject} from "react-firebase-hooks/database";
import {LineChart} from "../../Charts/LineChart";
import {PieChart} from "../../Charts/PieChart";

const {Content} = Layout;
const { Meta } = Card;
const dbRef = Firebase.database().ref('System/Dealers');
const saleRef = Firebase.database().ref('System/Sales');
const moment = require('moment');
const DealerDetails = () => {
    const { id } = useParams();
    const [snapshot, loading, error] = useObject(dbRef.child(id));
    const [checkedData, setCheckedData] = useState(true);
    const [dealer, setDealer] = useState(null);
    const [sales] = useListVals(saleRef);
    const [salesArray, setSalesArray] = useState([]);
    const callback = (data) => {
        setCheckedData(data);
    }

    useEffect(() => {
        if(snapshot){
            var object = snapshot.val();
            setDealer(object);
        }
        
        if(sales){
            var tempArray = sales.filter(x => x.dealerID === id);
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

                            <MDBCol md={7}>
                                <Card className="mt-2 w-100">
                                    <MDBRow>
                                        <MDBCol md={9}>
                                            <div className="d-block ml-1">
                                                <h3 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Dealer Details
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
                                    <MDBRow left style={{height:"350px"}}>
                                        <MDBCol>
                                            <Card bordered={false} className="w-100 bg-white">
                                                <div>
                                                    <Alert message={<>Name: &nbsp;&nbsp;<b>{dealer&&dealer.firstname + " " + dealer.surname}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Code: &nbsp;&nbsp;<b>{dealer&&dealer.code}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Email: &nbsp;&nbsp;<b>{dealer&&dealer.email}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Phone: &nbsp;&nbsp;<b>{dealer&&dealer.phone}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>District: &nbsp;&nbsp;<b>{dealer&&dealer.district}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>Area: &nbsp;&nbsp;<b>{dealer&&dealer.area}</b></>} className="w-100 my-1 deep-orange-text"
                                                           style={{borderColor: "#f69a00", backgroundColor:"#fce0b2", color:"#f69a00"}} />
                                                    <Alert message={<>created: &nbsp;&nbsp;<b>{dealer&&moment(dealer.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY")}</b></>} className="w-100 my-1 deep-orange-text"
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
                                                        Dealer Metrics
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

export default DealerDetails;
