// import React from 'react';
// import { ExcelFile, ExcelSheet } from 'react-data-export';
//
// const multiDataSet = [
//   {
//     columns: ['Name', 'Salary', 'Sex'],
//     data: [
//       ['Johnson', 30000, 'Male'],
//       ['Monika', 355000, 'Female'],
//       ['Konstantina', 20000, 'Female'],
//       ['John', 250000, 'Male'],
//       ['Josef', 450500, 'Male'],
//     ],
//   },
//   {
//     xSteps: 1, // Will start putting cell with 1 empty cell on left most
//     ySteps: 5, // will put space of 5 rows,
//     columns: ['Name', 'Department'],
//     data: [
//       ['Johnson', 'Finance'],
//       ['Monika', 'IT'],
//       ['Konstantina', 'IT Billing'],
//       ['John', 'HR'],
//       ['Josef', 'Testing'],
//     ],
//   },
// ];
//
// /* eslint-disable react/prefer-stateless-function */
// class ExcelData extends React.Component {
//   render() {
//     return (
//       <ExcelFile element={this.props.elements}>
//         <ExcelSheet dataSet={multiDataSet} name="Organization" />
//       </ExcelFile>
//     );
//   }
// }
//
// export default ExcelData;
