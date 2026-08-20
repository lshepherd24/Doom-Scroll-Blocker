export function get(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

export function set(data) {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
}

export function onChange(callback) {
  chrome.storage.onChanged.addListener(callback);
}
