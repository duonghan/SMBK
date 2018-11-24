/*
* Author: Duong Han
* HUST
* SurveyPage Messages
*
* This contains all the text for the SurveyPage component.
*/

import { defineMessages } from 'react-intl';

export const scope = 'app.components.SurveyPage';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the SurveyPage component!',
  },
  clearFiltersBtn: {
    id: `${scope}.clearFiltersBtn`,
    defaultMessage: 'Xóa bộ lọc',
  },
  clearFiltersSortedBtn: {
    id: `${scope}.clearFiltersSortedBtn`,
    defaultMessage: 'Xóa bộ lọc và sắp xếp',
  },
  searchInput: {
    id: `${scope}.searchInput`,
    defaultMessage: 'Tìm kiếm',
  },
  nameTitle: {
    id: `${scope}.nameTitle`,
    defaultMessage: 'Câu hỏi',
  },
  answerTitle: {
    id: `${scope}.answerTitle`,
    defaultMessage: 'Nhóm câu trả lời',
  },
  dateTitle: {
    id: `${scope}.dateTitle`,
    defaultMessage: 'Ngày tham gia',
  },
  addNewItem: {
    id: `${scope}.addNewItem`,
    defaultMessage: 'Thêm mới',
  },
  actionTitle: {
    id: `${scope}.actionTitle`,
    defaultMessage: 'Hành động',
  },
  editToolTip: {
    id: `${scope}.editToolTip`,
    defaultMessage: 'Sửa',
  },
  deleteToolTip: {
    id: `${scope}.deleteToolTip`,
    defaultMessage: 'Xóa',
  },
  selectedTextFirst: {
    id: `${scope}.selectedTextFirst`,
    defaultMessage: 'Đã chọn',
  },
  selectedTextLast: {
    id: `${scope}.selectedTextLast`,
    defaultMessage: 'tài khoản',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Hủy',
  },
  save: {
    id: `${scope}.save`,
    defaultMessage: 'Lưu',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Chi tiết',
  },
  reset: {
    id: `${scope}.reset`,
    defaultMessage: 'Khôi phục mặc định',
  },
  rulesMsg: {
    id: `${scope}.rulesMsg`,
    defaultMessage: 'Làm ơn nhập',
  },
  cancelPromtMsg: {
    id: `${scope}.cancelPromtMsg`,
    defaultMessage: 'Bạn chắc chắn muốn hủy?',
  },
  deletePromtMsg: {
    id: `${scope}.deletePromtMsg`,
    defaultMessage: 'Bạn chắc chắn muốn xóa?',
  },
});
