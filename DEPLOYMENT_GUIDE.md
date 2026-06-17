# 📘 Hướng Dẫn Deploy Landing Page với Nginx

## 📋 Yêu cầu
- VPS/Server (Ubuntu 20.04+, CentOS 7+, hoặc Debian)
- SSH access đến server
- Domain name (tùy chọn)
- Kiến thức cơ bản về terminal

---

## 🚀 Bước 1: Chuẩn Bị Server

### 1.1 Cập nhật hệ thống
```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Tạo user cho web (khuyến nghị)
```bash
sudo useradd -m -s /bin/bash webuser
sudo passwd webuser
```

---

## 📦 Bước 2: Cài Đặt Nginx

### 2.1 Cài Nginx
```bash
sudo apt install nginx -y
```

### 2.2 Kiểm tra cài đặt
```bash
nginx -v
```

### 2.3 Khởi động Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx  # Tự động khởi động khi reboot
```

### 2.4 Kiểm tra trạng thái
```bash
sudo systemctl status nginx
```

---

## 📁 Bước 3: Tạo Thư Mục Web

### 3.1 Tạo thư mục chứa landing page
```bash
sudo mkdir -p /var/www/landing-page-20260617
```

### 3.2 Gán quyền
```bash
sudo chown -R webuser:webuser /var/www/landing-page-20260617
sudo chmod -R 755 /var/www/landing-page-20260617
```

---

## 📤 Bước 4: Upload File Landing Page

### Cách 1: Sử dụng SCP (từ máy local)
```bash
scp -r /path/to/landing-page-20260617/* username@server_ip:/var/www/landing-page-20260617/
```

### Cách 2: Sử dụng Git (nếu có repo)
```bash
cd /var/www/landing-page-20260617
sudo -u webuser git clone <your-repo-url> .
```

### Cách 3: Dùng SFTP (FileZilla)
- Host: server_ip
- User: username
- Pass: password
- Port: 22
- Upload file vào `/var/www/landing-page-20260617/`

---

## ⚙️ Bước 5: Cấu Hình Nginx

### 5.1 Tạo file cấu hình
```bash
sudo nano /etc/nginx/sites-available/landing-page-20260617
```

### 5.2 Copy cấu hình sau vào file

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name yourdomain.com www.yourdomain.com;  # Đổi thành domain của bạn

    # Nếu không có domain, dùng IP
    # server_name _;

    root /var/www/landing-page-20260617;
    index index.html;

    # Cấu hình logging
    access_log /var/log/nginx/landing-page-20260617_access.log;
    error_log /var/log/nginx/landing-page-20260617_error.log;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;

    # Cache static files
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Xử lý 404 error
    error_page 404 /index.html;
    location = /404.html {
        internal;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Main location
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### 5.3 Kích hoạt cấu hình
```bash
sudo ln -s /etc/nginx/sites-available/landing-page-20260617 /etc/nginx/sites-enabled/
```

### 5.4 Xóa cấu hình mặc định (tùy chọn)
```bash
sudo rm /etc/nginx/sites-enabled/default
```

### 5.5 Kiểm tra cấu hình
```bash
sudo nginx -t
```

**Output mong đợi:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 5.6 Reload Nginx
```bash
sudo systemctl reload nginx
```

---

## 🔒 Bước 6: Cấu Hình SSL (HTTPS)

### 6.1 Cài Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 6.2 Tạo SSL certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 6.3 Tự động renew certificate
```bash
sudo certbot renew --dry-run
```

---

## 🔥 Bước 7: Cấu Hình Firewall

### 7.1 Cài UFW (nếu chưa có)
```bash
sudo apt install ufw -y
```

### 7.2 Mở các port cần thiết
```bash
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

### 7.3 Kiểm tra trạng thái
```bash
sudo ufw status
```

---

## ✅ Bước 8: Xác Minh Deployment

### 8.1 Kiểm tra từ máy local
```bash
curl http://yourdomain.com
# hoặc
curl http://server_ip
```

### 8.2 Xem logs
```bash
sudo tail -f /var/log/nginx/landing-page-20260617_access.log
sudo tail -f /var/log/nginx/landing-page-20260617_error.log
```

---

## 📊 Lệnh Quản Lý Nginx Hữu Ích

```bash
# Khởi động
sudo systemctl start nginx

# Dừng
sudo systemctl stop nginx

# Restart
sudo systemctl restart nginx

# Reload (không ngắt kết nối hiện tại)
sudo systemctl reload nginx

# Kiểm tra trạng thái
sudo systemctl status nginx

# Xem cấu hình
sudo nginx -T

# Kiểm tra cú pháp
sudo nginx -t
```

---

## 🆘 Troubleshooting

### Landing page không hiển thị
1. Kiểm tra file tồn tại:
   ```bash
   ls -la /var/www/landing-page-20260617/index.html
   ```

2. Kiểm tra quyền truy cập:
   ```bash
   sudo chown -R www-data:www-data /var/www/landing-page-20260617
   ```

3. Kiểm tra logs:
   ```bash
   sudo tail -20 /var/log/nginx/error.log
   ```

### Nginx không khởi động
```bash
sudo nginx -t  # Kiểm tra lỗi cấu hình
sudo systemctl restart nginx
```

### Lỗi 502 Bad Gateway
```bash
sudo systemctl status nginx
sudo nginx -t
sudo systemctl restart nginx
```

### Domain không resolve
- Kiểm tra DNS records
- A record cần point tới IP của server
- Chờ DNS propagate (có thể mất 24h)

---

## 📝 Cập Nhật Content

Để cập nhật landing page:

### Cách 1: Upload file mới
```bash
scp index.html username@server_ip:/var/www/landing-page-20260617/
```

### Cách 2: Pull từ Git
```bash
cd /var/www/landing-page-20260617
sudo -u webuser git pull origin main
```

### Cách 3: Edit trực tiếp
```bash
sudo nano /var/www/landing-page-20260617/index.html
```

---

## 🎯 Checklists Cuối Cùng

- [ ] Server có SSH access
- [ ] Nginx cài và chạy thành công
- [ ] File landing page upload vào `/var/www/landing-page-20260617/`
- [ ] Cấu hình Nginx đúng
- [ ] Kiểm tra syntax: `sudo nginx -t`
- [ ] Nginx reload: `sudo systemctl reload nginx`
- [ ] SSL certificate cài đặt (nếu cần)
- [ ] Firewall cấu hình đúng
- [ ] Domain DNS pointing đến server
- [ ] Test từ browser: http://yourdomain.com

---

## 📞 Hỗ Trợ

Nếu gặp vấn đề:
1. Kiểm tra logs: `/var/log/nginx/`
2. Chạy `sudo nginx -t` để kiểm tra lỗi
3. Restart Nginx: `sudo systemctl restart nginx`
4. Kiểm tra quyền truy cập thư mục

---

**Tạo lần cuối:** 2026-06-17
**Phiên bản:** 1.0
