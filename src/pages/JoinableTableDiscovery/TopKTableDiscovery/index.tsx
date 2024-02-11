import { Button, Form, InputNumber, Select, Table } from 'antd';

interface FormFields {
  tableData?: string;
}

export const TopKTableDiscovery = () => {
  const [form] = Form.useForm<FormFields>();
  const tableName = Form.useWatch<string | undefined>('tableName', form);
  console.log(tableName);

  return (
    <div>
      <Form<FormFields> form={form} layout="inline" className="mb-4">
        <Form.Item name="tableName" label="表名" className="w-52">
          <Select showSearch placeholder="请选择表名" />
        </Form.Item>
        <Form.Item name="columnName" label="列名" className="w-52">
          <Select showSearch placeholder="请选择列名" />
        </Form.Item>
        <Form.Item name="resultCount" label="结果集数量" initialValue={5}>
          <InputNumber />
        </Form.Item>
        <div className="flex gap-4 ml-2">
          <Button>重置</Button>
          <Button type="primary" className="bg-[var(--ant-color-primary)]">
            搜索
          </Button>
        </div>
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
