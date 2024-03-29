import { Button, Form, Input, Modal, Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';

import { MenuOutlined, SearchOutlined } from '@ant-design/icons';

import data from '../../../data/tables.json';
import { DeleteButton } from '../../../components/DeleteButton';
import {
  getDataOverviewDeleteKeys,
  setDataOverviewDeleteKeys,
} from '../../../store/dataOverview';

interface FormFields {
  tableName?: string;
}

export const DataOverview = () => {
  const [deletedKeys, setDeletedKeys] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const keys = await getDataOverviewDeleteKeys();
    setDeletedKeys(keys);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const [form] = Form.useForm<FormFields>();
  const tableName = Form.useWatch('tableName', form);

  const dataSource = useMemo(() => {
    if (deletedKeys === null) {
      return [];
    }

    const dataNotDeleted = data.filter((d) => !deletedKeys.includes(d.title));

    if (!tableName?.length) {
      return dataNotDeleted;
    }

    return dataNotDeleted.filter((d) => d.title.includes(tableName));
  }, [deletedKeys, tableName]);

  return (
    <div>
      <Form<FormFields> form={form}>
        <Form.Item name="tableName">
          <Input
            addonBefore={<SearchOutlined />}
            placeholder="请输入表名进行搜索"
          />
        </Form.Item>
      </Form>
      <Table
        loading={loading}
        columns={[
          {
            title: '表名',
            dataIndex: 'title',
          },
          {
            title: '数据源类型',
            dataIndex: 'dataType',
          },
          {
            title: '来源服务器名称',
            dataIndex: 'serverName',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 200,
            render: (_, record) => {
              return (
                <div className="flex gap-4">
                  <Button
                    size="small"
                    icon={<MenuOutlined />}
                    className="px-0"
                    type="link"
                    onClick={() => {
                      Modal.info({
                        title: record.title,
                        icon: null,
                        content: (
                          <Table
                            size="small"
                            columns={record.columns.map((c) => ({
                              title: c,
                              dataIndex: c,
                            }))}
                            dataSource={record.data}
                          />
                        ),
                        width: 800,
                      });
                    }}
                  >
                    查看详情
                  </Button>
                  <DeleteButton
                    onSuccess={async () => {
                      await setDataOverviewDeleteKeys([
                        ...(deletedKeys || []),
                        record.title,
                      ]);
                      refresh();
                    }}
                  />
                </div>
              );
            },
          },
        ]}
        bordered
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        dataSource={dataSource}
        rowKey="title"
      />
    </div>
  );
};
