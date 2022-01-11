import React, {useEffect, useState} from 'react'
import {Heading, Paragraph, SidebarTab, Tablist} from "evergreen-ui";
import {MDBIcon} from "mdbreact";
import {Text} from "react-font";
import {useHistory, useLocation} from "react-router-dom";
import {Menu} from "antd";

const TabList = (props) => {

    const [collapsed, setCollapsed] = useState(props.collapsed);
    const location = useLocation();
    const history = useHistory();
    const [selectedIndex, setSelectedIndex] = useState(null);


    useEffect(() => {
        setCollapsed(props.collapsed);
        console.log(props.collapsed);
    }, [props]);

    const handleRoutes = (route) => {
        setSelectedIndex(route);
        history.push(route);
    }

    const handleClick = e => {
        handleRoutes(e.key);
    };

    const getKey = (path) => {
        var exactPath = "/"
        if(path.includes("employees")){
            exactPath = "/employees"
        } else if(path.includes("dealers")){
            exactPath = "/dealers"
        } else if(path.includes("home")){
            exactPath = "/home"
        }else if(path.includes("sales")){
            exactPath = "/sales"
        }else if(path.includes("products")){
            exactPath = "/products"
        }else if(path.includes("branches")){
            exactPath = "/branches"
        }

        return exactPath;
    }

    return (
        <Menu className="mt-4 mx-1 px-2"
              style={{background: "#fff"}}
              defaultSelectedKeys={[getKey(location.pathname)]}
              onClick={handleClick}>
            <Menu.Item
                key="/home"
                id="/home"
                className={collapsed ? "text-center h6 pl-2" : "h6 pl-2"}
            ><MDBIcon icon="home" size="lg" className="mr-3 d-inline"/>
                {collapsed? null : <b>Home</b>}
            </Menu.Item>

            <Menu.Item
                key="/employees"
                id="/employees"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
            ><MDBIcon icon="users" size="lg" className="mr-3"/>
                {collapsed? null : <b>Employees</b>}
            </Menu.Item>

            <Menu.Item
                key="/dealers"
                id="/dealers"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
            ><MDBIcon icon="user-tie" size="lg" className="mr-3"/>
                {collapsed? null : <b className="ml-2">Dealers</b>}
            </Menu.Item>

            <Menu.Item
                key="/products"
                id="/products"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
            ><MDBIcon icon="shopping-cart" size="lg" className="mr-3"/>
                {collapsed? null : <b className="ml-1">Products</b>}
            </Menu.Item>

            <Menu.Item
                key="/branches"
                id="/branches"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
            ><MDBIcon icon="project-diagram" size="lg" className="mr-3"/>
                {collapsed? null : <b>Branches</b>}
            </Menu.Item>

            <Menu.Item
                key="/sales"
                id="/sales"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
            ><MDBIcon icon="money-bill-alt" size="lg" className="mr-3"/>
                {collapsed? null : <b>Sales</b>}
            </Menu.Item>



        </Menu>
    )
}
export default TabList;
