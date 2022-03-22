import { useEffect, useState } from 'react';
import { message, Button, Select } from 'antd';
import { useRequest } from 'ahooks';
import { getAll, remove, merge } from '../../api/keyword'
import TagsList from '../../components/TagsList'
import './index.less';

const KeywordsPage = () => {

  const { data, error, loading, run } = useRequest(getAll, {
    manual: true
  });

  const [select, setSelect] = useState<string[]>([]);

  const handleSelectChange = ((value: string[]) => {
    setSelect(value)
  })

  useEffect(() => {
    run();
  }, [])

  const handleRemove = (id: string) => {
    remove(id).then(() => {
      run();
      setSelect([])
      message.success('删除成功')
    })
  }

  const handleMerge = () => {
    merge(select).then(() => {
      run();
      message.success('合并成功')
    })
  }

  return (
    <div className="keywords-wrapper">

      <TagsList
        isShowEdit={false}
        className="keywords-page"
        loading={loading}
        title="关键字列表"
        onRemove={handleRemove}
        data={data || []}
        type="keywords"
        actions={[{
          label: '合并',
          component: (
            <>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="Please select"
                defaultValue={[]}
                optionFilterProp="label"
                onChange={handleSelectChange}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                filterSort={(optionA: any, optionB: any) =>
                  optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                }
              >
                {
                  data?.map(item => (
                    <Select.Option key={item.name}>{item.name}</Select.Option>
                  ))
                }
              </Select>
              <Button onClick={handleMerge}>合并</Button>
            </>
          )
        }]}
      />
    </div>
  );
}

export default KeywordsPage;