import { SplashScreen } from "@capacitor/splash-screen";
import { Camera } from "@capacitor/camera";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";

window.customElements.define(
  "capacitor-welcome",
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();

      const root = this.attachShadow({ mode: "open" });

      root.innerHTML = `
      <style>
      * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      }

      input[type=number]::-webkit-inner-spin-button {
        -webkit-appearance: none;
      }

      #container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      #title {
        font-size: 36px;
        text-align: center;
        margin-bottom: 20px;
        color: rgb(49, 214, 198);
      }

      #age {
        display: flex;
        flex-direction: column;
        gap: 5px;
        width: 100%;
      }

      #input-value {
        width: 100%;
        position: relative;
      }

      #input-value label {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        font-size: 14px;
        pointer-events: none;
        color: #999;
        transition: all 0.2s ease;
      }
        
      #input-value input {
        width: 100%;
        padding: 8px 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        outline: none;
        color: #333;
        transition: border-color 0.2s ease;
      }

      #input-value input:focus {
        border-color: #333;
      }
          
      #input-value input:focus + label, #input-value input:valid + label {
        padding: 0 5px;
        top: 0px;
        font-size: 12px;
        background: #fff;
        color: #333;
      }

      #calculateAge {
        padding: 10px 16px;
        border: none;
        outline: none;
        border-radius: 5px;
        background-color:rgb(181, 91, 240);
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }

      #btns button {
        padding: 10px 16px;
        border: none;
        outline: none;
        border-radius: 5px;
        color: #fff;
        font-size: 14px;
        cursor: pointer;
      }

      #btns #shareResult {
        background-color: rgb(113, 91, 240);
      }

      #btns #takePhoto {
        background-color: rgb(240, 181, 91);
      }
    </style>

    <div id="container">
      <h1 id="title">Ứng dụng tính tuổi</h1>
      <div id="age">
        <div id="input-value">
          <input type="number" id="birthYear" required />
          <label for="birthYear">Năm sinh</label>
        </div>
        <button id="calculateAge">Tính tuổi</button>
      </div>
      <p id="result"></p>
      <div id="btns">
        <button id="shareResult">Chia sẻ kết quả</button>
        <button id="takePhoto">Chụp ảnh</button>
      </div>
      <img id="image" style="display: none; margin-top: 10px; max-width: 100%;" />
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      async function requestNotificationPermission() {
        const permStatus = await LocalNotifications.requestPermissions();

        if (permStatus.display !== "granted") {
          console.log("❌ Quyền thông báo chưa được cấp!");
          return false;
        }

        console.log("✅ Quyền thông báo đã được cấp.");
        return true;
      }

      self.shadowRoot
        .querySelector("#calculateAge")
        .addEventListener("click", async function () {
          const birthYearInput = self.shadowRoot.querySelector("#birthYear");
          const resultElement = self.shadowRoot.querySelector("#result");

          const birthYear = birthYearInput.value.trim(); // Xóa khoảng trắng thừa

          if (
            !birthYear ||
            isNaN(birthYear) ||
            birthYear < 1900 ||
            birthYear > new Date().getFullYear()
          ) {
            resultElement.textContent = "⚠️ Vui lòng nhập năm sinh hợp lệ!";
            resultElement.style.color = "red";
            return;
          }

          resultElement.style.color = "black"; // Reset màu chữ nếu hợp lệ

          const age = new Date().getFullYear() - parseInt(birthYear);
          resultElement.textContent = `Tuổi của bạn là: ${age}`;

          // Hiển thị thông báo
          const hasPermission = await requestNotificationPermission();
          if (!hasPermission) return;

          await LocalNotifications.schedule({
            notifications: [
              {
                title: "Kết quả tính tuổi",
                body: `Bạn ${age} tuổi.`,
                id: 1,
              },
            ],
          });
        });

      self.shadowRoot
        .querySelector("#shareResult")
        .addEventListener("click", async function (e) {
          const resultText =
            self.shadowRoot.querySelector("#result").textContent;
          if (!resultText) {
            return;
          }

          try {
            await Share.share({
              title: "Kết quả tính tuổi",
              text: resultText,
              dialogTitle: "Chia sẻ kết quả",
            });
          } catch (err) {
            console.error("Chia sẻ thất bại:", err);
          }
        });

      self.shadowRoot
        .querySelector("#takePhoto")
        .addEventListener("click", async function (e) {
          try {
            const photo = await Camera.getPhoto({
              resultType: "uri",
            });

            const image = self.shadowRoot.querySelector("#image");
            if (image) {
              image.src = photo.webPath;
              image.style.display = "block";
            }
          } catch (err) {
            console.warn("Người dùng đã hủy chụp ảnh:", err);
          }
        });
    }
  }
);

// window.customElements.define(
//   "capacitor-welcome-titlebar",
//   class extends HTMLElement {
//     constructor() {
//       super();
//       const root = this.attachShadow({ mode: "open" });
//       root.innerHTML = `
//     <style>
//       :host {
//         position: relative;
//         display: block;
//         padding: 15px 15px 15px 15px;
//         text-align: center;
//         background-color: #73B5F6;
//       }
//       ::slotted(h1) {
//         margin: 0;
//         font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
//         font-size: 0.9em;
//         font-weight: 600;
//         color: #fff;
//       }
//     </style>
//     <slot></slot>
//     `;
//     }
//   }
// );
