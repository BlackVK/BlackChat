let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'Alex_Dev', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'Maria_Designer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'John_Gamer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'Sarah_Writer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: false },
    { username: 'Mike_Coder', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true }
];

function register() {
    const username = document.getElementById('new-username').value;
    const password = document.getElementById('new-password').value;
    const profilePic = document.getElementById('profile-pic').files[0];

    if (username && password) {
        if (users.some(u => u.username === username)) {
            alert('Имя пользователя уже занято!');
            return;
        }
        let profilePicUrl = 'https://via.placeholder.com/40';
        if (profilePic) {
            profilePicUrl = URL.createObjectURL(profilePic);
        }
        users.push({ username, password, profilePic: profilePicUrl, online: false });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Регистрация успешна!');
        window.location.href = 'login.html';
    } else {
        alert('Заполните все поля!');
    }
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        user.online = true;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', username);
        window.location.href = 'main.html';
    } else {
        alert('Неверное имя пользователя или пароль!');
    }
}

function logout() {
    const currentUser = localStorage.getItem('currentUser');
    const user = users.find(u => u.username === currentUser);
    if (user) {
        user.online = false;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.removeItem('currentUser');
    }
    window.location.href = 'main.html';
}

function updateProfile() {
    const username = document.getElementById('profile-username').value;
    const profilePic = document.getElementById('profile-pic-upload').files[0];
    const currentUser = localStorage.getItem('currentUser');

    const user = users.find(u => u.username === currentUser);
    if (user) {
        if (username && username !== currentUser) {
            if (users.some(u => u.username === username)) {
                alert('Имя пользователя уже занято!');
                return;
            }
            user.username = username;
            localStorage.setItem('currentUser', username);
        }
        if (profilePic) {
            const img = new Image();
            img.src = URL.createObjectURL(profilePic);
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 80;
                canvas.height = 80;
                ctx.drawImage(img, 0, 0, 80, 80);
                user.profilePic = canvas.toDataURL('image/png');
                localStorage.setItem('users', JSON.stringify(users));
                alert('Профиль обновлен!');
                window.location.href = 'main.html';
            };
        } else {
            localStorage.setItem('users', JSON.stringify(users));
            alert('Профиль обновлен!');
            window.location.href = 'main.html';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('main.html')) {
        const usersList = document.getElementById('users-list');
        const onlineCount = document.getElementById('online-count');
        const authCard = document.getElementById('auth-card');
        const userInfoCard = document.getElementById('user-info-card');
        const userAvatar = document.getElementById('user-avatar');
        const userNickname = document.getElementById('user-nickname');
        const currentUser = localStorage.getItem('currentUser');

        if (currentUser) {
            const user = users.find(u => u.username === currentUser);
            if (user) {
                authCard.style.display = 'none';
                userInfoCard.style.display = 'flex';
                userAvatar.src = user.profilePic;
                userNickname.textContent = user.username;
            }
        } else {
            authCard.style.display = 'block';
            userInfoCard.style.display = 'none';
        }

        const onlineUsers = users.filter(u => u.online).length;
        onlineCount.textContent = `(${onlineUsers})`;
        usersList.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = `user-item ${user.online ? 'online' : 'offline'}`;
            userDiv.innerHTML = `
                <div class="user-content">
                    <div class="user-status">
                        <div class="user-status-dot ${user.online ? 'online' : 'offline'}"></div>
                        ${user.online ? '<div class="user-status-pulse"></div>' : ''}
                    </div>
                    <div class="user-info">
                        <div class="user-nickname ${user.online ? 'online' : ''}">${user.username}</div>
                        <div class="user-status-text ${user.online ? 'online' : 'offline'}">${user.online ? 'В сети' : 'Не в сети'}</div>
                    </div>
                    ${user.online ? '<div class="user-activity-indicator online"></div>' : ''}
                </div>
            `;
            usersList.appendChild(userDiv);
        });
    }

    if (window.location.pathname.includes('profile.html')) {
        const currentUser = localStorage.getItem('currentUser');
        const user = users.find(u => u.username === currentUser);
        if (user) {
            document.getElementById('profile-username').value = user.username;
            document.getElementById('profile-pic-preview').src = user.profilePic;
        }
    }

    if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('register.html')) {
        const fileInput = document.getElementById('profile-pic-upload') || document.getElementById('profile-pic');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files[0]) {
                    document.getElementById('profile-pic-preview').src = URL.createObjectURL(e.target.files[0]);
                }
            });
        }
    }
});
