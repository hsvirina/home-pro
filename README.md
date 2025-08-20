# beanly

A modern, user-friendly web service to help people discover cafes based on vibes, amenities, or purpose — whether for work, relaxation, or grabbing coffee on the go. Designed for a young urban audience with a clean, visual interface.

![Coffee](https://img.icons8.com/emoji/48/000000/hot-beverage-emoji.png) Платформа для любителей кофе: поиск кофеен, чекины, отзывы, избранное и ачивки!  
![Achievement](https://img.icons8.com/emoji/48/000000/trophy-emoji.png) Собирай ачивки и открывай рамки профиля: Bronze, Silver, Gold  
![Check-in](https://img.icons8.com/emoji/48/000000/check-mark-emoji.png) Чекины в любимых кафе, лайки и популярные отзывы  

---

## ✨ Features

- Search and filter cafes by vibe, amenities, or purpose (work, relax, coffee on the go)  
- Add cafes to favourites for easy access  
- Responsive design for desktop and mobile  
- Visual, modern interface tailored for young urban users  
- Persistent data using `localStorage` for favourites  
- **Доступность:** ARIA-метки для ачивок и рамок профиля  

---

## 🚀 Функционал

- Просмотр кофеен с рейтингом, фотографиями, адресом и описанием  
- Добавление кофейни в избранное  
- Чекины и отзывы зарегистрированных пользователей  
- Лайки для отзывов, сортировка по популярности  
- Система ачивок и рамок профиля: Bronze, Silver, Gold  
- Фильтры по категориям и тегам (мультиязычные названия)  

---

## 🛠️ Tech Stack

- **Frontend:** Angular 20, TypeScript    
- **Styling:** SCSS, TailwindCSS, PostCSS, Stylelint    
- **Routing & Animations:** @angular/router, @angular/animations    
- **Internationalization:** @ngx-translate/core, @ngx-translate/http-loader    
- **State / Reactive:** RxJS    
- **PDF Generation:** jsPDF, jsPDF-AutoTable    
- **Testing:** Jasmine, Karma    
- **Deployment:** angular-cli-ghpages    
- **Code Formatting:** Prettier + Prettier Plugin TailwindCSS

---

## 📁 Project Structure

```text
src/
├─ app/                  
│  ├─ environments/      
│  │  └─ api-endpoints.ts
│  ├─ layout/            
│  │  ├─ Header/
│  │  │  ├─ components/  
│  │  │  └─ header.component.ts
│  │  └─ footer.component.ts
│  ├─ pages/             
│  │  ├─ auth-page/      
│  │  ├─ catalog-page/   
│  │  ├─ home-page/      
│  │  ├─ place-details-page/ 
│  │  ├─ profile-page/   
│  │  └─ public-user-profile/ 
│  ├─ shared/            
│  ├─ app.component.ts
│  └─ app-routing.routes.ts
├─ assets/               
├─ styles/               
├─ index.html
├─ main.ts
└─ polyfills.ts
