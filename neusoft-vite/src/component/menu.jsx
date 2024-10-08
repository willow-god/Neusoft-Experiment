import React, { useState, useEffect } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import {
    useNavigate,
    useLocation
} from 'react-router-dom'

const items = [
    {
        key: 'home',
        label: '主页',
        type: 'group',
        children: [
            {
                key: '/',
                label: '主页导航',
            },
        ],
    },
    {
        type: 'divider',
    },
    {
        key: 'sx',
        label: '实现',
        type: 'group',
    },
    {
        key: 'gn',
        label: '功能',
        icon: <AppstoreOutlined />,
        children: [
            {
                key: 'gn-sssj',
                label: '实时数据',
                type: 'group',
                children: [
                    {
                        key: '/statistics',
                        label: '普通检测',
                    },
                    {
                        key: '/statistics-streaming',
                        label: '流式检测',
                    },
                ],
            },
            {
                key: 'gn-scjc',
                label: '上传检测',
                type: 'group',
                children: [
                    {
                        key: '/licence-plate',
                        label: '车牌检索',
                    },
                    {
                        key: '/face-recognition',
                        label: '人脸识别',
                    },
                ],
            },
        ],
    },
    {
        key: 'gl',
        label: '管理',
        icon: <MailOutlined />,
        children: [
            {
                key: '/data-upload',
                label: '数据上传',
            },
            {
                key: '/data-management',
                label: '数据管理',
            },
            {
                key: '/upload',
                label: 'Minio上传',
            },
            {
                key: 'gl-zhgl',
                label: '账户管理',
                children: [
                    {
                        key: 'gl3',
                        label: '添加账户',
                    },
                    {
                        key: 'gl4',
                        label: '管理账户',
                    },
                ],
            },
        ],
    },
    {
        key: 'sz',
        label: '设置',
        icon: <SettingOutlined />,
        children: [
            {
                key: 'sz1',
                label: '系统设置',
            },
            {
                key: 'sz2',
                label: '页面设置',
            },
            {
                key: 'sz3',
                label: '自定义',
            },
            {
                key: 'sz4',
                label: '高级设置',
            },
        ],
    },
    {
        type: 'divider',
    },
    {
        key: 'wm',
        label: '我们',
        type: 'group',
        children: [
            {
                key: '/team',
                label: '团队分工',
            },
            {
                key: '/about',
                label: '关于',
            },
        ],
    },
];
const MenuComponent = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedKeys, setSelectedKeys] = useState([]);
    const [openKeys, setOpenKeys] = useState([]);

    useEffect(() => {
        setSelectedKeys([location.pathname]);
        const parentKey = findParentKey(location.pathname);
        setOpenKeys(parentKey ? [parentKey] : []);
    }, [location.pathname]);

    const onClick = (e) => {
        setSelectedKeys([e.key]);
        navigate(e.key);
    };

    const findParentKey = (key) => {
        for (const item of items) {
            if (item.children) {
                for (const child of item.children) {
                    if (child.key === key) {
                        return item.key;
                    } else if (child.children) {
                        for (const subChild of child.children) {
                            if (subChild.key === key) {
                                return item.key;
                            }
                        }
                    }
                }
            }
        }
        return null;
    };

    return (
        <div>
            <h2 style={{ margin: '0 0', backgroundColor: '#ffffff', fontSize: '1.2em', display: 'flex', alignItems: 'center', padding: '10px', paddingRight: '30px', paddingBottom: '20px', paddingTop: '20px', justifyContent: 'center', borderBottom: '1px solid #ccc' }}>
                <span style={{ margin: '0 5px' }}>😊</span>
                咕咕人车检测
            </h2>
            <Menu
                onClick={onClick}
                style={{ width: 256 }}
                selectedKeys={selectedKeys}
                openKeys={openKeys}
                onOpenChange={(keys) => setOpenKeys(keys)}
                mode="inline"
                items={items}
            />
        </div>
    );
};

export default MenuComponent;