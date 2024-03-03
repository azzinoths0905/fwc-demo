import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, UploadFile, message } from 'antd';
import { MOCK_UPLOAD_ACTION } from '../../../const';
import { UploadChangeParam } from 'antd/es/upload';
import { useState } from 'react';
import _ from 'lodash';
import {
  getDataSourceList,
  setDataSourceList,
} from '../../../store/dataSourceManagement';

const normFile = (e: UploadChangeParam<UploadFile<any>>): UploadFile[] => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const DataUpload = () => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  const fileList = Form.useWatch('fileList', form);

  return (
    <Form
      form={form}
      onFinish={async (values) => {
        setSubmitting(true);
        const fileNames: string[] = _.compact(
          values?.fileList?.map((f: any) => f?.name)
        );

        const draft = await getDataSourceList();
        fileNames.forEach((name) => {
          draft.push({
            id: `${_.round(Math.random() * 1000)}${Date.now()}`,
            serverIp: '127.0.0.1',
            serverName: 'LOCAL',
            port: '3000',
            type: _.last(name.split('.')),
            extra: `name=${name}`,
          });
        });
        await setDataSourceList(draft);

        form.resetFields();
        message.success('提交成功');
        setSubmitting(false);
      }}
    >
      <Form.Item
        noStyle
        valuePropName="fileList"
        name="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true }]}
      >
        <Upload.Dragger
          name="file"
          multiple
          action={MOCK_UPLOAD_ACTION}
          accept=".csv, .json, .parquet, .xml"
          className="h-80"
          beforeUpload={(file) => {
            if (file.size > 20000) {
              message.error('最大支持 20 MB');
              return false;
            }
          }}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">将文件拖到本区域或点击上传</p>
          <p className="ant-upload-hint">
            我们接受以下格式：CSV, JSON, Parquet, XML。最大支持 20 MB
          </p>
        </Upload.Dragger>
      </Form.Item>
      <div className="flex flex-row-reverse mt-4">
        <Button
          type="primary"
          htmlType="submit"
          loading={submitting}
          disabled={!fileList || !_.isArray(fileList) || !fileList.length}
        >
          提交
        </Button>
      </div>
    </Form>
  );
};
