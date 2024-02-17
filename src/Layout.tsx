import { Card, Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { FALLBACK_PATH, getRouteMappings, menuItems } from './router';
import { useEffect, useMemo } from 'react';

export const DemoLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const activeKey = useMemo(() => {
    return getRouteMappings().pathKeyMap[pathname];
  }, [pathname]);

  useEffect(() => {
    if (pathname === '/') {
      navigate(FALLBACK_PATH);
    }
  }, [navigate, pathname]);

  return (
    <Layout className="min-h-[100vh]">
      <Layout.Header
        className="px-4 bg-white border-b border-gray-200"
        style={{ borderBottomStyle: 'solid' }}
      >
        <div>Header</div>
      </Layout.Header>
      <Layout>
        <Layout.Sider>
          <Menu
            className="h-full"
            items={menuItems}
            activeKey={activeKey}
            defaultSelectedKeys={[activeKey || '']}
            onClick={(info) => {
              const targetPath = getRouteMappings().keyPathMap[info.key];
              if (targetPath) {
                navigate(targetPath);
              }
            }}
          />
        </Layout.Sider>
        <Layout.Content className="p-4">
          <Card className="min-h-full">
            <Outlet />
          </Card>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
