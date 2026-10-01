# KTXGo - React Native

## Thông tin sinh viên

- **MSSV:** 23737881
- **Họ tên:** NGÔ PHONG HÀO
- **Môn:** Lập trình ứng dụng di động
- **Bài:** TH2 - React Native
- **Repository:** 23737881_TH2

---

## 1. Giới thiệu

KTXGo là ứng dụng React Native mô phỏng hệ thống đặt món/giao hàng trong khu ký túc xá.

Ứng dụng được xây dựng bằng React Native CLI + TypeScript, sử dụng React Navigation, React Query, Axios, Zustand Persist, AsyncStorage, FlashList và Geolocation.

Các chức năng chính:

- Đăng nhập bằng số điện thoại.
- Hiển thị danh sách sản phẩm.
- Tìm kiếm sản phẩm có debounce.
- Xem chi tiết sản phẩm.
- Thêm sản phẩm vào giỏ hàng.
- Thay đổi số lượng sản phẩm.
- Tính tổng tiền.
- Lưu giỏ hàng bằng AsyncStorage.
- Lấy vị trí hiện tại.
- Tính khoảng cách tới KTX.
- Tính phí giao hàng.
- Hiển thị thông tin sinh viên.
- Đăng xuất.

---

## 2. Công nghệ sử dụng

- React Native 0.87.1
- TypeScript
- React 19
- React Navigation
- React Query
- Axios
- Zustand
- AsyncStorage
- FlashList
- React Native Haptic Feedback
- React Native Geolocation

---

## 3. Kiến trúc ứng dụng
App
│
├── SafeAreaProvider
│
├── QueryClientProvider
│
└── RootNavigator
    │
    ├── AuthStack
    │   └── Login
    │
    └── MainTabs
        │
        ├── Shop
        │   └── ShopStack
        │       ├── Home
        │       └── Detail
        │
        ├── Cart
        │
        └── Me
## 4. Cấu trúc thư mục        
src/
├── components/
│   ├── ProductCard.tsx
│   └── Watermark.tsx
│
├── constants/
│   ├── student.ts
│   └── theme.ts
│
├── hooks/
│   ├── useCampusLocation.ts
│   └── useDebouncedValue.ts
│
├── navigation/
│   ├── AuthStack.tsx
│   ├── MainTabs.tsx
│   ├── RootNavigator.tsx
│   └── ShopStack.tsx
│
├── screens/
│   ├── CartScreen.tsx
│   ├── DetailScreen.tsx
│   ├── HomeScreen.tsx
│   ├── LoginScreen.tsx
│   └── MeScreen.tsx
│
├── services/
│   ├── apiClient.ts
│   └── productApi.ts
│
└── stores/
    ├── authStore.ts
    └── cartStore.ts
## 5. Câu 1 - Cấu hình sinh viên và biến thể
Thông tin sinh viên được tập trung trong:

src/constants/student.ts

Thông tin:

MSSV: 23737881
Họ tên: NGÔ PHONG HÀO
LAST_DIGIT: 1
ROOM_LABEL: P.181

Biến thể áp dụng:

Watermark: bottom
Login field: phone
Tab order: Shop → Giỏ → Tôi
Haptic: selection
Shipping formula: B
Detail presentation: card

Watermark:

TH2 · 23737881 · NGÔ PHONG HÀO · #STAMP
## 6. Câu 2 - Product API
Ứng dụng sử dụng Axios thông qua:

src/services/apiClient.ts

Request interceptor tự động thêm:

X-Student-Id: 23737881

API lấy danh sách sản phẩm:

GET https://fakestoreapi.com/products?limit=12

API lấy chi tiết sản phẩm:

GET https://fakestoreapi.com/products/{id}

React Query được sử dụng để quản lý:

Loading
Error
Data
Refetch
Cache

Danh sách sản phẩm được hiển thị bằng FlashList với 2 cột.

Tìm kiếm sản phẩm sử dụng debounce thông qua:

src/hooks/useDebouncedValue.ts
## 7. Câu 3 - Cart và Zustand Persist

Giỏ hàng được quản lý bởi:

src/stores/cartStore.ts

Các chức năng:

addItem()
removeItem()
changeQty()
clearCart()
getTotalQuantity()
getTotalAmount()

Giỏ hàng được persist bằng AsyncStorage với key:

ktxgo-cart-23737881

Dữ liệu giỏ hàng vẫn được giữ lại khi ứng dụng được mở lại.

## 8. Haptic Feedback

Khi thêm sản phẩm vào giỏ hàng, ứng dụng sử dụng:

selection

Thông qua:

react-native-haptic-feedback

Haptic được sử dụng ở:

Product Card
Product Detail
## 9. Tính giá sản phẩm

Giá hiển thị được tính theo:

Math.round(price * PRICE_MULTIPLIER)

Sau đó format theo:

vi-VN

Ví dụ:

310.000 đ
## 10. Location và phí giao hàng

Ứng dụng sử dụng:

@react-native-community/geolocation

để lấy vị trí hiện tại của thiết bị.

Khoảng cách được tính bằng công thức Haversine.

Sinh viên sử dụng:

Shipping Formula B

Công thức:

BASE_SHIP_FEE
+ Math.round(distanceKm * 1500)
+ 2000

Thông tin location được sử dụng ở:

MeScreen
CartScreen

Bao gồm:

Latitude
Longitude
Khoảng cách tới KTX
Phí giao hàng
Phòng giao
## 11. Quyền truy cập vị trí

Ứng dụng xử lý các trạng thái:

granted
denied
blocked
error

Nếu quyền bị từ chối, ứng dụng cho phép người dùng yêu cầu cấp lại quyền.

Nếu quyền bị chặn, ứng dụng cung cấp nút mở Settings để người dùng cấp quyền.

## 12. Cart UI

Màn hình Giỏ hàng hỗ trợ:

Tăng số lượng.
Giảm số lượng.
Xóa sản phẩm.
Xóa toàn bộ.
Tính tạm tính.
Tính phí giao hàng.
Tính tổng cộng.
Hiển thị badge số lượng trên tab Giỏ.

Công thức:

Tổng cộng = Tạm tính + Phí giao hàng
## 13. Authentication

Ứng dụng sử dụng Zustand Persist cho trạng thái đăng nhập.

Thông tin đăng nhập:

Phone

Token được lưu bằng AsyncStorage.

Key:

ktxgo-auth-23737881

Khi đăng xuất, token được xóa và ứng dụng quay lại màn hình Login.

## 14. Cách chạy project

Cài dependencies:

npm install

Kiểm tra TypeScript:

npx tsc --noEmit

Chạy Android:

npx react-native run-android

Chạy Metro:

npx react-native start
## 15. Android Location Permission

Ứng dụng yêu cầu:

<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

Các permission được khai báo trong:

android/app/src/main/AndroidManifest.xml
## 16. Git

Repository:

23737881_TH2

Branch chính:

main

Các commit chính:

chore: setup KTXGo project
feat: add student constants and product API
feat: add authentication and navigation
feat: implement shop and cart
feat: add location and shipping fee
docs: add project README
## 17. Thông tin sinh viên
MSSV: 23737881
Họ tên: NGÔ PHONG HÀO
TH2 | 23737881 | NGÔ PHONG HÀO | #STAMP