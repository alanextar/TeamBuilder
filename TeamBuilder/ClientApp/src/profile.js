import React from 'react';
import { users } from './demo_dataset';

window.uaList = {
  ios: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Mobile Safari/537.36',
};

Object.defineProperty(navigator, 'userAgent', {
  get: function() {
    return window.localStorage.getItem('vkui-styleguide:ua') || window.uaList.ios;
  },
});

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const schemeOptions = ['bright_light', 'space_gray'].map((schemeId) => (
  <option value={schemeId} key={schemeId}>{schemeId}</option>
));

function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}



export function getAvatarUrl(id, size) {
  let object;

  if (id.indexOf('user_') === 0) {
    object = users.find((user) => 'user_' + user.screen_name === id);
    if (!object) {
      object = getRandomArrayElement(users);
    }
  } else {
    if (!photos.hasOwnProperty(id)) {
      id = getRandomObjectKey(photos);
    }
    object = photos[id];
  }

  if (size === 200) {
    return object.photo_200 || object.photo_100;
  } else {
    return object.photo_100;
  }
}

export function getRandomUser() {
  const user = Object.assign({}, getRandomArrayElement(users));
  user.id = getRandomInt(1, 20e8);
  return user;
}

export function getRandomUsers(count) {
  let items = [];
  let names = {};

  for (let i = 0; i < count; i++) {
    let user = getRandomUser();

    if (names[user.name]) {
      for (let j = 0; j < 5; j++) {
        user = getRandomUser();
        if (!names[user.name]) {
          break;
        }
      }
    }

    items.push(user);
    names[user.name] = true;
  }

  return items;
}