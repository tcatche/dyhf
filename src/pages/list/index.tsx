import { Table, Input, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from "react-router-dom";
import { useRequest } from 'ahooks';
import { Link } from 'react-router-dom';
import { Post } from '../../types/post';
import PostTags from '../../components/PostTags';
import { getPosts } from '../../api/post';
import './index.less';

const columns = [
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

const ListPage = () => {
  const { tagName = '' } = useParams();
  let [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    limit: parseInt(searchParams.get('limit') || '10'),
    page: parseInt(searchParams.get('page') || '1'),
    search: searchParams.get('search') || ''
  })

  const { data, loading, run } = useRequest(getPosts, {
    manual: true,
  });

  useEffect(() => {
    console.log({ tagName, ...query })
    run({ tagName, ...query });
  }, [query, tagName])

  const handleChangeQuery = (page: number, limit: number) => {
    setQuery({ ...query, limit, page });
    setSearchParams({ ...query, limit: limit.toString(), page: page.toString() })
  }

  const handleSearch = (search: string) =>{
    setQuery({ ...query, search, page: 1 });
    setSearchParams({ search, page: '1' })
  }

  return (
    <div className="list">
      {
        tagName ? (
          <div className="tag-name">标签：{tagName}</div>
        ) : (
          <Input.Search
            className="list-search"
            placeholder="搜索"
            onSearch={handleSearch}
            enterButton
            allowClear
            value={query.search} />
        )
      }
      <Table
        rowKey="_id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={data?.data || [] as Post[]}
        pagination={{
          position: ['topRight', 'bottomRight'],
          showTotal: (total: number) => `共 ${total}`,
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          onShowSizeChange: handleChangeQuery,
          onChange: handleChangeQuery,
          defaultCurrent: 1,
          total: data?.count,
          pageSize: query.limit,
          current: query.page,
      }}/>
    </div>
  );
}

export default ListPage;