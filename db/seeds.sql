INSERT INTO department(name)
VALUES  ('Accounting'),
        ('Human Resources'),
        ('Finance'),
        ('Management');

INSERT INTO roles(title,salary,department_id)
VALUES  ('Accountant',50000,1),
        ('People Manager',65000,2),
        ('Finance Analyst',50000,3),
        ('Team Leader',100000,4),
        ('Lead Accountant',100000,1);

INSERT INTO employee(first_name,last_name,role_id,manager_id)
VALUES  ('Bugs','Bunny',4, NULL),
        ('Dwayne','Johnson',1,1);