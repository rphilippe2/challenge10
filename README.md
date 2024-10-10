Business Management CLI Application
Description
This command-line application is designed for business owners to manage their company's departments, roles, and employees efficiently. The application offers a variety of options to view, add, and update data related to departments, roles, and employees, using a database to store and retrieve the information.

Features
View all departments, roles, and employees.
Add new departments, roles, and employees.
Update the roles of existing employees.
Installation
Clone the repository:
bash
Copy code
git clone https://github.com/your-repo/business-management-cli.git
Navigate into the project directory:
bash
Copy code
cd business-management-cli
Install the required dependencies:
bash
Copy code
npm install
Ensure you have the correct database setup. (See the Database section below for more details.)
Usage
Start the application by running the command:
bash
Copy code
npm start
You will be presented with the following menu options:
View All Departments
View All Roles
View All Employees
Add Department
Add Role
Add Employee
Update Employee Role
Application Workflow
1. View All Departments
Action: Select "View All Departments" from the menu.
Outcome: A formatted table will display all department names along with their department IDs.
2. View All Roles
Action: Select "View All Roles" from the menu.
Outcome: A formatted table will display job titles, role IDs, the departments associated with each role, and the salary for each role.
3. View All Employees
Action: Select "View All Employees" from the menu.
Outcome: A formatted table will display the following employee data:
Employee ID
First Name
Last Name
Job Title
Department
Salary
Manager they report to
4. Add Department
Action: Select "Add Department" from the menu.
Prompt: Enter the name of the new department.
Outcome: The department is added to the database.
5. Add Role
Action: Select "Add Role" from the menu.
Prompt: Enter the following information:
Role Name
Salary
Department
Outcome: The new role is added to the database.
6. Add Employee
Action: Select "Add Employee" from the menu.
Prompt: Enter the following information:
First Name
Last Name
Role
Manager
Outcome: The new employee is added to the database.
7. Update Employee Role
Action: Select "Update Employee Role" from the menu.
Prompt: Select the employee whose role you want to update and choose their new role.
Outcome: The employee’s role is updated in the database.
Database Setup
Create a MySQL database to store your data.

Use the following schema to set up your tables:

Departments: id, name
Roles: id, title, salary, department_id
Employees: id, first_name, last_name, role_id, manager_id
Modify the connection settings in the application's configuration to match your MySQL database credentials.

Run the SQL schema and seed files provided in the db folder to set up your database.

Technologies Used
Node.js
MySQL
Inquirer.js
Console.table
License
This project is licensed under the MIT License.

