## 📌 Hướng dẫn cài đặt và chạy ứng dụng

Thêm file local.properties vào folder android, sau đó copy "sdk.dir=C:\\Users\\Lenovo\\AppData\\Local\\Android\\Sdk" của máy bạn paste vào file

### **1️⃣ Cài đặt các dependencies**
Trước khi chạy ứng dụng, bạn cần cài đặt các dependencies bằng lệnh sau:
npm install
2️⃣ Đồng bộ các plugin của Capacitor
Sau khi cài đặt dependencies, bạn cần đồng bộ các plugin Capacitor với dự án:
npx cap sync
3️⃣ Chạy ứng dụng trên trình duyệt (Dành cho môi trường phát triển)
Sử dụng lệnh sau để chạy ứng dụng trên trình duyệt:
npm run dev
4️⃣ Chạy ứng dụng trên Android
Để chạy ứng dụng trên thiết bị hoặc trình giả lập Android, sử dụng lệnh:
npx cap run android

