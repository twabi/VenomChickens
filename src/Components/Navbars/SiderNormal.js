import React, {useEffect, useState} from "react";
import {SidebarContent, SidebarHeader} from "react-pro-sidebar";
import logo from "../../logo.png";
import {Heading, Paragraph, SidebarTab} from "evergreen-ui";
import {MDBIcon} from "mdbreact";
import {Text} from "react-font";
import {useHistory, useLocation} from "react-router-dom";
import {Layout} from "antd";
import TabList from "./TabList";

const { Sider } = Layout;

const SiderNormal = (props) => {


    const [collapsed, setCollapsed] = React.useState(true);
    const [isSmall, setIsSmall] = useState(false);
    const [isShown, setIsShown] = useState(false);

    const mq = window.matchMedia('(max-width: 768px)');




    const toggle = () => {
        if (mq.matches) {
            // do something here
            setIsSmall(true);
            setCollapsed(true)
        } else {
            // do something here
            setIsSmall(false);
        }
    }


    useEffect(() => {
        var checked = props.checked;
        setCollapsed(!checked);
        setIsShown(checked);

        toggle();

        // returns true when window is <= 768px
        mq.addListener(toggle);

        // unmount cleanup handler
        return () => mq.removeListener(toggle);
    }, [props.checked]);


    return (
        <Sider
            collapsible
            collapsedWidth={isSmall ? "55" : "90"}
            width={isSmall ? "150" : "200"}
            id="sider"
            collapsed={collapsed}
            onCollapse={() => setCollapsed(!collapsed)}
            className="sidebar"
            trigger={null}
            style={{
                background: "#fff",
                overflow: "auto",
                height: "100vh",
                position: "sticky",
                top: 0,
                left: 0
            }}
        >
            <div>
                <SidebarHeader>
                    <div className="d-flex justify-content-center p-2">
                        <div className="logo border-bottom border-light bg-white rounded-circle">
                            {collapsed ?
                                <>
                                    <img  src={logo} width={80} className="" alt="aligment" />
                                </>
                                :
                                <>
                                    <img  src={logo} style={{height:"8rem"}} className="float-left" alt="aligment" />
                                </>

                            }

                        </div>
                    </div>
                </SidebarHeader>
                <hr className="bg-white mx-3"/>
                <SidebarContent className="pb-4">
                   <TabList collapsed={collapsed}/>
                </SidebarContent>

            </div>
        </Sider>
    )
}

export default SiderNormal
