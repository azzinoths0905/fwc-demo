import { RouteObject, createBrowserRouter } from 'react-router-dom';
import { DataUpload } from './pages/DataManagement/DataUpload';
import { MenuProps } from 'antd';
import _ from 'lodash';
import { DemoLayout } from './Layout';

const pathKeyMap: Record<string, string | undefined> = {};
const keyPathMap: Record<string, string | undefined> = {};

export interface RouteOption {
  label: string;
  key: string;
  path?: string;
  element?: RouteObject['element'];
  children?: RouteOption[];
}

export const routeOptions: RouteOption[] = [
  {
    label: '数据管理',
    key: 'data_management',
    path: '/data_management',
    children: [
      {
        label: '数据上传',
        key: 'data_upload',
        path: 'data_upload',
        element: <DataUpload />,
      },
    ],
  },
  {
    label: '元数据管理',
    key: 'meta_data_management',
    path: '/meta_data_management',
    children: [
      {
        label: '数据总览',
        key: 'data_overview',
        path: 'data_overview',
        element: 'data_overview',
      },
    ],
  },
  {
    label: 'Joinable 表发现',
    key: 'joinable_table_discovery',
    path: '/joinable_table_discovery',
    children: [
      {
        label: 'Top-K 表发现',
        key: 'top_k_table_discovery',
        path: 'top_k_table_discovery',
        element: 'top_k_table_discovery',
      },
    ],
  },
];

const buildRouteObject = (
  origin?: RouteOption[]
): RouteObject[] | undefined => {
  if (!origin || !origin.length) {
    return undefined;
  }

  return origin.map((o) => ({
    path: o.path,
    element: o.element,
    children: buildRouteObject(o.children),
  }));
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DemoLayout />,
    children: buildRouteObject(routeOptions) || [],
  },
]);

const buildMenuItems = (
  origin?: RouteOption[],
  pathPrefix: string = ''
): MenuProps['items'] | undefined => {
  if (!origin || !origin.length) {
    return undefined;
  }

  return origin.map((o) => {
    const path = o.path ? `${pathPrefix}/${_.trim(o.path, '/')}` : undefined;

    if (path) {
      pathKeyMap[path] = o.key;
      keyPathMap[o.key] = path;
    }

    return {
      label: o.label,
      key: o.key,
      type: o.element ? undefined : 'group',
      children: buildMenuItems(o.children, path),
    };
  });
};

export const menuItems = buildMenuItems(routeOptions);

export const getRouteMappings = () => ({ keyPathMap, pathKeyMap });
