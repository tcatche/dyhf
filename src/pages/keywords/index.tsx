import { useEffect } from 'react';
import { message, Popconfirm, Skeleton, Space } from 'antd';
import { useRequest } from 'ahooks';
import { Link } from 'react-router-dom';
import { DeleteTwoTone } from '@ant-design/icons'
import { Keyword } from '../../types/keyword'
import { getAll, remove } from '../../api/keyword'
import './index.less';

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff']

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
    <div className="keywords-page">
      <Skeleton loading={loading} active>
      {
        data?.map((item: Keyword, index: number) => {
          const color = COLORS[index % COLORS.length];
          return (
            <div
              key={item._id}
              className="tag-item"
            >
              <Link className="tag-name" to={`/keywords/${item.name}`} style={{ borderColor: color, backgroundColor: color}}>
                {item.name}  ({item.posts.length})
              </Link>
              <Popconfirm
                title="是否删除此标签？"
                onConfirm={() => handleRemove(item._id)}
              >
                <span className="tag-edit tag-delete" style={{ borderColor: '#d00', color}}><DeleteTwoTone twoToneColor="#d00" /></span>
              </Popconfirm>
            </div>
          )
        })
      }
      </Skeleton>
    </div>
  );
}

export default KeywordsPage;