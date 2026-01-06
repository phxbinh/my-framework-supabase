
# 1.Tạo dự án trên github
A. Tạo repo GitHub mới trên điện thoại
1.  Mở app GitHub → Đăng nhập (nếu chưa có tài khoản thì đăng ký nhanh bằng email/Google).
2.  Nhấn dấu + ở góc dưới → New repository
3.  Đặt tên repo ví dụ: MyShop
4.  Description: “Framework tự build với VDOM + Hooks + Router + Supabase”
5.  Chọn Public → Create repository
B. Thêm files
MyShop
  |- index.html
  |- Debugger.js
  |- vdom.js
  |- hooks.js
  |- router.js
  |- app.js

# 2.Đăng ký thành viên trên supabase.com
## Tạo dự án mới
1.  Mở trình duyệt → https://supabase.com → đăng nhập (GitHub hoặc email)
2.  New Project → đặt tên → tạo
3.  Vào Settings → API → copy URL và anon public key
4.  Quay lại GitHub → chỉnh sửa 2 file:
	•  index.html: thay YOUR_SUPABASE_URL và YOUR_ANON_KEY
	•  app.js: (nếu có dùng supabase ở đó)

# 3.Đăng ký thành viên trên vercel.com
## Tạo một dự án mới
## Tạo deployment tới github -> MyShop
Deploy lên Vercel trên điện thoại
1.  Mở trình duyệt → https://vercel.com → đăng nhập bằng GitHub
2.  Nhấn New Project
3.  Vercel sẽ hiện list repo GitHub của bạn → chọn repo my-framework-supabase
4.  Không cần config gì → nhấn Deploy
5.  Chờ 30-60 giây → xong! Vercel cho bạn link kiểu: https://MyShop.vercel.app
