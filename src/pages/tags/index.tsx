import { Table, Popconfirm } from 'antd';
import { useRequest } from 'ahooks';
import { Link } from 'react-router-dom';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { Tag } from '../../types/tag'
import { getAllTags } from '../../api/tag'
import './index.less';

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff']

const ListPage = () => {
  document.title = '标签列表';

  const { data, error, loading } = useRequest(getAllTags);
  return (
    <div className="tags-page">
      {
        data?.map((item: Tag, index: number) => {
          const color = COLORS[index % COLORS.length];
          return (
            <div
              key={item._id}
              className="tag-item"
            >
              <Link className="tag-name" to={`/tags/${item.name}`} style={{ borderColor: color, backgroundColor: color}}>
                {item.name}  ({item.size})
              </Link>
              <span className="tag-edit tag-change" style={{ borderColor: color, color}}><EditTwoTone twoToneColor={"#1890ff"} /></span>
              <Popconfirm
                title="是否删除此标签？"
                onConfirm={() => console.log('confirm')}
              >
                <span className="tag-edit tag-delete" style={{ borderColor: '#d00', color}}><DeleteTwoTone twoToneColor="#d00" /></span>
              </Popconfirm>
            </div>
          )
        })
      }
    </div>
  );
}

export default ListPage;