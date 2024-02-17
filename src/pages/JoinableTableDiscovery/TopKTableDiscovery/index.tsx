import { Button, Form, InputNumber, Modal, Radio, Select, Table } from 'antd';

import data from '../../../data/top-k-result.json';
import details from '../../../data/top-k-column-details.json';
import _ from 'lodash';
import { useState } from 'react';

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
}[] = [];

Object.keys(data).forEach((key) => {
  const [, , type, k] = key.split('|');

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

      return { ...d, type, column_detail: detail?.column_detail, k: Number(k) };
    })
  );
});

export const TopKTableDiscovery = () => {
  const [form] = Form.useForm<FormFields>();

  const [filteredDataSource, setFilteredDataSource] = useState(dataSource);

  const [searching, setSearching] = useState(false);

  return (
    <div>
      <Form<FormFields> form={form}>
        <div className="flex flex-wrap justify-between w-full">
          <div className="flex gap-4">
            <Form.Item name="tableName" label="表名" className="w-52">
              <Select
                showSearch
                placeholder="请选择表名"
                options={_.compact(
                  _.uniq(
                    dataSource.map((d) => ({ label: d.title, value: d.title }))
                  )
                )}
              />
            </Form.Item>
            <Form.Item name="columnName" label="列名" className="w-52">
              <Select
                showSearch
                placeholder="请选择列名"
                options={_.compact(
                  _.uniq(
                    dataSource.map((d) => ({
                      label: d.column,
                      value: d.column,
                    }))
                  )
                )}
              />
            </Form.Item>
            <Form.Item name="resultCount" label="结果集数量">
              <InputNumber />
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
            <Button
              type="primary"
              onClick={() => {
                setSearching(true);

                const value = form.getFieldsValue();

                const newData = dataSource.filter((d) => {
                  if (value.columnName && d.column !== value.columnName) {
                    return false;
                  }

                  if (value.tableName && d.title !== value.tableName) {
                    return false;
                  }

                  if (
                    _.isNumber(value.resultCount) &&
                    d.k !== value.resultCount
                  ) {
                    return false;
                  }

                  if (value.searchMode !== d.type) {
                    return false;
                  }

                  return true;
                });

                setTimeout(() => {
                  setFilteredDataSource(newData);
                  setSearching(false);
                }, Math.random() * 0.8 * 1000 + 200);
              }}
              loading={searching}
            >
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
                <Button
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
              );
            },
          },
        ]}
      />
    </div>
  );
};
