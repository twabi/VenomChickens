import React, {useState} from 'react'
import {Layout} from 'antd';
import NavBar from "../Navbars/NavBar";
import SideBar from "../Navbars/SideBar";
import {MDBBox, MDBCol, MDBIcon, MDBRow} from "mdbreact";
import { MDBCard, MDBCardText } from 'mdbreact';
import {Text} from "react-font";
import {LineChart} from "../Charts/LineChart";
import {PieChart} from "../Charts/PieChart";
import Card from "@material-tailwind/react/Card";
import CardRow from "@material-tailwind/react/CardRow";
import CardHeader from "@material-tailwind/react/CardHeader";
import CardStatus from "@material-tailwind/react/CardStatus";
import {BarChart} from "../Charts/BarChart";


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
                        <div>

                            <MDBBox className="p-3">
                                <MDBRow>
                                    <Card bordered={false} className="w-100 mr-2">
                                        <div className="text-left">
                                            <div className="d-block">
                                                <h5 className="font-weight-bold">
                                                    <Text family='Nunito'>
                                                        Statistics
                                                    </Text>
                                                </h5>
                                                <MDBCardText>
                                                    <Text family='Nunito'>
                                                        An overview of system stats
                                                    </Text>
                                                </MDBCardText>
                                                <hr/>
                                            </div>
                                            <div className="mt-4 py-1">
                                                <MDBRow>
                                                    <MDBRow className="w-100">
                                                        <MDBCol>
                                                            <Card className="my-2">
                                                                <CardRow>
                                                                    <CardHeader color="lightBlue" size="lg" iconOnly>
                                                                        <MDBIcon icon="users" size="3x"/>
                                                                    </CardHeader>

                                                                    <CardStatus title="Dealers" amount="45" />
                                                                </CardRow>
                                                            </Card>
                                                        </MDBCol>
                                                        <MDBCol>
                                                            <Card className="my-2">
                                                                <CardRow>
                                                                    <CardHeader color="lightBlue" size="lg" iconOnly>
                                                                        <MDBIcon icon="money-bill" size="3x"/>
                                                                    </CardHeader>

                                                                    <CardStatus title="Sales" amount="2,900" />
                                                                </CardRow>
                                                            </Card>
                                                        </MDBCol>
                                                        <MDBCol>
                                                            <Card className="my-2">
                                                                <CardRow>
                                                                    <CardHeader color="lightBlue" size="lg" iconOnly>
                                                                        <MDBIcon icon="shopping-cart" size="3x"/>
                                                                    </CardHeader>

                                                                    <CardStatus title="Stock" amount="56" />
                                                                </CardRow>
                                                            </Card>
                                                        </MDBCol>
                                                        <MDBCol>
                                                            <Card className="my-2">
                                                                <CardRow>
                                                                    <CardHeader color="lightBlue" size="lg" iconOnly>
                                                                        <MDBIcon icon="warehouse" size="3x"/>
                                                                    </CardHeader>

                                                                    <CardStatus title="Branches" amount="5" />
                                                                </CardRow>
                                                            </Card>
                                                        </MDBCol>
                                                    </MDBRow>
                                                </MDBRow>
                                            </div>
                                        </div>

                                    </Card>

                                </MDBRow>

                                <MDBRow>
                                    <Card bordered={false} className="w-100 mt-3 mr-2">
                                        <MDBCol >
                                            <div className="py-2 mr-3">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div className="d-block">
                                                            <h5 className="font-weight-bold">
                                                                <Text family='Nunito'>
                                                                    Other Details
                                                                </Text>
                                                            </h5>
                                                        </div>
                                                        {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                    </div>

                                                </div>
                                                <hr/>
                                            </div>
                                        </MDBCol>

                                        <MDBRow className="d-flex justify-content-center align-items-center">

                                            <MDBCol md={6}>
                                                <MDBRow className="w-100">
                                                    <Card className="mt-2 ml-3 w-100">
                                                        <MDBRow>
                                                            <MDBCol>
                                                                <div className="d-block ml-3">
                                                                    <h6 className="font-weight-bold">
                                                                        <Text family='Nunito'>
                                                                            Task Completion Rate
                                                                        </Text>
                                                                    </h6>
                                                                </div>
                                                                {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                            </MDBCol>

                                                        </MDBRow>
                                                        <hr/>
                                                        <MDBRow>
                                                            <LineChart/>

                                                        </MDBRow>

                                                    </Card>
                                                </MDBRow>
                                            </MDBCol>
                                            <MDBCol md={6}>
                                                <MDBRow className="w-100">
                                                    <Card className="mt-2 w-100">
                                                        <MDBRow>
                                                            <MDBCol>
                                                                <div className="d-block ml-3">
                                                                    <h6 className="font-weight-bold">
                                                                        <Text family='Nunito'>
                                                                            Projects Per Member
                                                                        </Text>
                                                                    </h6>
                                                                </div>
                                                                {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                            </MDBCol>

                                                        </MDBRow>
                                                        <hr/>
                                                        <MDBRow>
                                                            <BarChart/>

                                                        </MDBRow>

                                                    </Card>
                                                </MDBRow>
                                            </MDBCol>

                                            <MDBCol md={6}>
                                                <MDBRow className="w-100">
                                                    <Card className="mt-2 ml-3 w-100">
                                                        <MDBRow>
                                                            <MDBCol>
                                                                <div className="d-block ml-3">
                                                                    <h6 className="font-weight-bold">
                                                                        <Text family='Nunito'>
                                                                            Task Completion Rate
                                                                        </Text>
                                                                    </h6>
                                                                </div>
                                                                {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                            </MDBCol>

                                                        </MDBRow>
                                                        <hr/>
                                                        <MDBRow>
                                                            <LineChart/>

                                                        </MDBRow>

                                                    </Card>
                                                </MDBRow>
                                            </MDBCol>
                                            <MDBCol md={6}>
                                                <MDBRow className="w-100">
                                                    <Card className="mt-2 w-100">
                                                        <MDBRow>
                                                            <MDBCol>
                                                                <div className="d-block ml-3">
                                                                    <h6 className="font-weight-bold">
                                                                        <Text family='Nunito'>
                                                                            Projects Per Member
                                                                        </Text>
                                                                    </h6>
                                                                </div>
                                                                {/*<img src={program} className="img-fluid float-left p-4 mt-2" width={220} height={220} alt="" />*/}
                                                            </MDBCol>

                                                        </MDBRow>
                                                        <hr/>
                                                        <MDBRow>
                                                            <PieChart/>

                                                        </MDBRow>

                                                    </Card>
                                                </MDBRow>
                                            </MDBCol>

                                        </MDBRow>

                                    </Card>
                                </MDBRow>

                            </MDBBox>

                        </div>
                    </Content>
                </Layout>
            </Layout>
        </>
    )
}

export default Home;
