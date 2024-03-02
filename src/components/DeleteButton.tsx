import { DeleteOutlined } from '@ant-design/icons';
import { Button, Popconfirm, message } from 'antd';
import { useState } from 'react';

export const DeleteButton = (props: { onSuccess?: () => void }) => {
  const { onSuccess } = props;

  const [loading, setLoading] = useState(false);

  return (
    <Popconfirm
      title="删除"
      description="确认删除该条数据？"
      onConfirm={() => {
        setLoading(true);
        return new Promise((resolve) => {
          setTimeout(() => {
            message.success('删除成功');
            setLoading(false);
            onSuccess?.();
            resolve(0);
          }, Math.random() * 1000 + 300);
        });
      }}
      okButtonProps={{ loading }}
      okText="确认"
      cancelText="取消"
    >
      <Button
        size="small"
        icon={<DeleteOutlined />}
        className="px-0"
        type="link"
        danger
      >
        删除
      </Button>
    </Popconfirm>
  );
};
