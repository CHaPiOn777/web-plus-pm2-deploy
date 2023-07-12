
const getResponse = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
}

class Api {
    constructor(address) {
      this._address = address;
    }

    setToken(token) {
      this._token = token;
    }


    getAppInfo() {
      return Promise.all([this.getCardList(), this.getUserInfo()]);
    }

    getCardList() {
      return fetch(`${this._address}/cards`, {
        headers: {
          'Authorization': `Bearer ${this._token}`,
        },
      })
      .then(getResponse)
    }

    addCard({ name, link }) {
      return fetch(`${this._address}/cards`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          link,
        }),
      })
      .then(getResponse)
    }

    removeCard(cardId) {
      return fetch(`${this._address}/cards/${cardId}`, {
        method: 'DELETE',
        mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
      }).then(getResponse)
    }

    getUserInfo() {
      return fetch(`${this._address}/users/me`, {
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
      })
      .then(getResponse)
    }

    setUserInfo({ name, about }) {
      return fetch(`${this._address}/users/me`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          about,
        }),
      })
        .then(getResponse);
    }

    setUserAvatar({ avatar }) {
      return fetch(`${this._address}/users/me/avatar`, {
        method: 'PATCH',
        mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatar,
        }),
      }).then(getResponse)
    }

    changeLikeCardStatus(cardId, like) {

      return fetch(`${this._address}/cards/${cardId}/likes`, {
        method: like ? 'PUT' : 'DELETE',
        mode: 'no-cors',
        headers: {
          'Authorization': `Bearer ${this._token}`,
          'Content-Type': 'application/json',
        },
      }).then(getResponse)
    }

    register(email, password) {
      return fetch(`${this._address}/signup`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })
      .then(getResponse)
    }

    login(email, password) {
      return fetch(`${this._address}/signin`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
      })
      .then(getResponse)
      .then((data) => {
        this.setToken(data.token);
        localStorage.setItem('jwt', data.token)
        return data;
      })
    }

    checkToken(token) {
      return fetch(`${this._address}/users/me`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(getResponse)
  }
  }
  // Замените на адрес вашего бэкенда
  const api = new Api('https://api.vladislav.student.nomoredomains.work');

  export default api;
