const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');
const { allowedNodeEnvironmentFlags } = require('process');
const { FORMERR } = require('dns');
const { type } = require('os');

const departmentArrayRole=[]
const arrayEmployee=[{id:0,name:'None'}]
const roleArray=[];

const db = mysql.createConnection(
    {
      host: 'localhost',
      // MySQL username,
      user: 'root',
      // MySQL password
      password: 'root1234',
      database: 'employee_db'
    },
    console.log(`

    _______  __   __  _______  ___      _______  __   __  _______  _______ 
    |       ||  |_|  ||       ||   |    |       ||  | |  ||       ||       |
    |    ___||       ||    _  ||   |    |   _   ||  |_|  ||    ___||    ___|
    |   |___ |       ||   |_| ||   |    |  | |  ||       ||   |___ |   |___ 
    |    ___||       ||    ___||   |___ |  |_|  ||_     _||    ___||    ___|
    |   |___ | ||_|| ||   |    |       ||       |  |   |  |   |___ |   |___ 
    |_______||_|   |_||___|    |_______||_______|  |___|  |_______||_______|
     __   __  _______  __    _  _______  _______  _______  ______           
    |  |_|  ||   _   ||  |  | ||   _   ||       ||       ||    _ |          
    |       ||  |_|  ||   |_| ||  |_|  ||    ___||    ___||   | ||          
    |       ||       ||       ||       ||   | __ |   |___ |   |_||_         
    |       ||       ||  _    ||       ||   ||  ||    ___||    __  |        
    | ||_|| ||   _   || | |   ||   _   ||   |_| ||   |___ |   |  | |        
    |_|   |_||__| |__||_|  |__||__| |__||_______||_______||___|  |_|        
    
                                                                                    
   `)
);






function mainMenu(){


inquirer
    .prompt({
      type: "list",
      name: "action",
      message: "What would you like to do? Please scroll through the options using your arrow keys",
      choices: [
        "View All Departments",
        "View All Roles",
        "View All Employees",
        "View Employees by Manager",
        "View Employees by Department",
        "Add a Department",
        "Add a Role",
        "Add an Employee",
        "Update an Employee's Details",
        "Update an Employee's Manager",
        "Delete Department",
        "Delete Role",
        "Delete Employee",
        "View Budget by Department",
        "Quit Application"]
    })
    .then((result) => {
        switch(result.action) {
            case "View All Departments":
                viewAllDepartments();
                break;
            case "View All Roles":
                viewAllRoles();
                break;
            case "View All Employees":
                viewAllEmployees();
                break;
            case "Add a Department":
                addDepartment();
                break;
            case "Add a Role":
                const initialQuery =
                `select * from department`
                db.query(initialQuery,(err,res)=>{
                    for(i=0; i<res.length; i++){
                        departmentArrayRole.push(res[i]);
                    }
                })
                addRole(departmentArrayRole);
                break;
            case "Add an Employee":
                const roleQuery =
                `select id, title as name from roles`
                db.query(roleQuery,(err,res)=>{
                    for(i=0; i<res.length; i++){
                        roleArray.push(res[i]);
                    }

                })
                const queryEmployees =
                `select id, CONCAT(first_name," ",last_name) as name from employee`
                db.query(queryEmployees,(err,res)=>{
                    for(i=0; i<res.length; i++){
                        arrayEmployee.push(res[i]);
                    }
                })

                addEmployee(roleArray,arrayEmployee);
                
                break;
            case "Update an Employee's Details":
                

                const queryEmployeeUpdate =
                `select id, CONCAT(first_name," ",last_name) as name from employee`
                db.promise().query(queryEmployeeUpdate)
                    .then(([rows,fields])=>{
                        const employeeList = rows;
                        const roleQuery =
                        `select id, title as name from roles`
                        db.promise().query(roleQuery)
                            .then(([row,fields])=>{
                                const roleList = row;
                                updateEmployee(employeeList,roleList)
                            })
                        

                })


                break;
            case "Update an Employee's Manager":
                const managerUpdateQuery =
                `select id, CONCAT(first_name," ",last_name) as name from employee`
                db.promise().query(managerUpdateQuery)
                    .then(([rows,fields])=>{
                        const employee = rows;
                        updateManager(employee);
                    })
                break;
            case "View Employees by Manager":
                const employeeByManagerQuery =
                `select id, CONCAT(first_name," ",last_name) as name from employee`
                db.promise().query(employeeByManagerQuery)
                    .then(([rows,fields])=>{
                        const managers = rows
                        employeeByManager(managers);
                    })
                break;
            case "View Employees by Department":

                const employeeByDepartmentQuery =
                `select * from department`
                db.promise().query(employeeByDepartmentQuery)
                    .then(([rows,fields])=>{
                        const department = rows;
                        employeeByDepartment(department)
                    })

                break;
            case "Delete Department":
                const deleteDepartmentQuery =
                `select * from department`
                db.promise().query(deleteDepartmentQuery)
                    .then(([rows,fields])=>{
                        const department = rows;
                        deleteDepartment(department)
                    })


                break;
            case "Delete Role":
                const deleteRoleQuery =
                `select id, title as name from roles`
                db.promise().query(deleteRoleQuery)
                    .then(([rows,fields])=>{
                        const roles = rows;
                        deleteRoles(roles)
                    })
                break;
            case "Delete Employee":
                const deleteEmployeeQuery =
                `select id, CONCAT(first_name," ",last_name) as name from employee`
                db.promise().query(deleteEmployeeQuery)
                    .then(([rows,fields])=>{
                        const employee = rows;
                        deleteEmployees(employee)
                    })
                break;
            case "View Budget by Department":
                const budgetDepartmentQuery =
                `select * from department`
                db.promise().query(budgetDepartmentQuery)
                    .then(([rows,fields])=>{
                        const department = rows;
                        budgetDepartment(department)
                    })
                break;
            case "Quit Application":
                process.exit(1);
                break;
        }
})
}

function viewAllDepartments(){
    console.log("-----------------------------------------------------") 
    console.log("Viewing all Departments \n")
    console.log("-----------------------------------------------------") 
    const query = 'select * from department';
    db.query(query, (err,result) =>{
        if (err){
            console.log(err);
        } else{
            console.table(result);
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        }

    })
    
}

function viewAllRoles(){
    console.log("-----------------------------------------------------")  
    console.log("Viewing all Roles \n")
    console.log("-----------------------------------------------------") 
    const query = 
    `select roles.title as Title, roles.id as ID, department.name as Department, roles.salary as Salary
    FROM roles
    JOIN department ON roles.department_id = department.id`
    db.query(query, (err,result) =>{
        if (err){
            console.log(err);
        } else{
            console.table(result);
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        }
    })
}

function viewAllEmployees(){
    console.log("-----------------------------------------------------") 
    console.log("Viewing all Employees \n");
    console.log("-----------------------------------------------------") 
    const query = 
    `select employee.id as ID, CONCAT(employee.first_name,' ',employee.last_name) as Name, roles.title as JobTitle, roles.salary as Salary, CONCAT(M.first_name,' ',M.last_name) as Manager
    FROM employee
    JOIN roles ON employee.role_id = roles.id
    LEFT JOIN employee M on M.id = employee.manager_id`
    db.query(query, (err,result) =>{
        if (err){
            console.log(err);
        } else{
            console.table(result);
            console.log("-----------------------------------------------------")  
            console.log("\n")
            mainMenu();
        }

    })
}

function addDepartment(){
    inquirer.prompt([
        {
            type: 'input',
            name: 'newDepartment',
            message: "What is the name of the department you would like to add?",
            validate: departmentName => {
              if(departmentName){
                return true;
              } else {
                console.log('Oops looks like you forgot to write a department name!');
                return false;
              }
            }
        }
    ]).then((answers)=>{
        department = answers.newDepartment
        query = 
        `INSERT INTO department(name)
        VALUES (?)`
        db.query(query,department,(err,result)=>{
            if(err){
                console.log(err)
            }
            console.log("\n")
            console.log("-----------------------------------------------------")        
            console.log("Department Successfuly Added")
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        })
    })
}

function addRole(rolesArray){
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleName',
            message: "What is the name of the role you would like to add?",
            validate: roleName => {
            if(roleName){
                return true;
            } else {
                console.log('Oops looks like you forgot to write a role name!');
                return false;
            }
            }
        },
        {
            type: 'input',
            name: 'roleSalary',
            message: "What is the salary of the role you would like to add?",
            validate: roleName => {
            if(roleName){
                return true;
            } else {
                console.log('Oops looks like you forgot input a salary amount!');
                return false;
            }
            } 
        },       
        {
            type: 'list',
            name: 'roleDepartment',
            message: "What is the department of the role you would like to add?",
            choices: rolesArray,
  
        }
    ]).then((answers)=>{

        const name = answers.roleName;
        const salary = parseInt(answers.roleSalary);
        const department = answers.roleDepartment;
        var departmentID;


        
        for(x=0;x<departmentArrayRole.length;x++){
            if(departmentArrayRole[x].name === department){
                departmentID = departmentArrayRole[x].id
            }
        }

        const departmentIDFinal = departmentID;
        console.log(salary)
        console.log(departmentIDFinal)


        

        const query = 
        `INSERT INTO roles(title,salary,department_id)
        VALUES ("${name}",${salary},${departmentIDFinal})
        `
        db.query(query,(err,result)=>{
            if(err){
                console.log(err)
            }
            console.log("Role Successfuly Added")
            console.log("\n")
            mainMenu();
        })

})

}

function addEmployee(rolesArray,employeeArray){
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeFirstName',
            message: "What is the first name of the employee you wish to add?",
            validate: roleName => {
            if(roleName){
                return true;
            } else {
                console.log('Oops looks like you forgot to input a name!');
                return false;
            }
            }
        },
        {
            type: 'input',
            name: 'employeeLastName',
            message: "What is the last name of the employee you wish to add?",
            validate: roleName => {
            if(roleName){
                return true;
            } else {
                console.log('Oops looks like you forgot to input a name!');
                return false;
            }
            }
        },       
        {
            type: 'list',
            name: 'employeeRole',
            message: "What role will they/do they work in?",
            choices: rolesArray,
        },
        {
            type: 'list',
            name: 'employeeManager',
            message: "Who will be there manager?",
            choices: employeeArray,
        }
    ]).then((answers)=>{
        const firstName = answers.employeeFirstName;
        const lastName = answers.employeeLastName;
        const role = answers.employeeRole;
        const manager = answers.employeeManager;
        var managerID;
        var roleID;

       
        
        for(x=0;x<roleArray.length;x++){
            if(roleArray[x].name === role){
                roleID = roleArray[x].id
            }
        }

        for(x=0; x<arrayEmployee.length;x++){
            if(arrayEmployee[x].name === manager){
                managerID = arrayEmployee[x].id;
            }else if(manager === 'None'){
                managerID = 'NULL'

            }
        }

        const managerIDFinal = managerID;
        const roleIDFinal = roleID;

        const query = 
        `INSERT INTO employee(first_name,last_name,role_id,manager_id)
        VALUES ("${firstName}","${lastName}",${roleIDFinal},${managerIDFinal})
        `
        db.query(query,(err,result)=>{
            if(err){
                console.log(err)
            }
            console.log("\n")
            console.log("-----------------------------------------------------") 
            console.log("Employee Successfuly Added")
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        })

    })
}

function updateEmployee(employeeArray,roleArray){
    console.log(employeeArray)
    inquirer.prompt([
        {
            type: 'list',
            name: 'employeeChoice',
            message: "Which employee would you like to apply updates to?",
            choices: employeeArray,
        },        
        {
            type: 'list',
            name: 'employeeRole',
            message: "Please select the role you would like to update?",
            choices: roleArray,
        }

    ]).then((answers)=>{
        const employee = answers.employeeChoice;
        const role = answers.employeeRole;
        var roleID;
        var employeeID;
        console.log(employeeArray)

        for(i=0;i<employeeArray.length;i++){
            if(employeeArray[i].name === employee){
                employeeID = employeeArray[i].id
            }
        }

        for(i=0;i<roleArray.length;i++){
            if(roleArray[i].name === role){
                roleID = roleArray[i].id
            }
        }

        const query =
        `UPDATE employee
        SET role_id =${roleID}
        where id = ${employeeID}`
        db.query(query, (err,res)=>{
            if(err){
                console.log(err)
            }
            console.log("\n")
            console.log("-----------------------------------------------------") 
            console.log("Employee Successfuly Updated")
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        })

    })
}

function updateManager(employee){
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee would you like to update their manager?",
            choices: employee,
        },        
        {
            type: 'list',
            name: 'newManager',
            message: "Please select the new manager?",
            choices: employee,
        }

    ])
    .then((answers)=>{
        const employeeChoice = answers.employee;
        const newManager = answers.newManager;
        var employeeID;
        var managerID;

        for(i=0;i<employee.length;i++){
            if(employee[i].name === employeeChoice){
                employeeID = employee[i].id
            }
        }

        for(i=0;i<employee.length;i++){
            if(employee[i].name === newManager){
                managerID = employee[i].id
            }
        }

        const query =
        `UPDATE employee
        SET manager_id =${managerID}
        where id = ${employeeID}`
        db.query(query, (err,res)=>{
            if(err){
                console.log(err)
            }
            console.log("\n")
            console.log("-----------------------------------------------------") 
            console.log("Employee Manager Succesfully Updated")
            console.log("-----------------------------------------------------") 
            console.log("\n")
            mainMenu();
        })

    })
}

function employeeByManager(employees){
    inquirer.prompt([
        {
            type: 'list',
            name: 'manager',
            message: "Which manager's direct reports would you like to see?",
            choices: employees,
        }
    ]).then((answer)=>{
        const managerChoice = answer.manager;
        var managerID;

        for(i=0;i<employees.length;i++){
            if(employees[i].name === managerChoice){
                managerID = employees[i].id
            }
        }

        const query =
        `SELECT id, CONCAT(first_name," ",last_name) as name
        FROM employee
        WHERE manager_id = ?;`



        db.query(query,managerID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log('\n')
            console.log("-----------------------------------------------------") 
            console.log(`Viewing all employees who report to ${managerChoice}`)
            console.log("-----------------------------------------------------") 
            console.log('\n')
            console.table(res)
            console.log('\n')
            mainMenu();
        })

    })
}

function employeeByDepartment(department){
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: "Which departments's employees would you like to see?",
            choices: department,
        }
    ]).then((answer)=>{
        const departmentChoice = answer.department;
        var departmentID;

        for(i=0;i<department.length;i++){
            if(department[i].name === departmentChoice){
                departmentID = department[i].id
            }
        }


        const query =
        `SELECT CONCAT(employee.first_name,' ',employee.last_name) as Name, roles.title as title, roles.department_id as department_id
        FROM employee
        JOIN roles ON employee.role_id = roles.id
        WHERE roles.department_id = ?;`



        db.query(query,departmentID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log('\n')
            console.log("--------------------------------------------------------------------") 
            console.log(`Viewing all employees who work in the ${departmentChoice} department`)
            console.log("--------------------------------------------------------------------") 
            console.log('\n')
            console.table(res)
            console.log('\n')
            mainMenu();
        })

    })
}

function deleteDepartment(department){
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: "Which department would you like to delete?",
            choices: department,
        }
    ]).then((answer)=>{
        const departmentChoice = answer.department;
        var departmentID;

        for(i=0;i<department.length;i++){
            if(department[i].name === departmentChoice){
                departmentID = department[i].id
            }
        }

        const query =
        `DELETE FROM department WHERE id = ?;`


        db.query(query,departmentID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log(`\n`)
            console.log(`------------------------------------------------------`)
            console.log(`${departmentChoice} has been deleted from the database`)
            console.log(`------------------------------------------------------`)
            console.log(`\n`)
            mainMenu();
        })

    })
}

function deleteRoles(roles){
    inquirer.prompt([
        {
            type: 'list',
            name: 'roles',
            message: "Which role would you like to delete?",
            choices: roles,
        }
    ]).then((answer)=>{
        const roleChoice = answer.roles;
        var roleID;

        for(i=0;i<roles.length;i++){
            if(roles[i].name === roleChoice){
                roleID = roles[i].id
            }
        }

      

        const query =
        `DELETE FROM roles WHERE id = ?;`

        db.query(query,roleID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log(`\n`)
            console.log(`------------------------------------------------------`)
            console.log(`${roleChoice} has been deleted from the database`)
            console.log(`------------------------------------------------------`)
            console.log(`\n`)
            mainMenu();
        })

    })
}

function deleteEmployees(employee){
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee would you like to delete?",
            choices: employee,
        }
    ]).then((answer)=>{
        const employeeChoice = answer.employee;
        var employeeID;

        for(i=0;i<employee.length;i++){
            if(employee[i].name === employeeChoice){
                employeeID = employee[i].id
            }
        }

      

        const query =
        `DELETE FROM employee WHERE id = ?;`

        db.query(query,employeeID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log(`\n`)
            console.log(`------------------------------------------------------`)
            console.log(`${employeeChoice} has been deleted from the database`)
            console.log(`------------------------------------------------------`)
            console.log(`\n`)
            mainMenu();
        })

    })
}

function budgetDepartment(department){
    inquirer.prompt([
        {
            type: 'list',
            name: 'department',
            message: "Which department would you like to see the budget of?",
            choices: department,
        }
    ]).then((answer)=>{
        const departmentChoice = answer.department;
        var departmentID;

        for(i=0;i<department.length;i++){
            if(department[i].name === departmentChoice){
                departmentID = department[i].id
            }
        }

        const budgetQuery =
        `SELECT CONCAT("$",SUM(salary)) as Total_Budget
        FROM roles
        WHERE id =?;`

        db.query(budgetQuery,departmentID,(err,res)=>{
            if(err){
                console.log(err)
            }
            console.log(`\n`)
            console.log('----------------------------------');
            console.log(`Viewing budget for ${departmentChoice}`);
            console.log('----------------------------------');
            console.table(res)
            console.log(`\n`)

            mainMenu();
        })

    })
}

mainMenu();

