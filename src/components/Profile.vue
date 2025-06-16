<template>
    <div class="container">
      <!-- Баннер -->
      <div
        class="banner"
        :style="{ backgroundImage: `url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1470&q=80')` }"
      >
        <img
            src="https://avatars.githubusercontent.com/u/78544679?v=4"
            alt="Аватар"
            class="avatar"
        />
      </div>
  
      <!-- Основная информация -->
      <div class="info-block">
        <div class="info-header">

            <div class="text-info">
              <div class="title-with-icon">
                <h1>Блог Дениса</h1>
                <svg
                  class="check-icon"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <p class="subtitle">
                С позитивом по всем красотам <span class="emoji">💀</span>
              </p>
              <p class="readers-count">
                <svg
                  class="icon-message"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H6l-4 4V5z" />
                </svg>
                3 529 читателей
              </p>
            </div>
          </div>
  
          <div class="buttons-group">
            <button>Статистика</button>
            <button>Редактировать</button>
            <button aria-label="Дополнительные опции">...</button>
          </div>
        </div>
  
        <div class="info-grid">
            <div>
                <h3>Описание</h3>
                <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce in
                sapien non mauris porttitor fermentum nec sit amet tortor. Phasellus
                molestie libero sit amet dui eleifend feugiat. Phasellus hendrerit
                interdum mattis. Donec bibendum velit risus, nec vestibulum dui
                sodales ut. Duis dapibus lorem eu sapien rutrum fringilla. Cras sed
                ligula sed justo volutpat dictum. Nulla facilisi. Cras volutpat, enim
                a maximus tincidunt, elit lacus bibendum dolor.
                </p>
            </div>

            <!-- Вынесенный блок с местоположением и категорией -->
            <div class="location-category">
                <div class="location">
                <h3>Местоположение</h3>
                <p>Астана, Казахстан</p>
                </div>
                <div class="category">
                <h3>Категория</h3>
                <p>Пешие путешествия</p>
                </div>
            </div>
        </div>

        <div class="social-links">
        <a
          href="https://www.youtube.com/@blogdenisa"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link youtube"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
            alt="YouTube"
            class="social-icon"
          />
          <div class="social-text">
            <span class="name">Блог Дениса</span>
            <span class="subs">31 257 подписчиков</span>
          </div>
        </a>
  
        <a
          href="https://twitch.tv/triplive"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link twitch"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/56/Twitch_logo_2022.svg"
            alt="Twitch"
            class="social-icon"
          />
          <div class="social-text">
            <span class="name">TripLive</span>
            <span class="subs">1 257 фолловеров</span>
          </div>
        </a>
  
        <a
          href="https://vk.com/meteiyke"
          target="_blank"
          rel="noopener noreferrer"
          class="social-link vk"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/2/21/VK.com-logo.svg"
            alt="VK"
            class="social-icon"
          />
          <div class="social-text">
            <span class="name">Денис Иващенко</span>
            <span class="subs">247 друзей</span>
          </div>
        </a>
  
        <button class="social-link add-button">
          <svg
            class="add-icon"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="16" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          Добавить
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {};
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 92rem;
    margin: 0 auto;
    padding: 1rem;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    color: #333;
    border-radius: 2rem;
  }
  
  /* Баннер */
  .banner {
    position: relative;
    background-size: cover;
    background-position: center;
    border-radius: 2rem;
    overflow: visible; /* чтобы аватар не обрезался */
    margin-bottom: -0.0rem; /* чтобы аватар не накладывался на следующий блок */
    height: 220px;
  }
  
  .avatar {
    position: absolute;
    left: 1.5rem;
    bottom: -100px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 7px solid white;
    object-fit: cover;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  
  /* Новый маленький аватар для блока с текстом справа */
  .avatar-small {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    border: 7px solid white;
    object-fit: cover;
    background-color: white;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
    flex-shrink: 0;
  }
  
  /* Основной блок информации */
  .info-block {
    position: relative;
    background-color: white;
    border-radius: 1rem;
    padding: 1.5rem;
    padding-top: 0.1rem;
    margin-bottom: 1.9rem;
  }
  
  .info-header {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    justify-content: space-between;
  }
  
  @media (min-width: 768px) {
    .info-header {
      flex-direction: row;
      align-items: center;
    }
  }
  
  /* Новый контейнер с аватаркой и текстом */
  .avatar-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex: 1;
  }
  
  .text-info {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
  }
  
  /* Стили для заголовка с иконкой */
  .title-with-icon {
    display: flex;
    align-items: center;
    margin-left: 9.7rem;
    gap: 0.5rem;
  }
  
  h1 {
    font-size: 1.875rem;
    font-weight: 700;
    color: #111827;
    margin: 0;
  }
  
  .check-icon {
    width: 20px;
    height: 20px;
    color: #22c55e; /* зеленый */
  }
  
  .subtitle {
    color: #4b5563;
    margin-top: -0.5rem;
    font-size: 1.125rem;
    line-height: 1.4;
    margin-left: 9.7rem;
  }
  
  .emoji {
    font-size: 1.25rem;
  }
  
  .readers-count {
    color: #6b7280;
    margin-top: 0.25rem;
    margin-left: 9.7rem;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .icon-message {
    width: 16px;
    height: 16px;
    color: #9ca3af;
  }
  
.buttons-group {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.75rem;
}

button {
    padding: 0.8rem 2.5rem;
    border-radius: 12px;
    background-color: #f3f4f6;
    border: none;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
}
  
button:hover {
    background-color: #e5e7eb;
}
  
button[aria-label="Дополнительные опции"] {
    width: 2.5rem;
    font-weight: 700;
    font-size: 1.5rem;
    line-height: 1;
    color: #6b7280;
    padding: 0;
    user-select: none;
  }
  

.info-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Больше места для описания */
  gap: 2rem;
  margin-top: -1rem;
  color: #374151;
  align-items: start;
  margin-left: 2rem;
}

.location-category {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-left: 3rem;

}

.location-category h3 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #111827;
}

.location-category p {
  margin: 0;
  color: #374151;
}



  
@media (min-width: 640px) {
  .info-grid {
    grid-template-columns: 2fr 1fr;
  }
}
  
  h3 {
    margin: 0 0 0.25rem 0;
    font-weight: 600;
    color: #111827;
  }
  
  /* Социальные ссылки */
  .social-links {
    margin-top: 3rem;
    margin-bottom: 2rem;
    margin-left: 2rem;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
  
  .social-link {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 0.75rem 1rem;
    border-radius: 1rem;
    box-shadow: 0 1px 2px rgb(0 0 0 / 0.1);
    text-decoration: none;
    color: #111827;
    flex-grow: 1;
    max-width: 320px;
    transition: box-shadow 0.2s ease;
  }
  
  .social-link:hover {
    box-shadow: 0 4px 6px rgb(0 0 0 / 0.15);
  }
  
  .social-icon {
    width: 30px;
    height: 30px;
    margin-right: 0.75rem;
    object-fit: contain;
  }
  
  .social-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .social-text .name {
    font-weight: 700;
    font-size: 1rem;
    line-height: 1.25;
  }
  
  .social-text .subs {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .social-link.youtube:hover {
    box-shadow: 0 0 10px #ff0000aa;
  }
  
  .social-link.twitch:hover {
    box-shadow: 0 0 10px #9146ffaa;
  }
  
  .social-link.vk:hover {
    box-shadow: 0 0 10px #4a76a8aa;
  }
  
  .add-button {
    justify-content: center;
    color: #2563eb;
    border: 2px dashed #2563eb;
    background-color: transparent;
    max-width: 100px;
  }
  
  .add-icon {
    width: 24px;
    height: 24px;
    margin-right: 0.5rem;
  }
  </style>
  