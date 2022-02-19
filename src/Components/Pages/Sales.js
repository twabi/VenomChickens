import React, {useEffect, useState} from 'react'
import SideBar from "../Navbars/SideBar";
import NavBar from "../Navbars/NavBar";
import Button from "@material-tailwind/react/Button";
import {Card, Layout, Table, Tooltip} from "antd";
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
import Firebase from "../Firebase";
import {useHistory} from "react-router-dom";
import CreateSaleModal from "../Modals/Sales/CreateSaleModal";


const dbRef = Firebase.database().ref('System/Sales');
const branchRef = Firebase.database().ref('System/Branches');
const userRef = Firebase.database().ref('System/Users');
const prodRef = Firebase.database().ref('System/Products');
const dealerRef = Firebase.database().ref('System/Dealers');
const moment = require('moment');
const { Content } = Layout;
const Sales = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Product',
            dataIndex: 'product',
            key: 'product',
        },{
            title: 'Dealer',
            dataIndex: 'dealer',
            key: 'dealer',
        },{
            title: 'Branch',
            dataIndex: 'branch',
            key: 'branch',
        },{
            title: 'SalesRep',
            dataIndex: 'salesrep',
            key: 'salesrep',
        },{
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
        },{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [sales, loading, error] = useListVals(dbRef);
    const [users] = useListVals(userRef);
    const [dealers] = useListVals(dealerRef);
    const [products] = useListVals(prodRef);
    const [branches] = useListVals(branchRef);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [salesArray, setSalesArray] = useState([])
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [viewModal, setViewModal] = useState(false);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }


    useEffect(() => {
        if(sales){
            var tempArray = [];
            sales.map((sale, index) => {
                tempArray.push({
                    key: index+1,
                    amount: sale.totalPrice,
                    product: products[products.findIndex(prod => prod.productID===sale.product)]&&
                        products[products.findIndex(prod => prod.productID===sale.product)].name,
                    dealer: dealers[dealers.findIndex(dealer => dealer.dealerID===sale.dealer)]&&
                        dealers[dealers.findIndex(dealer => dealer.dealerID===sale.dealer)].firstname + " " +
                        dealers[dealers.findIndex(dealer => dealer.dealerID===sale.dealer)].surname,
                    salesrep: users[users.findIndex(user => user.userID===sale.salesRep)]&&
                        users[users.findIndex(user => user.userID===sale.salesRep)].firstname + " " +
                        users[users.findIndex(user => user.userID===sale.salesRep)].surname,
                    branch: branches[branches.findIndex(branch => branch.branchID===sale.branch)]&&
                        branches[branches.findIndex(branch => branch.branchID===sale.branch)].name,
                    date: moment(sale.dateCreated, "YYYY-MM-DDTh:mm:ss").format("DD MMM YYYY - HH:mm"),
                    action : <Button appearance="default" onClick={() => {
                        //setSelectedTask(task);
                        //setViewModal(true);
                    }}>
                        <EyeOpenIcon color="blue700"/>
                    </Button>
                    
                })
            })
            setDataArray([...tempArray]);
            setSalesArray([...tempArray]);
        }

        
    }, [branches, dealers, products, sales, users]);

    const handleSearch = searchText => {
        const filteredEvents = salesArray.filter(({ product, dealer, salesrep, branch, amount }) => {
            product = product.toLowerCase();
            salesrep = salesrep.toLowerCase();
            branch = branch.toLowerCase();
            amount = amount.toLowerCase();
            dealer = dealer.toLowerCase();
            return dealer.includes(searchText) || amount.includes(searchText) || branch.includes(searchText) ||
                salesrep.includes(searchText) || product.includes(searchText);
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
                                    isShown={viewModal}
                                    title={
                                        <div className="w-100 d-flex justify-content-between">
                                            <b>View Sale</b>
                                        </div>
                                    }
                                    onCloseComplete={() => {setViewModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={showModal}
                                    title="Create Sale"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateSaleModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Sales
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search sales" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <Button size="large" type="primary" style={{background: "#f69a00", borderColor: "#f69a06"}} className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Sale
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
                                            <Table style={{overflow: "auto"}} id={"dataTable"} loading={loading} dataSource={dataArray} columns={columns} />
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

export default Sales;
