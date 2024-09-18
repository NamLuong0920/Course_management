
# Course Management Project

## Overview
- The project runs on web (best used on Google Chrome browser).
- The project connects to the PostgreSQL database.
<br>

## How to Run
<br>

**1. Create Database**
- Create a new database in PostgreSQL.
- Run `DB_Schema.sql` in the `src/data/PostgreSQLDatabase` folder to create schema for your database.
- Run `DB_Data.sql` in the `src/data/PostgreSQLDatabase` folder to create data for your database.
- Change the values ​​of the `.env` file in the `src` folder to match your database.
<br>

**2. Run the Program** 
- Open the `src` folder in Visual Studio Code.
- Run `npm i` on Terminal to install the packages.
- Run `npm start` on Terminal to run the program.
- Access the address http://localhost:3000 on the web browser.
- Log in to the program with any account in `DB_Data.sql` in the `src/data/PostgreSQLDatabase` folder. The initial password is `123`. After logging in, user can change the password. 3 sample accounts:
	- student: lpttruc@gmail.com
	- teacher: dclam@gmail.com
	- admin: ndbao@gmail.com
<br>

**3. Note** <br>
Excel file import functions: There are sample Excel files in the `src/data/ImportExcel` folder. However, the data in these files is only sample data. When using it, you have to change the data to suit your needs.
