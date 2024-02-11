import { Form, Input, Table } from 'antd';

interface FormFields {
  tableName?: string;
}

export const DataOverview = () => {
  const [form] = Form.useForm<FormFields>();
  const tableName = Form.useWatch('tableName', form);
  console.log(tableName);

  return (
    <div>
      <Form<FormFields> form={form}>
        <Form.Item name="tableName">
          <Input.Search placeholder="请输入表名进行搜索" />
        </Form.Item>
      </Form>
      <Table
        columns={[
          {
            title: '表名',
          },
          {
            title: '路径',
          },
          {
            title: '操作',
          },
        ]}
        bordered
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};
