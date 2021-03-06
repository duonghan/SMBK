/**
 * Author: Duong Han
 * HUST
 * Setting
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import Cookies from 'js-cookie';

import { Form, Input, Switch, Button, Radio, message } from 'antd';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { config } from 'utils/setAuthToken';
import { setCurrentUser } from 'containers/Authentication/actions';
import isEmpty from 'utils/validation/isEmpty';

import styled from 'styled-components';
import messages from './messages';

const FormItem = Form.Item;

const Title = styled.h1`
  display: block;
  text-align: center;
  font-size: 36px;
  font-family: 'Farsan', cursive;
  margin-bottom: 25px;
`;

class SettingForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmDirty: false,
      isChangePass: false,
      current: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.setState({
      current: jwtDecode(Cookies.get('token').replace('%20', ' ')),
    });
  }

  handleSubmit = e => {
    e.preventDefault();

    this.setState({ loading: true });

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const doSetCurrentUser = this.props.setCurrentUser;

        const newProfile = {
          id: this.state.current.id,
          email: values.email,
          name: values.name,
        };

        if (!isEmpty(values.gender)) newProfile.gender = values.gender;

        if (this.state.isChangePass) {
          newProfile.currentPassword = values.currentPassword;
          newProfile.newPassword = values.newPassword;
        }

        // update profile
        axios.put('/api/users/', newProfile, config).then(res => {
          if (res.data.success) {
            Cookies.set('token', res.data.token);
            const userInfo = jwtDecode(res.data.token);
            doSetCurrentUser(userInfo);

            this.props.history.push('/');
            message.success(
              this.props.intl.formatMessage(messages.updateSuccessContent),
            );
          } else {
            message.error(
              this.props.intl.formatMessage(messages[res.data.message]),
            );
          }
        });

        this.props.form.resetFields();
      }
    });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback(this.props.intl.formatMessage(messages.validatePassword2));
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const { form } = this.props;

    if (value && this.state.confirmDirty) {
      form.validateFields(['confirmNewPassword'], { force: true });
    }
    callback();
  };

  toggleChangePassword = checked => {
    this.setState({ isChangePass: checked });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formatMessage } = this.props.intl;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
        md: { span: 8 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <div>
        <Helmet title={formatMessage(messages.header)}>
          <meta name="description" content="Update profile information" />
        </Helmet>

        <Form onSubmit={this.handleSubmit}>
          <Title>
            <FormattedMessage {...messages.title} />
          </Title>

          {this.props.role === 'DEFAULT' && (
            <FormItem {...formItemLayout} label="E-mail">
              {getFieldDecorator('email', {
                rules: [
                  {
                    type: 'email',
                    message: formatMessage(messages.validateEmail),
                  },
                  {
                    required: true,
                    message: formatMessage(messages.requiredEmail),
                  },
                ],

                initialValue: this.state.current.email,
              })(<Input />)}
            </FormItem>
          )}

          <FormItem {...formItemLayout} label={formatMessage(messages.name)}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage(messages.requiredName),
                },
              ],
              initialValue: this.state.current.name,
            })(<Input />)}
          </FormItem>

          {this.props.role === 'DEFAULT' && (
            <FormItem
              {...formItemLayout}
              label={formatMessage(messages.gender)}
            >
              {getFieldDecorator('gender', {
                initialValue: this.state.current.gender,
              })(
                <Radio.Group>
                  <Radio value="male">
                    <FormattedMessage {...messages.maleOpt} />
                  </Radio>

                  <Radio value="female">
                    <FormattedMessage {...messages.femaleOpt} />
                  </Radio>
                </Radio.Group>,
              )}
            </FormItem>
          )}

          <FormItem
            {...formItemLayout}
            label={formatMessage(messages.changePassword)}
          >
            {getFieldDecorator('isChangePass', {
              valuePropName: 'checked',
              initalValue: this.state.isChangePass,
            })(<Switch onChange={this.toggleChangePassword} />)}
          </FormItem>

          <div style={{ display: !this.state.isChangePass && 'none' }}>
            <FormItem
              {...formItemLayout}
              label={formatMessage(messages.currentPassword)}
            >
              {getFieldDecorator('currentPassword', {
                rules: [
                  {
                    required: this.state.isChangePass,
                    message: formatMessage(messages.requiredCurrentPassword),
                  },
                ],
              })(<Input disabled={!this.state.isChangePass} type="password" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={formatMessage(messages.newPassword)}
            >
              {getFieldDecorator('newPassword', {
                rules: [
                  {
                    required: this.state.isChangePass,
                    message: formatMessage(messages.requiredNewPassword),
                  },
                  {
                    min: 6,
                    message: formatMessage(messages.validatePassword),
                  },
                  {
                    validator:
                      this.state.isChangePass && this.validateToNextPassword,
                  },
                ],
              })(<Input disabled={!this.state.isChangePass} type="password" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label={formatMessage(messages.labelPassword2)}
            >
              {getFieldDecorator('confirmNewPassword', {
                rules: [
                  {
                    required: this.state.isChangePass,
                    message: formatMessage(messages.requiredPassword2),
                  },
                  {
                    validator:
                      this.state.isChangePass && this.compareToFirstPassword,
                    message: formatMessage(messages.validatePassword2),
                  },
                ],
              })(
                <Input
                  type="password"
                  disabled={!this.state.isChangePass}
                  onBlur={this.handleConfirmBlur}
                />,
              )}
            </FormItem>
          </div>

          <FormItem {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={this.state.loading}
            >
              <FormattedMessage {...messages.btnSubmit} />
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

SettingForm.propTypes = {
  intl: intlShape.isRequired,
  role: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  role: state.getIn(['auth', 'user', 'role']),
});

const mapDispatchToProps = dispatch => ({
  setCurrentUser: userInfo => dispatch(setCurrentUser(userInfo)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(injectIntl(withRouter(SettingForm))));
