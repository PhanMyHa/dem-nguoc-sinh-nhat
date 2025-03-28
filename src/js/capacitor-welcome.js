import { SplashScreen } from "@capacitor/splash-screen";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Share } from "@capacitor/share";
import { Device } from "@capacitor/device";

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
          font-family: Arial, sans-serif;
        }

        body {
          background: rgb(249, 158, 255);
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        #container {
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          width: 350px;
          text-align: center;
        }

        #title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 15px;
        }

        #input-value {
          margin-bottom: 15px;
        }

        #input-value input {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 2px solid #ccc;
          border-radius: 8px;
          outline: none;
          transition: border 0.3s;
        }

        #input-value input:focus {
          border-color: #4CAF50;
        }

        #calculate {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          background-color: #4CAF50;
          cursor: pointer;
          transition: 0.3s;
          margin-bottom: 10px;
        }

        #calculate:hover {
          background-color: #45a049;
        }

        #btns {
          display: flex;
          flex-direction: column;
          gap: 10px;
          align-items: center;
        }

        #btns button {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: 0.3s;
        }

        #shareResult {
          background-color: #007BFF;
        }

        #shareResult:hover {
          background-color: #0069D9;
        }

        #batteryStatus {
          background-color: #FF9800;
        }

        #batteryStatus:hover {
          background-color: #F57C00;
        }

        #result {
          font-size: 18px;
          font-weight: bold;
          margin: 15px 0;
        }
      </style>

      <div id="container">
        <h1 id="title">Đếm ngược sinh nhật</h1>
        <div id="input-value">
          <input type="text" id="birthDate" placeholder="Nhập ngày sinh (dd/mm)" required />
        </div>
        <button id="calculate">Tính ngày còn lại</button>
        <p id="result"></p>
        <div id="btns">
          <button id="shareResult">Chia sẻ</button>
          <button id="batteryStatus">Xem trạng thái pin</button>
        </div>
      </div>
      `;
    }

    connectedCallback() {
      const self = this;

      async function requestNotificationPermission() {
        const permStatus = await LocalNotifications.requestPermissions();
        return permStatus.display === "granted";
      }

      self.shadowRoot
        .querySelector("#calculate")
        .addEventListener("click", async function () {
          const birthDateInput = self.shadowRoot.querySelector("#birthDate");
          const resultElement = self.shadowRoot.querySelector("#result");

          const birthDate = birthDateInput.value.trim();
          const [day, month] = birthDate.split("/").map(Number);
          if (!day || !month || day < 1 || day > 31 || month < 1 || month > 12) {
            resultElement.textContent = "Vui lòng nhập đúng định dạng (dd/mm)!";
            resultElement.style.color = "red";
            return;
          }

          const now = new Date();
          let nextBirthday = new Date(now.getFullYear(), month - 1, day);
          if (nextBirthday < now) {
            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
          }

          const daysLeft = Math.ceil(
            (nextBirthday - now) / (1000 * 60 * 60 * 24)
          );
          resultElement.textContent = `Còn ${daysLeft} ngày đến sinh nhật 🎉`;
          resultElement.style.color = "black";

          if (await requestNotificationPermission()) {
            await LocalNotifications.schedule({
              notifications: [
                {
                  title: "Nhắc nhở 🎂",
                  body: `Còn ${daysLeft} ngày nữa là sinh nhật của bạn!`,
                  id: 1,
                },
              ],
            });
          }
        });

      self.shadowRoot
        .querySelector("#shareResult")
        .addEventListener("click", async function () {
          const resultText = self.shadowRoot.querySelector("#result").textContent;
          if (!resultText) return;

          try {
            await Share.share({
              title: "Đếm ngược sinh nhật",
              text: resultText,
              dialogTitle: "Chia sẻ kết quả",
            });
          } catch (err) {
            console.error("Lỗi chia sẻ:", err);
          }
        });

      self.shadowRoot
        .querySelector("#batteryStatus")
        .addEventListener("click", async function () {
          try {
            const batteryInfo = await Device.getBatteryInfo();
            alert(`Pin hiện tại: ${Math.round(batteryInfo.batteryLevel * 100)}%`);
          } catch (err) {
            console.error("Lỗi lấy trạng thái pin:", err);
          }
        });
    }
  }
);
