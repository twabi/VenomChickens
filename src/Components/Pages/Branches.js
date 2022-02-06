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
import {generatePath} from "react-router";
import CreateBranchModal from "../Modals/Branches/CreateBranchModal";
import EditBranchModal from "../Modals/Branches/EditBranchModal";


const dbRef = Firebase.database().ref('System/Branches');
const { Content } = Layout;
const Branches = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Location',
            dataIndex: 'location',
            key: 'location',
        },{
            title: 'In-Charge',
            dataIndex: 'charge',
            key: 'charge',
        },{
            title: 'Created',
            dataIndex: 'created',
            key: 'created',
        },{
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
        },
    ];

    const history = useHistory();
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [branches, loading, error] = useListVals(dbRef);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [checkedData, setCheckedData] = useState(true);
    const [editBranch, setEditBranch] = useState(null)
    const callback = (data) => {
        setCheckedData(data);
    }


    useEffect(() => {
        
        if(branches){
            var tempArray = [];
            branches.map(branch => {
                tempArray.push({
                    key:1,
                    name: branch.name,
                    location: branch.area,
                    charge: branch.manager,
                    created: branch.dateCreated,
                    action : <MDBIcon icon="arrow-circle-right" className="indigo-text" onClick={() => {handleProceed("authorID1234")}} size="2x" />
                })
            })
            setDataArray([...tempArray]);
        }


    }, [branches]);

    const handleProceed = (id) => {
        history.push(generatePath("/branches/:id", { id }));
    };

    const handleSearch = searchText => {
        const filteredEvents = userArray.filter(({ name, location, charge }) => {
            name = name.toLowerCase();
            location = location.toLowerCase();
            charge = charge.toLowerCase();
            return name.includes(searchText) || location.includes(searchText) || charge.includes(searchText);
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
                                    title="Create New Branch"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateBranchModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

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

                                <Card className="w-100">

                                    <MDBRow>
                                        <MDBCol md={12} className="w-100">
                                            <div className="text-left mb-3">
                                                <div className="d-block">
                                                    <h3 className="font-weight-bold">
                                                        <Text family='Nunito'>
                                                            Branches
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search branches" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <Button size="large" type="primary" style={{background: "#f69a00", borderColor: "#f69a06"}} className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Branch
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

export default Branches;
