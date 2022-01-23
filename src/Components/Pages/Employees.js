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
import EditUserModal from "../Modals/User/EditUserModal";
import ViewUserModal from "../Modals/User/ViewUserModal";
import FireFetch from "../FireFetch";


const dbRef = Firebase.database().ref('System/Users');
const { Content } = Layout;
const moment = require("moment");
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
            employees.map((employee, index) =>{
                tempArray.push({
                    key: index+1,
                    name: employee.firstname + " " + employee.surname,
                    email: employee.email,
                    phone: employee.phone,
                    role: employee.role,
                    created: moment(employee.dateCreated, "YYYY-MM-DDTh:mm").format("DD MMM YYYY"),
                    action: <div className="d-flex flex-row">
                        <Button buttonType="outline"
                                size="sm" onClick={() => {
                            setEditUser(employee);
                            setViewModal(true);
                        }}>
                            <EyeOpenIcon color="blue700"/>
                        </Button>
                        <Button buttonType="outline"
                                size="sm" onClick={() => {
                            setEditUser(employee);
                            setShowEditModal(true);
                        }}>
                            <EditIcon color="primary"/>
                        </Button>
                        <Button buttonType="outline"
                                size="sm" onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            if (confirm("Are you sure you want to delete Task?")) {
                                deleteUser(employee.userID);
                            }
                        }}>
                            <TrashIcon color="danger"/>
                        </Button>
                        </div>
                })
            })
        }

        setDataArray([...tempArray]);
        setUserArray([...tempArray])
    }, [employees]);

    const handleSearch = searchText => {
        const filteredEvents = userArray.filter(({ name, email, role, phone }) => {
            name = name&&name.toLowerCase();
            email = email&&email.toLowerCase();
            role = role&&role.toLowerCase();
            phone = phone&&phone.toLowerCase();
            return name.includes(searchText) || email.includes(searchText) || role.includes(searchText) || phone.includes(searchText);
        });

        setDataArray(filteredEvents);
    };

    const deleteUser = (objectID) => {

        var payload = {
            "uid": objectID
        }

        console.log(objectID);
        const output = FireFetch.DeleteFromDB("Users", objectID);
        output.then((result) => {
            console.log(result);
            if(result === "success"){
                setMessage("User deleted successfully");
                setColor("success");
                setShowDeleteAlert(true);
                setTimeout(() => {
                    setShowDeleteAlert(false);
                }, 3000);

                //delete from firebase auth using the cloud function deployed url
                fetch("https://us-central1-art-of-selling.cloudfunctions.net/deleteUser",
                    {
                        method : 'POST',
                        body : JSON.stringify(payload),
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                    .then(response => response.text())
                    .then((result) => {
                        console.log(result)
                    })
                    .catch((error) => {
                        console.log('error', error)
                    });

            } else {
                setMessage("Unable to add user and error occurred :: " + result);
                setColor("danger");
                setShowDeleteAlert(true);
            }
        });

    }
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
                                        <EditUserModal modal={setShowEditModal} editUser={editUser}/>
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
                                        <ViewUserModal editUser={editUser}/>
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
