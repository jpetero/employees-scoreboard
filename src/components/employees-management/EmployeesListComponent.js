import React, { Component } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUsers } from '../../redux/users/actions/fetchUsersActions.js';

export class EmployeesListComponent extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  onRowClicked = employee => {
    this.props.history.push(`${this.props.match.url}/${employee.id}`);
  };

  render() {
    // Retrieve the current logged in user department
    const { authenticateUser } = this.props.authenticateUserData;

    const { users, isLoading } = this.props.usersData;
    let departmentEmployees = cloneDeep(users);
    const departmentId = authenticateUser.userInformation.departmentId;

    // This is the admin, he should see all the users
    if (departmentId !== 'fvinu5fek6dwdzfe') {
      departmentEmployees = departmentEmployees.filter(employee => {
        return employee.departmentId === departmentId;
      });
    }

    const employees = departmentEmployees.map(employee => {
      return (
        <React.Fragment key={employee.id}>
          <tr onClick={() => this.onRowClicked(employee)}>
            <th scope="row">
              <Link to={`${this.props.match.url}/${employee.id}`}>
                {employee.username}
              </Link>
            </th>
            <td>{employee.email}</td>
            <td>{employee.phoneNumber}</td>
            <td>{employee.department.title}</td>
            <td>{employee.roles[0] ? employee.roles[0].name : ''}</td>
          </tr>
        </React.Fragment>
      );
    });
    return (
      <div className="my-3">
        <div className="spin-loader"></div>
        <h3 className="mb-2">
          {isLoading ? <div className="spinner-border"></div> : ''} All
          Employees
        </h3>
        <table
          className="table table-striped table-bordered table-hover text-left"
          style={{ width: '100%' }}
          id="employees-table"
          // ref={el => (this.el = el)}
        >
          <thead>
            <tr>
              <th scope="col">User Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Department</th>
              <th scope="col">Position</th>
            </tr>
          </thead>
          <tbody>{employees}</tbody>
        </table>
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      usersData: state.fetchUsersReducer,
      authenticateUserData: state.authenticateUserReducer
    };
  },
  {
    fetchUsers
  }
)(EmployeesListComponent);
