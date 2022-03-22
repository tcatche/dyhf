import { Table, Input, Button, Select } from 'antd';
import { useEffect, useState, ChangeEvent, Key } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { useRequest } from 'ahooks';
import { Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostTags from '../../components/PostTags';
import AddTags from '../../components/AddTags';
import { getPosts } from '../../api/post';
import { isMobile } from '../../utils/is';
import './index.less';

const columns = isMobile() ? [
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (text: string, record: Post) => (
      <div className="mobile-row">
        <div className="main-content">
          <Link to={`/post/${record._id}`}>{record.title} - [{record.date}][{record.size}]</Link>
        </div>
        <div className="sub-content">
          <span><PostTags postId={record._id} initialTags={record.tags}/></span>
        </div>
      </div>
    ),
  },
] :[
  {
    title: '标题',
    dataIndex: 'title',
    key: 'title',
    render: (text: string, record: Post) => <Link to={`/post/${record._id}`}>{text}</Link>,
  },
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '字数',
    dataIndex: 'size',
    key: 'size',
  },
  {
    title: '标签',
    key: 'tags',
    dataIndex: 'tags',
    render: (tags: string[], record: Post) => (
      <PostTags postId={record._id} initialTags={record.tags}/>
    ),
  },
];

const DEFAULT_PAGE_SIZE = parseInt(localStorage.getItem('pageSize') || '30')

const ListPage = () => {
  const { tagName = '', keyword = '' } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    limit: parseInt(searchParams.get('limit') || '0') || DEFAULT_PAGE_SIZE,
    page: parseInt(searchParams.get('page') || '1'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'date,-1',
  })
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')
  const [selectedRow, setSelectedRow] = useState<Key[]>([]);

  const { data, loading, run } = useRequest(getPosts, {
    manual: true,
  });

  useEffect(() => {
    const newQuery = {...query, limit: DEFAULT_PAGE_SIZE, page: 1 };
    setQuery(newQuery)
    let title = '文章列表';
    if (keyword) {
      title = `关键字：${keyword}`
    } else if (tagName) {
      title = `标签：${tagName}`
    }
    document.title = title;
  }, [tagName, keyword])

  useEffect(() => {
    const { limit, page, ...otherQuery } = query;
    setSearchParams({ ...otherQuery, limit: limit.toString(), page: page.toString() })
    if (!loading) {
      run({ tagName, keyword, ...query });
    }
  }, [query])

  const handlePanginationChange = (page: number, limit: number) => {
    setQuery({ ...query, limit, page });
  }

  const handleSortChange = (sort: string) => {
    setQuery({ ...query, sort });
  }

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value)
  }

  const handleSearch = (search: string) => {
    setQuery({ ...query, search, page: 1 });
    setSearchParams({ search, page: '1' })
    document.title = `搜索: ${search}`;
  }

  const handleRefreshList = () => {
    run({ tagName, keyword, ...query });
  }

  return (
    <div className="list">
      <div className="action">
        {
          (tagName || keyword) && (
            <div className="tag-name">{ tagName ? `标签：${tagName}` : `关键字：${keyword}`}</div>
          )
        }
        <Button type="primary" className='add-tags' onClick={handleRefreshList}>刷新</Button>
        <AddTags
          initialChecked={[]}
          postsId={selectedRow as string[]}>
          <Button type="primary" className='add-tags'>设置标签</Button>
        </AddTags>
        <Select
          className="posts-sort"
          defaultValue={query.sort}
          onChange={handleSortChange}
        >
            <Select.Option value="date,-1">date倒序</Select.Option>
            <Select.Option value="date,1">date正序</Select.Option>
            <Select.Option value="size,-1">size倒序</Select.Option>
            <Select.Option value="size,1">size正序</Select.Option>
          </Select>
        <Input.Search
          className="list-search"
          placeholder="搜索"
          onSearch={handleSearch}
          onChange={handleSearchChange}
          enterButton
          allowClear
          value={searchValue} />
      </div>
      <Table
        rowKey="_id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data?.data || [] as Post[]}
        rowSelection={{
          selectedRowKeys: selectedRow,
          onChange: setSelectedRow,
        }}
        pagination={{
          pageSizeOptions: [10, 30, 50, 80, 100],
          position: ['topRight', 'bottomRight'],
          showTotal: (total: number) => `共 ${total}`,
          defaultPageSize: DEFAULT_PAGE_SIZE,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: handlePanginationChange,
          onChange: handlePanginationChange,
          defaultCurrent: 1,
          total: data?.count,
          pageSize: query.limit,
          current: query.page,
      }}/>
    </div>
  );
}

export default ListPage;