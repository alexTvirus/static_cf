import { Layout } from 'antd';
import { Menu } from 'antd';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
const { Sider } = Layout;

const SideBarComponent = (props) => {

    const {handleSelectMenuSideBar,sidebarList} = props

    const { id } = useSelector(state => { 
        return state.sidebar
    })

    const handleOnlickSideBar = (e) => {
        handleSelectMenuSideBar(e.key)
    }

    return (<>
        <Sider trigger={null} collapsible >
            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={[`${id}`]}
                selectedKeys={[`${id}`]}
                items={sidebarList}
                onClick={handleOnlickSideBar}
            />
        </Sider>

    </>)
}

export default SideBarComponent