import React, {useState} from 'react'
import {Card, Layout} from 'antd';
import NavBar from "./Navbars/NavBar";
import SideBar from "./Navbars/SideBar";
import Firebase from "./Firebase";


const { Content } = Layout;
const Home = () => {

    const [checkedData, setCheckedData] = useState(true);
    const callback = (data) => {
        setCheckedData(data);
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

                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default Home;
