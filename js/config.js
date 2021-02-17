const Config = {
  storageKeyPrefix: 'boj-extended-',

  getKey: function (key) {
    return this.storageKeyPrefix + key;
  },

  // can be bufferred
  save: function (key, value, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.save.bind(null, key, value, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.save',
        data: {
          key: key,
          value: value,
        },
      },
      callback
    );
    // Duplicate for HA (High Availability)
    window.localStorage.setItem(this.getKey(key), value);
  },

  load: function (key, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.load.bind(null, key, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.load',
        data: {
          key: key,
        },
      },
      (value) => {
        callback(value);
        window.localStorage.setItem(this.getKey(key), value);
      }
    );
  },

  remove: function (key, callback) {
    if (chrome.runtime.lastError) {
      console.warn(chrome.runtime.lastError.message);
      setTimeout(this.save.remove(null, key, callback), 100);
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'config.remove',
        data: {
          key: key,
        },
      },
      callback
    );
    window.localStorage.removeItem(this.getKey(key));
  },

  getProblems: function (callback) {
    chrome.runtime.sendMessage(
      {
        action: 'config.load.problems',
      },
      callback
    );
  },
};

// preload theme from localStorage
(() => {
  const html = document.documentElement;
  const theme = localStorage.getItem(Config.getKey('theme'));
  html.setAttribute('theme', theme || 'light');
})();
