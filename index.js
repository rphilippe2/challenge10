const inquirer = require("inquirer");
const db = require("./db");
require("console.table");


const prompt = inquirer.createPromptModule();

// Main Menu
async function mainMenu() {
  const { action } = await prompt({
    name: "action",
    type: "list",
    message: "Choose an action:",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
      "Exit",
    ],
  });


  switch (action) {
    case "View All Departments":
      return viewAllDepartments();
    case "View All Roles":
      return viewAllRoles();
    case "View All Employees":
      return viewAllEmployees();
    case "Add Department":
      return addDepartment();
    case "Add Role":
      return addRole();
    case "Add Employee":
      return addEmployee();
    case "Update Employee Role":
      return updateEmployeeRole();
    case "Exit":
      process.exit();
  }
}

// View all departments
async function viewAllDepartments() {
  const res = await db.query("SELECT * FROM departments");
  console.table(res.rows);
  mainMenu();
}

// View all roles
async function viewAllRoles() {
  const res = await db.query(`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    LEFT JOIN departments ON roles.department_id = departments.id
  `);
  console.table(res.rows);
  mainMenu();
}

// View all employees
async function viewAllEmployees() {
  const res = await db.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, 
      (SELECT CONCAT(m.first_name, ' ', m.last_name) FROM employees m WHERE m.id = employees.manager_id) AS manager
    FROM employees
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id
  `);
  console.table(res.rows);
  mainMenu();
}

// Add a department
async function addDepartment() {
  const { name } = await prompt({
    name: "name",
    type: "input",
    message: "Enter department name:",
  });

  await db.query("INSERT INTO departments (name) VALUES ($1)", [name]);
  console.log(`Added department: ${name}`);
  mainMenu();
}

// Add a role
async function addRole() {
  const departments = await db.query("SELECT * FROM departments");
  const departmentChoices = departments.rows.map(({ id, name }) => ({
    name,
    value: id,
  }));

  const answers = await prompt([
    { name: "title", type: "input", message: "Enter role title:" },
    { name: "salary", type: "input", message: "Enter role salary:" },
    {
      name: "department_id",
      type: "list",
      message: "Select department:",
      choices: departmentChoices,
    },
  ]);

  await db.query(
    "INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)",
    [answers.title, parseInt(answers.salary), answers.department_id]
  );
  console.log(`Added role: ${answers.title}`);
  mainMenu();
}

// Add an employee
async function addEmployee() {
  const roles = await db.query("SELECT * FROM roles");
  const roleChoices = roles.rows.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const employees = await db.query("SELECT * FROM employees");
  const managerChoices = employees.rows.map(
    ({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
  );
  managerChoices.unshift({ name: "None", value: null });

  const answers = await prompt([
    {
      name: "first_name",
      type: "input",
      message: "Enter employee first name:",
    },
    { name: "last_name", type: "input", message: "Enter employee last name:" },
    {
      name: "role_id",
      type: "list",
      message: "Select role:",
      choices: roleChoices,
    },
    {
      name: "manager_id",
      type: "list",
      message: "Select manager:",
      choices: managerChoices,
    },
  ]);

  await db.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
    [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
  );
  console.log(`Added employee: ${answers.first_name} ${answers.last_name}`);
  mainMenu();
}

// Update an employee role
async function updateEmployeeRole() {
  const employees = await db.query("SELECT * FROM employees");
  const employeeChoices = employees.rows.map(
    ({ id, first_name, last_name }) => ({
      name: `${first_name} ${last_name}`,
      value: id,
    })
  );

  const roles = await db.query("SELECT * FROM roles");
  const roleChoices = roles.rows.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const answers = await prompt([
    {
      name: "employee_id",
      type: "list",
      message: "Select employee:",
      choices: employeeChoices,
    },
    {
      name: "role_id",
      type: "list",
      message: "Select new role:",
      choices: roleChoices,
    },
  ]);

  await db.query("UPDATE employees SET role_id = $1 WHERE id = $2", [
    answers.role_id,
    answers.employee_id,
  ]);
  console.log("Employee role updated");
  mainMenu();
}

// Start application
mainMenu();
