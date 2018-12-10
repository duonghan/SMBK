/**
 * Author: Duong Han
 * HUST
 * QuestionTable
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import axios from 'axios';
import { Table, Skeleton, Icon, Modal } from 'antd';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import config from 'utils/validation/config';
import messages from './messages';
import EditableFormRow from '../../../../../../utils/EditableFormRow';
import EditableCell from '../../../../../../utils/EditableCell';
import columnOptions from './columnOptions';
import AddQuestionForm from './AddQuestionForm';

/* eslint-disable react/prefer-stateless-function */
class QuestionTable extends React.Component {
  state = {
    loading: false,
    data: [],
    visible: false,
    display: 'none',
    editingKey: '',
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.groupId) {
      this.fetchQuestion(nextProps.groupId);
    }
  }

  showModal = () => {
    this.setState({ visible: this.props.groupId });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  fetchQuestion = groupId => {
    this.setState({ loading: true, display: null });

    axios.get(`/api/survey/questions/group/${groupId}`, config).then(res => {
      this.setState({
        data: res.data.map(question => ({
          id: question._id,
          content: question.content,
          orderNumber: question.orderNumber,
        })),
        loading: false,
      });
    });
  };

  isEditing = record => record.orderNumber === this.state.editingKey;

  edit = orderNumber => {
    this.setState({ editingKey: orderNumber });
  };

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  // CRUD question
  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      axios
        .post(
          '/api/survey/questions',
          {
            ...values,
            groupId: this.props.groupId,
          },
          config,
        )
        .then(res => {
          this.fetchQuestion(this.props.groupId);
        });

      form.resetFields();
      this.setState({ visible: false });
    });
  };

  handleDelete = id => {
    axios
      .delete('/api/survey/questions/', {
        ...config,
        data: {
          id,
          group: this.props.groupId,
        },
      })
      .then(res => {
        if (res.data.success) {
          this.fetchQuestion(this.props.groupId);
          Modal.success({
            title: this.props.intl.formatMessage(messages.deleteSuccessTitle),
            content: this.props.intl.formatMessage(
              messages.deleteSuccessContent,
            ),
          });
        }
      });
  };

  handleUpdate = (form, orderNumber) => {
    form.validateFields((error, row) => {
      if (error) {
        Modal.error({
          title: this.props.intl.formatMessage(messages.updateFailedTitle),
          content: this.props.intl.formatMessage(messages.updateFailedContent),
        });
        return;
      }

      // update in UI
      const newData = [...this.state.data];
      const index = newData.findIndex(item => orderNumber === item.orderNumber);

      // update survey name in db
      axios.put(`/api/survey/questions`, newData[index], config).then(res => {
        this.fetchQuestion(this.props.groupId);
        Modal.success({
          title: this.props.intl.formatMessage(messages.updateSuccessTitle),
          content: this.props.intl.formatMessage(messages.updateSuccessContent),
        });
      });
    });
  };

  render() {
    const { formatMessage } = this.props.intl;

    const components = { body: { row: EditableFormRow, cell: EditableCell } };

    const columns = columnOptions(
      formatMessage,
      this.isEditing,
      this.handleUpdate,
      this.cancel,
      this.edit,
      this.handleDelete,
    ).map(col => {
      if (!col.editable) {
        return col;
      }

      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });

    return (
      <Skeleton loading={this.state.loading} active>
        <Table
          bordered
          components={components}
          rowKey={record => record.id}
          dataSource={this.state.data}
          columns={columns}
          title={() => (
            <h3 style={{ color: '#FA541C' }}>
              <strong>{formatMessage(messages.header)}</strong>
              <a onClick={this.showModal} style={{ float: 'right' }}>
                <Icon type="plus" style={{ fontSize: 20, color: '#FA541C' }} />
              </a>
            </h3>
          )}
          size="middle"
          rowClassName="editable-row"
          style={{ display: this.state.display }}
        />

        <AddQuestionForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
          groupName={this.props.groupName}
        />
      </Skeleton>
    );
  }
}

QuestionTable.propTypes = {
  intl: intlShape.isRequired,
  groupId: PropTypes.string,
  groupName: PropTypes.string,
};

const mapStateToProps = state => ({
  groupId: state.getIn(['surveyDetail', 'groupId']),
  groupName: state.getIn(['surveyDetail', 'groupName']),
});

// const mapDispatchToProps = dispatch => ({
//   setCurrentGroup: groupId => dispatch(setCurrentGroup(groupId)),
// });

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(injectIntl(QuestionTable));
