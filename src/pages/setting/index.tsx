import { ChangeEvent, useState, useEffect } from 'react';
import { Input, PageHeader, Button, Descriptions } from 'antd';
import { useSearchParams } from "react-router-dom";

const { TextArea } = Input;

interface IState {
  api: string;
  secret: string;
}

const INIT_STATE = {
  api: localStorage.getItem('api') || '',
  secret: localStorage.getItem('secret') || '',
}
const SettingPage = () => {
  const [state, setState] = useState<IState>(INIT_STATE);
  const [searchParams] = useSearchParams();

  const handleChangeState = (key: string, val: string) => {
    setState({ ...state, [key]: val });
  }

  const handleSave = () => {
    Object.keys(state).forEach((key) => {
      localStorage.setItem(key, state[key as keyof IState]);
    });
  }

  useEffect(() => {
    Object.keys(state).forEach((key) => {
      const value = searchParams.get(key);
      if (value) {
        localStorage.setItem(key, value || '');
        setState({ ...state, [key]: value })
      }
    });
  }, [])

  return (
    <div className="site-page-header-ghost-wrapper">
    <PageHeader
      ghost={false}
      onBack={() => window.history.back()}
      title="系统设置"
      extra={[
        <Button key="1" type="primary" onClick={handleSave}>
          保存
        </Button>,
      ]}
    >
      <Descriptions size="small" column={1}>
        <Descriptions.Item label="接口地址">
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeState('api', e.target.value)}
            value={state.api}
          />
        </Descriptions.Item>
        <Descriptions.Item label="解密密码">
          <Input
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChangeState('secret', e.target.value)}
            value={state.secret}
          />
        </Descriptions.Item>
        <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
        <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
        <Descriptions.Item label="Remarks">
          Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
      </Descriptions>
    </PageHeader>
  </div>
  )
}

export default SettingPage;