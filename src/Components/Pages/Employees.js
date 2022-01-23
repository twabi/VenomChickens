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
import CreateUserModal from "../Modals/User/CreateUserModal";


const dbRef = Firebase.database().ref('System/Users');
const { Content } = Layout;
const Employees = () => {

    const columns = [
        {
            title: 'Key',
            dataIndex: 'key',
            key: 'key',
        },
        {
            title: 'Fullname',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },{
            title: 'Phone',
            dataIndex: 'phone',
            key: 'phone',
        },{
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
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
    const [employees, loading, error] = useListVals(dbRef);
    const [showModal, setShowModal] = useState(false);
    const [dataArray, setDataArray] = useState([]);
    const [userArray, setUserArray] = useState([]);
    const [color, setColor] = useState("info");
    const [message, setMessage] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);
    const [viewModal, setViewModal] = useState(false);
    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
    }


    useEffect(() => {
        var tempArray = [];
        if(employees){
            employees.map((employee) =>{
                tempArray.push({
                    key: 1,
                    name: "Jack Bauer",
                    email: "jack@hotmail.com",
                    books: 7,
                    created: new Date(2021, 11, 12),
                    action: <div>
                        <Button intent="primary" onClick={() => {
                            //setSelectedTask(task);
                            setViewModal(true);
                        }}>
                            <EyeOpenIcon color="blue700"/>
                        </Button>
                        <Button intent="danger" onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Are you sure you want to delete Task?")) {
                                //deleteTask(task.taskID);
                            }
                        }}>
                            <TrashIcon color="danger"/>
                        </Button>
                        <Button intent="edit" onClick={() => {
                            //setSelectedTask(task);
                            //setEditModal(true);
                        }}>
                            <EditIcon color="primary"/>
                        </Button></div>
                })
            })
        }

        setDataArray([...tempArray]);
    }, [employees]);

    //const handleProceed = (id) => {
        //history.push(generatePath("/authors/:id", { id }));
    //};

    const handleSearch = searchText => {
        const filteredEvents = userArray.filter(({ name, email, dpt, userRole }) => {
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
                                    title="Create New Employee"
                                    onCloseComplete={() => {setShowModal(false)}}
                                    shouldCloseOnOverlayClick={false}
                                    hasFooter={false}>

                                    <MDBCol md={12}>
                                        <CreateUserModal modal={setShowModal}/>
                                    </MDBCol>

                                </Dialog>

                                <Dialog
                                    isShown={showEditModal}
                                    title="Edit Employee"
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
                                            <b>View Employee</b>
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
                                                            Employees
                                                        </Text>
                                                    </h3>
                                                </div>
                                            </div>

                                            <MDBRow className="ml-1">
                                                <SearchInput height={40} placeholder="Search Employees" className="w-100"   onChange={e => handleSearch(e.target.value)} />
                                                <Button size="large" type="primary" style={{background: "#f69a00", borderColor: "#f69a06"}} className="mx-2" onClick={() => {setShowModal(true)}}>
                                                    New Employee
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

export default Employees;
