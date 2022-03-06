import { useParams } from "react-router-dom";
import { Empty, Typography, PageHeader, Button, Descriptions, Skeleton, message } from 'antd';
import { useRequest } from 'ahooks';
import PostTags from '../../components/PostTags'
import { getPost, deletePost } from '../../api/post'
import './index.less'

const { Paragraph } = Typography;

const PostPage = () => {
  const { id } = useParams();
  const { data, error, loading } = useRequest(getPost, { defaultParams: [id] });
  console.log(data)
  document.title = data?.title || '404'

  const handleDelete = () => {
    if (id) {
      deletePost(id).then(() => message.success('删除成功'))
    }
  }
  return (
    data ? (
      <div className="post">
        <PageHeader
          className="site-page-header"
          title={data?.title}
          extra={[
            <Button key="3">收藏</Button>,
            <Button key="2" onClick={handleDelete}>删除</Button>,
          ]}
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="日期">{data.date}</Descriptions.Item>
            <Descriptions.Item label="字数">{data.size}</Descriptions.Item>
            <Descriptions.Item label="日期">{data.size}</Descriptions.Item>
            <Descriptions.Item label="原始链接">{data.url}</Descriptions.Item>
            <Descriptions.Item label="作者">{data.author}</Descriptions.Item>
            <Descriptions.Item label="标签">
              <PostTags
                initialTags={data.tags || []}
                postId={data._id}
                editable={true}
                closable={true}
              />
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <Skeleton loading={loading}>
          <Paragraph className="post-content">
            {data.content ? data.content.replace(/\r\n\r\n/g, '\n\n').replace(/\r\n/g, '') : '-'}
          </Paragraph>
        </Skeleton>
      </div>
    ) : <Empty />
  );
}

export default PostPage;