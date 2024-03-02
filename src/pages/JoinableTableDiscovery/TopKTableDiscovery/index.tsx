import { Button, Form, InputNumber, Modal, Radio, Select, Table } from 'antd';

import data from '../../../data/top-k-result.json';
import details from '../../../data/top-k-column-details.json';
import tables from '../../../data/tables.json';
import _ from 'lodash';
import { useState } from 'react';
import { DownloadOutlined, MenuOutlined } from '@ant-design/icons';

interface FormFields {
  tableName?: string;
  columnName?: string;
  resultCount?: number;
  searchMode?: string;
}

const dataSource: {
  title?: string;
  column?: string;
  path?: string;
  column_detail?: string;
  type?: string;
  k?: number;
  searchTitle?: string;
  searchColumn?: string;
}[] = [];

Object.keys(data).forEach((key) => {
  const [searchTitle, searchColumn, type, k] = key.split('|');

  dataSource.push(
    ...(
      data as Record<
        string,
        { title?: string; column?: string; path?: string }[]
      >
    )[key].map((d) => {
      const detail = details.find(
        (dt) => dt.title === d.title && dt.column === d.column
      );

      return {
        ...d,
        type,
        column_detail: detail?.column_detail,
        k: Number(k),
        searchTitle,
        searchColumn,
      };
    })
  );
});

export const TopKTableDiscovery = () => {
  const [form] = Form.useForm<FormFields>();

  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  const [searching, setSearching] = useState(false);

  return (
    <div>
      <Form<FormFields>
        form={form}
        onFinish={(values) => {
          setSearching(true);

          const newData = dataSource.filter((d) => {
            if (values.columnName && d.searchColumn !== values.columnName) {
              return false;
            }

            if (values.tableName && d.searchTitle !== values.tableName) {
              return false;
            }

            if (_.isNumber(values.resultCount) && d.k !== values.resultCount) {
              return false;
            }

            if (values.searchMode !== d.type) {
              return false;
            }

            return true;
          });

          setTimeout(() => {
            setFilteredDataSource(newData);
            setSearching(false);
          }, Math.random() * 0.8 * 1000 + 200);
        }}
        onValuesChange={(changedValue) => {
          if ('tableName' in changedValue) {
            form.resetFields(['columnName']);
          }
        }}
      >
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex gap-4">
            <Form.Item
              name="tableName"
              label="表名"
              className="w-52"
              rules={[{ required: true, message: '请选择表名' }]}
            >
              <Select
                showSearch
                placeholder="请选择表名"
                options={_.compact(
                  _.uniq(
                    tables.map((t) => ({ label: t.title, value: t.title }))
                  )
                )}
              />
            </Form.Item>
            <Form.Item dependencies={['tableName']}>
              {({ getFieldValue }) => {
                const tableName = getFieldValue('tableName');
                const { columns = [] } =
                  tables.find((t) => t.title === tableName) || {};

                return (
                  <Form.Item
                    name="columnName"
                    label="列名"
                    className="w-52"
                    rules={[{ required: true, message: '请选择列名' }]}
                  >
                    <Select
                      showSearch
                      placeholder="请选择列名"
                      disabled={!tableName}
                      options={_.compact(
                        _.uniq(
                          columns.map((c) => ({
                            label: c,
                            value: c,
                          }))
                        )
                      )}
                    />
                  </Form.Item>
                );
              }}
            </Form.Item>
            <Form.Item
              name="resultCount"
              label="结果集数量"
              rules={[{ required: true, message: '请输入结果集数量' }]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </div>
          <div className="flex gap-4">
            <Form.Item name="searchMode" initialValue={'equi'}>
              <Radio.Group>
                <Radio.Button value={'equi'}>等值搜索</Radio.Button>
                <Radio.Button value={'semantic'}>语义搜索</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Button
              onClick={() => {
                form.resetFields();
              }}
            >
              重置
            </Button>
            <Button type="primary" htmlType="submit" loading={searching}>
              搜索
            </Button>
          </div>
        </div>
      </Form>
      <Table
        loading={searching}
        bordered
        pagination={{ pageSize: 5, showSizeChanger: true }}
        size="middle"
        dataSource={filteredDataSource}
        rowKey={(record) => `${record.title}${record.column}`}
        columns={[
          {
            title: '表名',
            dataIndex: 'title',
          },
          {
            title: '列名',
            dataIndex: 'column',
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
                <div className="flex gap-4">
                  <Button
                    size="small"
                    icon={<MenuOutlined />}
                    className="px-0"
                    type="link"
                    disabled={!record.column_detail}
                    onClick={() => {
                      Modal.info({
                        title: `${record.column} 详情`,
                        icon: null,
                        content: record.column_detail,
                        width: 800,
                      });
                    }}
                  >
                    查看详情
                  </Button>
                  <Button
                    size="small"
                    icon={<DownloadOutlined />}
                    className="px-0"
                    type="link"
                    disabled={!record.column_detail}
                    onClick={() => {}}
                  >
                    下载
                  </Button>
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
};
