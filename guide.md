
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

•  Nếu vẫn 404 → thêm file vercel.json (tạo mới trong repo):

```json
{
  "routes": [{ "src": "/(.*)", "dest": "/index.html" }]
}
```

Vấn đề email confirmation link chuyển sang localhost:3000 là lỗi rất phổ biến của Supabase khi deploy production (Vercel/Netlify), và dễ fix cực kỳ — chỉ cần cấu hình đúng trong dashboard Supabase là hết ngay.
Lý do xảy ra
•  Supabase mặc định Site URL = http://localhost:3000 (dành cho dev local).
•  Khi bạn signUp() mà không chỉ định redirectTo, email confirm link sẽ redirect về Site URL này sau khi verify.
•  Kết quả: Click link → verify thành công trên Supabase server → nhưng redirect về localhost:3000 (không tồn tại trên production → lỗi hoặc trắng trang).
Cách fix nhanh (làm trên điện thoại, 2 phút)
1.  Mở trình duyệt → https://supabase.com/dashboard → vào project của bạn.
2.  Menu bên trái → Authentication → URL Configuration.
3.  Ở phần Site URL:
	•  Thay từ http://localhost:3000 thành link Vercel của bạn (ví dụ: https://my-framework-supabase.vercel.app)
	•  Nhấn Save.
4.  Ở phần Redirect URLs (Additional redirect URLs):
	•  Thêm chính xác link Vercel của bạn: https://my-framework-supabase.vercel.app/** (có ** ở cuối để allow tất cả path, hoặc chỉ https://my-framework-supabase.vercel.app)
	•  Nhấn Save.
→ Xong! Supabase sẽ dùng URL này cho tất cả email confirm/password reset từ bây giờ.
Cải tiến tốt hơn (thêm vào code signUp để chắc chắn)

Edit file app.js (trong Login component, hàm signUp):

```js
const signUp = async () => {
  setLoading(true);
  setMessage('');
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: location.origin  // Hoặc hardcode 'https://my-framework-supabase.vercel.app'
    }
  });
  setLoading(false);
  if (error) setMessage('Lỗi: ' + error.message);
  else setMessage('Đăng ký thành công! Kiểm tra email để xác nhận.');
};
```

•  location.origin tự lấy URL hiện tại (production sẽ là vercel.app).
•  Commit lại → Vercel redeploy tự động.


