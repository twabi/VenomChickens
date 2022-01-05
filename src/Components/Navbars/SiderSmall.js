import React, {useEffect, useState} from "react";
import {Heading, Paragraph, Position, SidebarTab, SideSheet, Tablist} from "evergreen-ui";
import {SidebarHeader, SidebarContent} from 'react-pro-sidebar';
import logo from "../../logo.png";
import {MDBIcon} from "mdbreact";
import {Text} from "react-font";
import {useHistory, useLocation} from "react-router-dom";
import TabList from "./TabList";

const SiderSmall = (props) => {

    const location = useLocation();
    const history = useHistory();
    const [collapsed, setCollapsed] = React.useState(true);
    const [isShown, setIsShown] = useState(false);

    const [selectedIndex, setSelectedIndex] = useState(null);

    const handleRoutes = (route) => {
        setSelectedIndex(route);
        history.push(route);
    }

    useEffect(() => {
        var checked = props.checked;
        setCollapsed(!checked);
        setIsShown(checked);

    }, [props.checked]);

    return (
        <SideSheet
            position={Position.LEFT}
            width={170}
            isShown={isShown}
            onCloseComplete={() => setIsShown(!isShown)}

        >
            <div style={{
                background: "#fff",
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0
            }}>
                <SidebarHeader>
                    <div className="d-flex justify-content-center p-2">
                        <div className="logo border-bottom border-light bg-white rounded-circle">
                            {collapsed ?
                                < >
                                    <img  src={logo} width={80} className="rounded float-left" alt="aligment" />
                                </>
                                :
                                <>
                                    <img  src={logo} style={{height:"8rem"}} className="rounded float-left w-100 p-1 " alt="aligment" />
                                </>

                            }

                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent className="pb-4">
                    <TabList collapsed={collapsed}/>
                </SidebarContent>

            </div>
        </SideSheet>
    )


}

export default SiderSmall;
