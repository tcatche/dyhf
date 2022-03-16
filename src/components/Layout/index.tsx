import React, { createElement, ReactChild } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';
import { isMobile } from '../../utils/is';
import logo from './logo.svg';
import './index.less';

const { Header, Content, Footer } = Layout;

interface RouteItem {
  name: string;
  path: string;
  isMenu: boolean;
}

interface IProps {
  routes: Array<RouteItem>;
  children: ReactChild | ReactChild[];
}
function AppLayout(props: IProps) {
  return (
    <Layout className={ isMobile() ? `app-layout mobile` : "app-layout"}>
      <Header className="layout-header">
        <div className="logo" ><img src={logo} alt="logo" /></div>
        <Menu mode="horizontal" defaultSelectedKeys={['2']}>
          {props.routes.filter(route => route.isMenu).map(route => (
            <Menu.Item key={route.name}><Link to={route.path}>{route.name}</Link></Menu.Item>
          ))}
        </Menu>
      </Header>
      <Content className="layout-content">
        <header className="content-header">
          <img src={logo} className="content-logo" alt="logo" />
        </header>
        <div className="content-inner">
        {props.children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
  </Layout>
  );
}

export default AppLayout;
