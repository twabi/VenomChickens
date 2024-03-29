import React, {useState} from "react";
import {
    MDBNavbar, MDBNavbarNav, MDBNavItem, MDBDropdown,
    MDBDropdownToggle, MDBDropdownMenu, MDBDropdownItem,
} from "mdbreact";
import {Avatar, Switch} from "antd";
import Firebase from "../Firebase";
import {useAuthState} from "react-firebase-hooks/auth";
import {useListVals} from "react-firebase-hooks/database";
import {Dialog} from "evergreen-ui";

const dbRef = Firebase.database().ref('System/Users');
const NavBar = (props) => {
    const [checked, setChecked] = useState(true);
    const [userName, setUserName] = useState(null);
    const [user, error] = useAuthState(Firebase.auth());
    const [users] = useListVals(dbRef);
    const [modal, setModal] = useState(false);

    const handleChecked = (check) => {
        setChecked(check);
        props.checkBack(check);
    }
    function onChange(checked) {
        setChecked(checked);
        props.checkBack(checked);
    }

    const toggleModal = () => {
        setModal(!modal);
    }

    React.useEffect(() => {

        if(user){
            if(users){
                var title = users[users.findIndex(x => (x.email) === user.email)]&&users[users.findIndex(x => (x.email) === user.email)].role;
                setUserName(title);
            }
            //setUserName(user.email);
        }
        
        if(error){
            console.log(error.message);
            //window.location.href = "/login";
            //window.location.href = "/";
            //window.location.hash="no-back-button";
            //window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
            //window.onhashchange=function(){window.location.hash="no-back-button";}
        }

    }, [checked, error, user, users]);


    const handleLogout = () => {
        Firebase.auth().signOut()
            .then(() => {
                window.location.href = "/";
                window.location.hash="no-back-button";
                window.location.hash="Again-No-back-button";//again because google chrome don't insert first hash into history
                window.onhashchange=function(){window.location.hash="no-back-button";}
            }).catch((err) => {
            alert("oops an error occurred : " + err);
        });
    }
    return(

        <MDBNavbar color="white" light expand="xs">
            <Dialog isShown={modal} hasFooter={false} title={"Change Account Email"} onCloseComplete={toggleModal}>
            </Dialog>

            <MDBNavbarNav left>
                <Switch checked={checked} style={{background: "#ffa610"}} onChange={onChange} />
            </MDBNavbarNav>
            <MDBNavbarNav right className="">
                <MDBNavItem className="d-flex justify-content-center align-items-center">
                    <Avatar className="rounded float-left d-inline"
                            style={{ backgroundColor: "#ffa610", verticalAlign: 'middle' }} size="small" gap={1}>
                        {userName&&userName.charAt(0)}
                    </Avatar>
                    <MDBDropdown className="mr-5">
                        <MDBDropdownToggle nav caret>
                            <div  className="d-inline" >
                                <p className="d-inline mx-1 font-weight-bold">{userName}</p>
                            </div>
                        </MDBDropdownToggle>
                        <MDBDropdownMenu className="dropdown-default">
                            <MDBDropdownItem href="#!" onClick={() => {toggleModal()}}>Change Password</MDBDropdownItem>
                            <MDBDropdownItem href="#!" onClick={handleLogout}>Log Out</MDBDropdownItem>
                        </MDBDropdownMenu>
                    </MDBDropdown>
                </MDBNavItem>
            </MDBNavbarNav>
        </MDBNavbar>
    );
}
export default NavBar;
