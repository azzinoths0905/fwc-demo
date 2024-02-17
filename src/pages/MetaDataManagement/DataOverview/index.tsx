import { SearchOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Table } from 'antd';
import { useMemo } from 'react';
import data from '../../../data/tables.json';

interface FormFields {
  tableName?: string;
}

export const DataOverview = () => {
  const [form] = Form.useForm<FormFields>();
  const tableName = Form.useWatch('tableName', form);

  const dataSource = useMemo(() => {
    if (!tableName?.length) {
      return data;
    }

    return data.filter((d) => d.title.includes(tableName));
  }, [tableName]);

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
        columns={[
          {
            title: '表名',
            dataIndex: 'title',
          },
          {
            title: '路径',
            dataIndex: 'path',
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: 200,
            render: (_, record) => {
              return (
                <Button
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
