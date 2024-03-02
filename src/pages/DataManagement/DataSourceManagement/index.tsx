import { DeleteOutlined, EditOutlined, SyncOutlined } from '@ant-design/icons';
import { Button, Drawer, Form, Input, Modal, Table, message } from 'antd';
import _ from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { DeleteButton } from '../../../components/DeleteButton';
import localData from '../../../data/data-source-table.json';

interface RegisterFormData {
  id?: string;
  serverIp?: string;
  serverName?: string;
  port?: string;
  type?: string;
  extra?: string;
}

const FormItem = Form.Item<RegisterFormData>;

export const DataSourceManagement = () => {
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);

  const [dataSource, setDataSource] = useState<RegisterFormData[]>(
    localData.map((d) => ({
      id: d.id,
      serverIp: d.server_ip,
      serverName: d.server_name,
      port: d.port,
      type: d.type,
    }))
  );

  const [form] = Form.useForm<RegisterFormData>();

  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentTarget === null) {
      form.resetFields();
    }
  }, [currentTarget, form]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => {
              setCurrentTarget('');
            }}
          >
            注册
          </Button>
        </div>
        <Table
          loading={loading}
          dataSource={dataSource}
          columns={[
            {
              title: 'id',
              dataIndex: 'id',
            },
            {
              title: '服务器 IP',
              dataIndex: 'serverIp',
            },
            {
              title: '服务器名称',
              dataIndex: 'serverName',
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
                  <div className="flex gap-4">
                    <Button
                      size="small"
                      className="px-0"
                      type="link"
                      icon={<EditOutlined />}
                      onClick={() => {
                        form.setFieldsValue(record);
                        setCurrentTarget(record.id || '');
                      }}
                    >
                      编辑
                    </Button>
                    <DeleteButton
                      onSuccess={() => {
                        setLoading(true);
                        setTimeout(() => {
                          setDataSource((prev) =>
                            prev.filter((d) => d.id !== record.id)
                          );
                          setLoading(false);
                        }, Math.random() * 1000 + 300);
                      }}
                    />
                    <Button
                      size="small"
                      className="px-0"
                      type="link"
                      icon={<SyncOutlined />}
                      onClick={() => {
                        const duration = Math.random() * 1000 + 300;
                        message.loading({
                          content: '执行中...',
                          duration: duration / 1000,
                        });
                        setTimeout(() => {
                          message.success('表信息抽取完成');
                        }, duration + 300);
                      }}
                    >
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
          rowKey="id"
        />
      </div>
      <Drawer
        open={currentTarget !== null}
        onClose={() => {
          setCurrentTarget(null);
        }}
        title="填写注册信息"
      >
        <Form
          form={form}
          layout="vertical"
          className="flex flex-col justify-between h-full"
          onFinish={(values) => {
            setSubmitting(true);

            setTimeout(() => {
              setDataSource((prev) => {
                if (prev.some((d) => d.id === values.id)) {
                  return prev.map((d) => (d.id === values.id ? values : d));
                }
                return [...prev, values];
              });

              message.success('提交成功');

              setSubmitting(false);
              setCurrentTarget(null);
              setLoading(true);

              setTimeout(() => {
                setLoading(false);
              }, Math.random() * 1000 + 300);
            }, Math.random() * 1000 + 300);
          }}
        >
          <div>
            <FormItem
              name="id"
              label="id"
              required
              rules={[{ required: true }]}
            >
              <Input disabled={Boolean(currentTarget)} />
            </FormItem>
            <FormItem
              name="serverIp"
              label="服务器 IP"
              required
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="serverName"
              label="服务器名称"
              required
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="port"
              label="端口号"
              required
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="type"
              label="数据源类型"
              required
              rules={[{ required: true }]}
            >
              <Input />
            </FormItem>
            <FormItem name="extra" label="其他属性">
              <Input.TextArea placeholder={`A=1\nB=2\n...`} rows={5} />
            </FormItem>
          </div>
          <div className="flex justify-end">
            <Button htmlType="submit" type="primary" loading={submitting}>
              提交
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};
