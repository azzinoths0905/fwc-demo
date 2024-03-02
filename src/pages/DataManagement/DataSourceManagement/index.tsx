import { Button, Form, Modal, Table } from 'antd';
import _ from 'lodash';

export const DataSourceManagement = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button
          type="primary"
          onClick={() => {
            Modal.info({
              // title: record.title,
              icon: null,
              content: <Form />,
              width: 800,
            });
          }}
        >
          注册
        </Button>
      </div>
      <Table
        columns={[
          {
            title: 'id',
            dataIndex: 'id',
          },
          {
            title: '服务器 IP',
            dataIndex: 'server_ip',
          },
          {
            title: '服务器名称',
            dataIndex: 'server_name',
          },
          {
            title: '端口号',
            dataIndex: 'port',
          },
          {
            title: '数据源类型',
            dataIndex: 'type',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 200,
            render: (_, record) => {
              return (
                <div>
                  <Button className="px-0" type="link">
                    编辑
                  </Button>
                  <Button className="px-0" type="link">
                    删除
                  </Button>
                  <Button className="px-0" type="link">
                    表信息抽取
                  </Button>
                </div>
              );
            },
          },
        ]}
        bordered
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        dataSource={[]}
        rowKey="id"
      />
    </div>
  );
};
