import { Component } from 'react';
import { Modal, Tag, Input, Tooltip, Button, message } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom'
import { getAllTags, postAddTag, newTag, postAddTags, changeName, removeTag } from '../../api/tag';
import { TagItem } from '../../types/tag';
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
  modalVisible: boolean;
  checkedTags: string[];
  tags: TagItem[];
  allTags: TagItem[];
}

const COLORS = ['#108ee9', '#2db7f5', '#87d068', '#87e8de', '#ffd591', '#ffadd2', '#d46b08', '#ffe58f', '#adc6ff']
export default class PostTags extends Component<IProps, IState> {
  state: IState = {
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
    modalVisible: false,
    checkedTags: [],
    tags: this.props.initialTags,
    allTags: [],
  };

  private editInput: any;

  handleClose = (removedTag: TagItem) => {
    removeTag({ postId: this.props.postId, tagId: removedTag._id }).then(() => {
      const tags = this.state.tags.filter(tag => tag.name !== removedTag.name);
      this.setState({ tags });
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

  getTagColor = (index: number) => {
    return COLORS[index % COLORS.length];
  }

  handleShowModal = () => {
    if (this.state.allTags.length === 0) {
      getAllTags().then((allTags) => {
        this.setState({
          modalVisible: true,
          inputValue: '',
          allTags,
          checkedTags: this.state.tags.map(item => item._id)
        });
      })
    } else {
      this.setState({
        modalVisible: true,
        inputValue: '',
        checkedTags: this.state.tags.map(item => item._id)
      });
    }
  };

  handleAddNewTag = () => {
    const { inputValue, allTags, checkedTags } = this.state;
    if (inputValue) {
      const isExist = allTags.find(item => item.name === inputValue);
      if (isExist) {
        message.error('标签已存在');
      } else {
        newTag(inputValue).then((tag: TagItem) => {
          message.success('标签已成功创建');
          this.setState({
            allTags: [...allTags, tag],
            checkedTags: [...checkedTags, tag._id],
            inputValue: '',
          })
        });
      }
    } else {
      message.error('标签不能为空');
    }
  }

  handleCloseModal = () => {
    this.setState({ modalVisible: false, inputValue: '' })
  }

  handleChangeTagState = (tag: TagItem) => {
    const checkedTags = this.state.checkedTags.slice();
    const index = checkedTags.indexOf(tag._id);
    if (index >= 0) {
      const index = checkedTags.findIndex(item => item === tag._id);
      checkedTags.splice(index, 1);
    } else {
      checkedTags.push(tag._id);
    }
    this.setState({ checkedTags })
  }

  handleChangeTags = () => {
    const { tags, checkedTags } = this.state;
    const tagIdsAdd = checkedTags.filter(tagId => !tags.find(tag => tag._id === tagId));
    if (tagIdsAdd.length > 0) {
      postAddTags(this.props.postId, tagIdsAdd).then(tagsAdded => {
        this.setState({
          tags: [...tags, ...tagsAdded],
          modalVisible: false,
        })
      })
    }
  }

  render() {
    const { tags = [], checkedTags, allTags, inputValue, editInputIndex, editInputValue, modalVisible } = this.state;
    const { closable, editable } = this.props;
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
          const color = this.getTagColor(index);

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
                <Link to={`/tags/${tag.name}`}>{isLongTag ? `${tag.name.slice(0, 20)}...` : tag.name}</Link>
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
            <Tag className="tags-editer" onClick={this.handleShowModal}>
              <EditOutlined /> 编辑
            </Tag>
          )
        }
        <Modal
          className="change-tags-modal"
          title="编辑标签"
          visible={modalVisible}
          onOk={this.handleChangeTags}
          onCancel={this.handleCloseModal}
        >
          <>
            <div className="label buttons">
              <span>更改标签:</span>
              {allTags.map(tag => (
                <Button
                  key={tag._id}
                  type={checkedTags.indexOf(tag._id) > -1 ? 'primary' : 'dashed'}
                  onClick={() => this.handleChangeTagState(tag)}
                >
                  {tag.name}
                </Button>
              ))}
            </div>
            <div className="label">
              <span>创建标签:</span>
              <Input.Group compact>
                <Input
                  type="text"
                  className="tag-input"
                  value={inputValue}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleInputConfirm}
                />
                <Button icon={<CheckOutlined />} onClick={this.handleAddNewTag} />
              </Input.Group>
            </div>
          </>
        </Modal>
      </div>
    );
  }
}