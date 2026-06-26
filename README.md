# NYCU Classroom Booking Demo

國立陽明交通大學教室預訂系統 demo。此版本先使用前端假資料，不串接資料庫，重點是確認前臺與後臺頁面形式、操作流程與資料欄位。

## Demo 功能

- 前臺預訂
  - 搜尋教室
  - 選擇日期與時段
  - 填寫申請人資料
  - 送出後自動進入後臺待簽核名單

- 後臺管理
  - 總覽
  - 預訂名單
  - 申請人名單
  - 教室資料
  - 簽核紀錄
  - 表單匯出
  - 系統設定

## 本機執行

```bash
npm install
npm run dev
```

## GitHub Pages

此專案已設定：

- `main` 分支：原始碼與 GitHub Actions workflow。
- `gh-pages` 分支：已建置完成的靜態網頁。
- Vite base path：`/schoolsystem/`。

若 GitHub Pages 尚未啟用，請到 repo：

1. Settings
2. Pages
3. Build and deployment
4. Source 選 `Deploy from a branch`
5. Branch 選 `gh-pages`，資料夾選 `/root`
6. Save

啟用後網址會是：

```text
https://ptgaminglife.github.io/schoolsystem/
```
