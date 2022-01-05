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
        if(e.key === '/users'){
            handleRoutes("/users");
        } else if(e.key === '/adminHome'){
            handleRoutes("/adminHome");
        } else if(e.key === '/projects'){
            handleRoutes("/projects");
        } else if(e.key === '/tasks'){
            handleRoutes("/tasks");
        }
    };

    return (
        <Menu className="mt-4 mx-1 px-2"
              style={{background: "#fff"}}
              defaultSelectedKeys={[location.pathname]}
              onClick={handleClick}>
            <Menu.Item
                key="/adminHome"
                id="/adminHome"
                className={collapsed ? "text-center h6 pl-2" : "h6 pl-2"}
                aria-controls={`panel-${"/home"}`}
            >
                <MDBIcon icon="home" size="lg" className="mr-3 d-inline"/>
                {collapsed? null : <b>Home</b>}
            </Menu.Item>

            <Menu.Item
                key="/users"
                id="/users"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
                onSelect={() => handleRoutes("/users")}
                isSelected={"/users" === location.pathname}
                aria-controls={`panel-${"/users"}`}
            >
                <MDBIcon icon="users" size="lg" className="mr-3"/>
                {collapsed? null : <b>Books</b>}
            </Menu.Item>

            <Menu.Item
                key="/projects"
                id="/projects"
                className={collapsed ? "h6 text-center pl-2" : "h6 pl-2"}
                onSelect={() => handleRoutes("/projects")}
                isSelected={"/projects" === location.pathname || "/projects/:id" === location.pathname}
                aria-controls={`panel-${"/projects"}`}
            >
                <MDBIcon icon="project-diagram" size="lg" className="mr-3"/>
                {collapsed? null : <b>Authors</b>}
            </Menu.Item>

            <Menu.Item
                key="/tasks"
                id="/tasks"
                className={collapsed ? "h6 text-center pl-3" : "h6 pl-3"}
                onSelect={() => handleRoutes("/tasks")}
                isSelected={"/tasks" === location.pathname}
                aria-controls={`panel-${"/tasks"}`}
            >
                <MDBIcon icon="clipboard-list" size="lg" className="mr-3"/>
                {collapsed? null : <b>Tasks</b>}
            </Menu.Item>



        </Menu>
    )
}
export default TabList;
