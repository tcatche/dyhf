import { useEffect, useState, ChangeEvent } from 'react';
import { Descriptions, PageHeader, Popconfirm, Radio, RadioChangeEvent, Input } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import classNames from 'classnames';
import { TagItem } from '../../types/tag'
import './index.less';

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff', '#A19FEE', '#89BAF6', '#83D97C', '#F9B87C', '#8BDBC9', '#FEBC3C', '#25C0BF', '#EF625E', '#F0615F', '#EC6AB9', '#28BFBF', '#FF894D', '#1AC185', '#BD75C8', '#FCBD3E'];

type IDateItem = TagItem & { hidden?: boolean }
interface IProps {
  title: string;
  loading: boolean;
  isShowEdit: boolean;
  className?: string;
  onRemove(id: string): void;
  data: Array<IDateItem>;
  type: 'keywords' | 'tags';
  actions?: any[];
}

enum Sort {
  default = '1',
  size = '2',
  pinyin = '3',
}

const TagsList = ({ title, loading, data: originData, isShowEdit, className, type, onRemove, actions }: IProps) => {

  const [sort, setSort] = useState<Sort>((localStorage.getItem('tagsSort') as Sort) || Sort.default);
  const [data, setData] = useState<IDateItem[]>([]);

  const handleSetSort = (sort = Sort.default) => {
    setSort(sort);
    localStorage.setItem('tagsSort', sort);
    let data = originData || [];
    if (sort === Sort.size) {
      data = data.sort((item1, item2) => item2.size - item1.size)
    } else if (sort === Sort.pinyin) {
      // data = data.sort((item1, item2) => item1.name.localeCompare(item2.name, 'zh-Hans-CN', {sensitivity: 'accent'}))
      data = data.sort((item1, item2) => item1.name.localeCompare(item2.name))
    }
    setData(data);
  }

  const handleDoFilter = (value: string) => {
    const filters = value.split(' ');
    const newData = data.map(item => ({
      ...item,
      hidden: !filters.some(filterName => item.name.indexOf(filterName) >= 0)
    }));
    setData(newData);
  }

  useEffect(() => {
    handleSetSort(sort);
  }, [originData])

  useEffect(() => {
    document.title = title;
  }, [title]);

  return (
    <div className={classNames("tags-page", className)}>
      <PageHeader
        className="site-page-header"
        title={title}
      >
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="排序">
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
          </Descriptions.Item>
          <Descriptions.Item label="筛选">
            <Input.Search
              className="list-search"
              placeholder="筛选"
              onSearch={handleDoFilter}
              enterButton
              allowClear />
            </Descriptions.Item>
          <Descriptions.Item label="数量">{data?.filter(item => !item.hidden).length}</Descriptions.Item>
          {
            actions && (
              actions.map(action => (
                <Descriptions.Item key={action.label} label={action.label}>{action.component}</Descriptions.Item>
              ))
            )
          }
        </Descriptions>
      </PageHeader>
      <div className="tags-list">
      {
        data?.filter(item => !item.hidden).map((item: TagItem) => {
          const color = COLORS[Math.floor(Math.random() * COLORS.length)];
          return (
            <div
              key={item._id}
              className="tag-item"
            >
              <Link className="tag-name" to={`/${type}/${item.name}`} style={{ borderColor: color, backgroundColor: color}}>
                {item.name}
                <span className="tag-count">[{item.size}]</span>
              </Link>
              {
                isShowEdit && (
                  <span
                    className="tag-edit tag-change"
                    // style={{ borderColor: color, color}}
                    style={{ borderColor: color, backgroundColor: color}}
                  ><EditOutlined /></span>
                )
              }
              <Popconfirm
                title="是否删除此标签？"
                onConfirm={() => onRemove(item._id)}
              >
                <span
                  className="tag-edit tag-delete"
                  // style={{ borderColor: '#d00', color}}
                  style={{ borderColor: color, backgroundColor: color }}
                ><DeleteOutlined /></span>
              </Popconfirm>
            </div>
          )
        })
      }
      </div>
    </div>
  );
}

export default TagsList;