import { useState } from 'react';
import { Popconfirm, Radio, RadioChangeEvent } from 'antd';
import { Link } from 'react-router-dom';
import { EditTwoTone, DeleteTwoTone } from '@ant-design/icons';
import classNames from 'classnames';
import { TagItem } from '../../types/tag'
import './index.less';
import { useEffect } from 'react';

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff'];

interface IProps {
  title: string;
  loading: boolean;
  isShowEdit: boolean;
  className?: string;
  onRemove(id: string): void;
  data: Array<TagItem>
}

enum Sort {
  default = '1',
  size = '2',
  pinyin = '3',
}

const TagsList = ({ title, loading, data: originData, isShowEdit, className, onRemove }: IProps) => {

  const [sort, setSort] = useState<Sort>(Sort.default);
  const [data, setData] = useState<TagItem[]>([]);

  const handleSetSort = (sort = Sort.default) => {
    setSort(sort);
    let data = originData || [];
    if (sort === Sort.size) {
      data = data.sort((item1, item2) => item2.size - item1.size)
    } else if (sort === Sort.pinyin) {
      data = data.sort((item1, item2) => item1.name > item2.name ? 1 : -1)
    }
    setData(data);
  }

  useEffect(() => {
    handleSetSort();
  }, [originData])

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className={classNames("tags-list", className)}>
      <div className="sort">
        <span>列表排序:</span>
        <Radio.Group
          buttonStyle="solid"
          size="middle"
          value={sort}
          onChange={(e: RadioChangeEvent) => handleSetSort(e.target.value)}
        >
          <Radio.Button value={Sort.default}>默认顺序</Radio.Button>
          <Radio.Button value={Sort.size}>文章数量</Radio.Button>
          <Radio.Button value={Sort.pinyin}>拼写顺序</Radio.Button>
        </Radio.Group>
      </div>
      {
        data?.map((item: TagItem, index: number) => {
          const color = COLORS[index % COLORS.length];
          return (
            <div
              key={item._id}
              className="tag-item"
            >
              <Link className="tag-name" to={`/tags/${item.name}`} style={{ borderColor: color, backgroundColor: color}}>
                {item.name}  ({item.size})
              </Link>
              {
                isShowEdit && (
                  <span
                    className="tag-edit tag-change"
                    style={{ borderColor: color, color}}
                  ><EditTwoTone twoToneColor={"#1890ff"} /></span>
                )
              }
              <Popconfirm
                title="是否删除此标签？"
                onConfirm={() => onRemove(item._id)}
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

export default TagsList;