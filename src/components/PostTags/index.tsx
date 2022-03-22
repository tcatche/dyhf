import { Component } from 'react';
import { Tag, Input, Tooltip, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import { postAddTag, changeName, removeTag } from '../../api/tag';
import { TagItem } from '../../types/tag';
import AddTags from '../AddTags';
import './index.less'
interface IProps {
  postId: string;
  initialTags: TagItem[];
  closable?: boolean;
  editable?: boolean;
}

interface IState {
  inputValue: string;
  editInputIndex: number;
  editInputValue: string;
  checkedTags: string[];
  tags: TagItem[];
}

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff', '#A19FEE', '#89BAF6', '#83D97C', '#F9B87C', '#8BDBC9', '#FEBC3C', '#25C0BF', '#EF625E', '#F0615F', '#EC6AB9', '#28BFBF', '#FF894D', '#1AC185', '#BD75C8', '#FCBD3E']
export default class PostTags extends Component<IProps, IState> {
  state: IState = {
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
    checkedTags: this.props.initialTags.map(item => item._id),
    tags: this.props.initialTags,
  };

  private editInput: any;

  handleClose = (removedTag: TagItem) => {
    removeTag({ postId: this.props.postId, tagId: removedTag._id }).then(() => {
      const tags = this.state.tags.filter(tag => tag.name !== removedTag.name);
      this.setState({
        tags,
        checkedTags: tags.map(item => item._id),
      });
    })
  };

  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    let { tags } = this.state;
    if (inputValue && !tags.find(item => item.name === inputValue)) {
      postAddTag(this.props.postId, inputValue).then((tag: TagItem) => {
        tags = [...tags, tag];
        this.setState({
          tags,
          inputValue: '',
        });
      })
    }
  };

  handleEditInputChange = (e: any) => {
    this.setState({ editInputValue: e.target.value });
  };

  handleEditInputConfirm = () => {
    changeName(this.props.postId, this.state.editInputValue).then(() => {
      this.setState(({ tags, editInputIndex, editInputValue }) => {
        const newTags = [...tags];
        newTags[editInputIndex].name = editInputValue;

        return {
          tags: newTags,
          editInputIndex: -1,
          editInputValue: '',
        };
      });
    })
  };

  saveEditInputRef = (input: any) => {
    this.editInput = input;
  };

  getTagColor = () => {
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }

  render() {
    const { tags = [], checkedTags, editInputIndex, editInputValue } = this.state;
    const { closable, editable, postId } = this.props;
    return (
      <div className="post-tags">
        {tags.map((tag, index) => {
          if (editInputIndex === index) {
            return (
              <Input
                ref={this.saveEditInputRef}
                key={tag._id}
                size="small"
                className="tag-input"
                value={editInputValue}
                onChange={this.handleEditInputChange}
                onBlur={this.handleEditInputConfirm}
                onPressEnter={this.handleEditInputConfirm}
              />
            );
          }

          const isLongTag = tag.name.length > 20;
          const color = this.getTagColor();

          const tagElem = (
            <Tag
              className="edit-tag"
              key={tag._id}
              closable={closable}
              onClose={() => this.handleClose(tag)}
              color={color}
            >
              <span
                onDoubleClick={e => {
                  if (index !== 0) {
                    this.setState({ editInputIndex: index, editInputValue: tag.name }, () => {
                      this.editInput.focus();
                    });
                    e.preventDefault();
                  }
                }}
              >
                <Link to={`/tags/${tag.name}`}>{isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}[{tag.size}]</Link>
              </span>
            </Tag>
          );
          return isLongTag ? (
            <Tooltip title={tag} key={tag._id}>
              {tagElem}
            </Tooltip>
          ) : (
            tagElem
          );
        })}
        {
          editable && (
            <AddTags
              postsId={[postId]}
              initialChecked={checkedTags}
            >
              <Tag className="tags-editer">
                <EditOutlined /> 编辑
              </Tag>
            </AddTags>
          )
        }
      </div>
    );
  }
}