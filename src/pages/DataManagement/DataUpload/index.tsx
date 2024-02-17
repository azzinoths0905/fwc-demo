import { InboxOutlined } from '@ant-design/icons';
import { Button, Form, Upload, UploadFile, message } from 'antd';
import { MOCK_UPLOAD_ACTION } from '../../../const';
import { UploadChangeParam } from 'antd/es/upload';
import { useState } from 'react';
import _ from 'lodash';

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
    <Form form={form}>
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
          accept=".csv"
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
            我们接受以下分隔符：逗号、分号和制表符。最大支持 20 MB
          </p>
        </Upload.Dragger>
      </Form.Item>
      <div className="flex flex-row-reverse mt-4">
        <Button
          type="primary"
          htmlType="submit"
          onClick={() => {
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              form.resetFields();
              message.success('提交成功');
            }, Math.random() * 0.8 * 1000 + 200);
          }}
          loading={submitting}
          disabled={!fileList || !_.isArray(fileList) || !fileList.length}
        >
          提交
        </Button>
      </div>
    </Form>
  );
};
