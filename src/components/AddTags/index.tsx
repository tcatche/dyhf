import { Component, cloneElement } from 'react';
import { Modal, Input, Button, message } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { getAllTags, postsAddTags, newTag } from '../../api/tag';
import { TagItem } from '../../types/tag';
import './index.less'
interface IProps {
  postsId: string[];
  initialChecked: string[];
  afterSuccessAdd?(addedTags: TagItem[]): void;
}

interface IState {
  inputValue: string;
  modalVisible: boolean;
  checkedTags: string[];
  allTags: TagItem[];
}

export default class AddTags extends Component<IProps, IState> {
  state: IState = {
    inputValue: '',
    modalVisible: false,
    checkedTags: [],
    allTags: [],
  };

  handleInputChange = (e: any) => {
    this.setState({ inputValue: e.target.value });
  };

  handleShowModal = () => {
    if (this.props.initialChecked.length === 0) {
      message.error('请先选择文章');
      return
    }
    if (this.state.allTags.length === 0) {
      getAllTags().then((allTags) => {
        this.setState({
          modalVisible: true,
          inputValue: '',
          allTags,
          checkedTags: this.props.initialChecked,
        });
      })
    } else {
      this.setState({
        modalVisible: true,
        inputValue: '',
        checkedTags: this.props.initialChecked,
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
    const { checkedTags } = this.state;
    const { initialChecked, postsId, afterSuccessAdd } = this.props;
    const tagIdsAdd = checkedTags.filter(tagId => !initialChecked.includes(tagId));
    if (tagIdsAdd.length > 0) {
      postsAddTags(postsId, tagIdsAdd).then(tagsAdded => {
        message.success('标签设置成功');
        this.setState({
          // tags: [...tags, ...tagsAdded],
          modalVisible: false,
        })
        afterSuccessAdd?.(tagsAdded)
      })
    }
  }

  render() {
    const { checkedTags, allTags, inputValue, modalVisible } = this.state;
    return (
      <>
        {
          cloneElement(this.props.children as any, {
            onClick: this.handleShowModal,
          })
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
                  size="small"
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
                  onPressEnter={this.handleAddNewTag}
                />
                <Button icon={<CheckOutlined />} onClick={this.handleAddNewTag} />
              </Input.Group>
            </div>
          </>
        </Modal>
      </>
    );
  }
}