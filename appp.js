const { h } = window.App.VDOM;
const { useState, useEffect } = window.App.Hooks;
const { init, addRoute, Link, Outlet, beforeEach, navbarDynamic, rerender } = window.App.Router;

// Navbar động - update realtime khi login/logout
function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy session ban đầu
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Listen mọi thay đổi auth (login, logout, confirm email...)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      // Force re-render toàn app khi auth thay đổi
      rerender();
    });

    // Cleanup listener khi component unmount (tốt practice)
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    await supabase.auth.signOut();
    // rerender() đã được gọi trong onAuthStateChange
  };

return h('nav', { style: { background: '#2c3e50', padding: '1rem', color: 'white', textAlign: 'center' } },
    h(Link, { to: '/', children: 'Home' }),
    ' | ',
    h(Link, { to: '/about', children: 'About' }),
    ' | ',
    h(Link, { to: '/dashboard', children: 'Dashboard' }),
    ' | ',
    user 
    ? h('span', null, `Xin chào ${user.email} | `, 
          h('a', { href: '#', onClick: handleLogout, style: { color: 'white' } }, 'Đăng xuất')
        )
      : h(Link, { to: '/login', children: 'Đăng nhập'  })
  );
}

// Trang chủ
function Home() {
  return h('div', { className: 'container' },
    h('h1', null, 'Chào mừng đến với Framework Tự Build!'),
    h('p', null, 'Bạn đang dùng VDOM + Hooks + Router + Supabase Auth tự code.'),
    h('p', null, 'Hãy thử đăng nhập để vào Dashboard.')
  );
}

function About() {
  return h('div', { className: 'container' },
    h('h1', null, 'Giới Thiệu'),
    h('p', null, 'Đây là một framework frontend nhẹ, tự build từ đầu.'),
    h('p', null, 'Tích hợp Supabase để có đăng ký/đăng nhập an toàn.')
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    setMessage('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: location.origin // tự động lấy URL hiện tại (vercel.app)
      }
    });
    setLoading(false);

    if (error) {
      setMessage('Lỗi: ' + error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      setMessage('Email này đã được sử dụng.');
    } else {
      setMessage('Đăng ký thành công! Kiểm tra email để xác nhận.');
    }
  };

  const signIn = async () => {
    setLoading(true);
    setMessage('');
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    setLoading(false);

    if (error) {
      setMessage('Lỗi: ' + error.message);
    } else {
      setMessage('Đăng nhập thành công! Đang chuyển...');
      rerender(); // update navbar ngay
      App.Router.navigateTo('/dashboard'); // redirect về dashboard
    }
  };

  return h('div', { className: 'container' },
    h('h1', null, 'Đăng nhập / Đăng ký'),
    h('input', { type: 'email', placeholder: 'Email', value: email, onInput: e => setEmail(e.target.value) }),
    h('input', { type: 'password', placeholder: 'Mật khẩu (tối thiểu 6 ký tự)', value: password, onInput: e => setPassword(e.target.value) }),
    h('div', { style: { margin: '20px 0' } },
      h('button', { onClick: signUp, disabled: loading }, loading ? 'Đang xử lý...' : 'Đăng ký'),
      ' ',
      h('button', { onClick: signIn, disabled: loading }, loading ? 'Đang xử lý...' : 'Đăng nhập')
    ),
    message && h('p', { style: { color: message.includes('Lỗi') ? 'red' : 'green', marginTop: '1rem' } }, message)
  );
}

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        Router.navigateTo('/login');
      } else {
        setUser(data.session.user);
      }
    });
  }, []);

  if (!user) return h('div', { className: 'container' }, 'Đang tải...');

  return h('div', { className: 'container' },
    h('h1', null, 'Dashboard Bí Mật'),
    h('p', null, `Chỉ thành viên mới vào được. Xin chào ${user.email}!`),
    h('p', null, 'Bạn đã đăng nhập thành công bằng Supabase Auth tự code.')
  );
}

// Bảo vệ route
beforeEach(async (to, from, next) => {
  if (to === '/dashboard') {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      return next('/login');
    }
  }
  next();
});

// Routes
addRoute('/', Home);
addRoute('/about', About);
addRoute('/login', Login);
addRoute('/dashboard', Dashboard);

navbarDynamic({ navbar: Navbar });

// Khởi động
init(document.getElementById('app'), { hash: false });