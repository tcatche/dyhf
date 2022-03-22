import { useRequest } from 'ahooks';
import { getAllTags } from '../../api/tag'
import TagsList from '../../components/TagsList'
import './index.less';

const TagsPage = () => {
  const { data, loading } = useRequest(getAllTags);
  return (
    <TagsList
      isShowEdit
      className="tags-page"
      loading={loading}
      title="标签列表"
      onRemove={() => {}}
      data={data || []}
      type="tags"
    />
  );
}

export default TagsPage;