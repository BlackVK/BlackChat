let users = JSON.parse(localStorage.getItem('users')) || [
    { username: 'Alex_Dev', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'Maria_Designer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'John_Gamer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true },
    { username: 'Sarah_Writer', password: 'password', profilePic: 'https://via.placeholder.com/40', online: false },
    { username: 'Mike_Coder', password: 'password', profilePic: 'https://via.placeholder.com/40', online: true }
];

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

$(document).ready(function() {
    $('#profile-pic-preview').on('click', function() {
        alert('Вы нажали на изображение профиля!');
    });

    const currentUser = localStorage.getItem('currentUser');
    const user = users.find(u => u.username === currentUser);
    if (user) {
        $('#profile-username').val(user.username);
        $('#profile-pic-preview').attr('src', user.profilePic);
    }

    $('#profile-pic-upload').change(function(e) {
        if (e.target.files[0]) {
            $('#profile-pic-preview').attr('src', URL.createObjectURL(e.target.files[0]));
        }
    });
});
