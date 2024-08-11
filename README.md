
# Course Management Project

## Tổng quan
- Chương trình chạy trên nền tảng web (sử dụng tốt nhất trên trình duyệt Google Chrome).
- Chương trình kết nối với database PostgreSQL.
<br>

## Hướng dẫn chạy chương trình
<br>

**1. Tạo database**
- Mở PostgreSQL và tạo 1 database trống.
- Chạy file `DB_Schema.sql` trong thư mục `src/data/PostgreSQLDatabase`.
- Chạy file `DB_Data.sql` trong thư mục `src/data/PostgreSQLDatabase`.
- Thay đổi các giá trị của file `.env` trong thư mục `src` để phù hợp với database của thiết bị.
<br>

**2. Chạy chương trình** 
- Mở thư mục `src` trong Visual Studio Code.
- Chạy lệnh `npm i` trên Terminal để cài đặt các package.
- Chạy lệnh `npm start` trên Terminal.
- Truy cập vào địa chỉ http://localhost:3000 trên trình duyệt web.
- Đăng nhập bằng bất kì tài khoản nào trong file `DB_Data.sql` trong thư mục `src/data/PostgreSQLDatabase`. Mật khẩu được cấp sẵn ban đầu đều là `123`, sau khi đăng nhập người dùng có thể thực hiện chức năng đổi mật khẩu. 3 tài khoản mẫu:
	- student: lpttruc@gmail.com
	- teacher: dclam@gmail.com
	- admin: ndbao@gmail.com
<br>

**3. Lưu ý** <br>
Các chức năng import file Excel: có những file Excel mẫu trong thư mục `src/data/ImportExcel`. Tuy nhiên dữ liệu trong các file này chỉ là dữ liệu mẫu, khi sử dụng cần thay đổi dữ liệu cho phù hợp với nhu cầu.
