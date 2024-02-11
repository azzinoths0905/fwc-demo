import { Card, Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getRouteMappings, menuItems } from './router';

export const DemoLayout = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Layout className="min-h-[100vh]">
      <Layout.Header>Header</Layout.Header>
      <Layout>
        <Layout.Sider>
          <Menu
            className="h-full"
            items={menuItems}
            activeKey={getRouteMappings().pathKeyMap[pathname]}
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
