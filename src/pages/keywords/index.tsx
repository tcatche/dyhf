import { useEffect } from 'react';
import { message } from 'antd';
import { useRequest } from 'ahooks';
import { getAll, remove } from '../../api/keyword'
import TagsList from '../../components/TagsList'
import './index.less';

const KeywordsPage = () => {

  const { data, error, loading, run } = useRequest(getAll, {
    manual: true
  });

  useEffect(() => {
    run();
  }, [])

  const handleRemove = (id: string) => {
    remove(id).then(() => {
      run();
      message.success('删除成功')
    })
  }

  return (
    <TagsList
      isShowEdit
      className="keywords-page"
      loading={loading}
      title="关键字列表"
      onRemove={handleRemove}
      data={data || []}
      type="keywords"
    />
  );
}

export default KeywordsPage;