var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  'offline-store': 'offline-store-v' + CACHE_VERSION
};

var idbDatabase;
var IDB_VERSION = 1;
var STOP_RETRYING_AFTER = 86400000;
var STORE_NAME = 'urls';

function openDatabaseAndReplayRequests() {
  var indexedDBOpenRequest = indexedDB.open('offline-store', IDB_VERSION);

  indexedDBOpenRequest.onerror = function(error) {
    console.error('IndexedDB error:', error);
  };

  indexedDBOpenRequest.onupgradeneeded = function() {
    this.result.createObjectStore(STORE_NAME, {keyPath: 'url'});
  };

  indexedDBOpenRequest.onsuccess = function() {
    idbDatabase = this.result;
    replayFirebaseRequests();
  };
}

function getObjectStore(storeName, mode) {
  return idbDatabase.transaction(storeName, mode).objectStore(storeName);
}

function replayFirebaseRequests() {
  var savedRequests = [];

  getObjectStore(STORE_NAME).openCursor().onsuccess = function(event) {
    var cursor = event.target.result;

    if (cursor) {
      savedRequests.push(cursor.value);
      cursor.continue();
    } else {
      console.log('About to replay %d saved Firebase requests...',
        savedRequests.length);

      savedRequests.forEach(function(savedRequest) {
        var queueTime = Date.now() - savedRequest.timestamp;
        if (queueTime > STOP_RETRYING_AFTER) {
          getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
          console.log(' Request has been queued for %d milliseconds. ' +
            'No longer attempting to replay.', queueTime);
        } else {
          var requestUrl = savedRequest.url + '&qt=' + queueTime;

          console.log(' Replaying', requestUrl);

          fetch(requestUrl, {
            method: 'POST',
            body: savedRequest.body
          }).then(function(response) {
            if (response.status < 400) {
              getObjectStore(STORE_NAME, 'readwrite').delete(savedRequest.url);
              console.log(' Replaying succeeded.');
            } else {
              console.error(' Replaying failed:', response);
            }
          }).catch(function(error) {
            console.error(' Replaying failed:', error);
          });
        }
      });
    }
  };
}

openDatabaseAndReplayRequests();

self.addEventListener('activate', function(event) {
  var expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            console.log('Deleting out of date cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('Handling fetch event for', event.request.url);

  event.respondWith(
    caches.open(CURRENT_CACHES['offline-firebse']).then(function(cache) {
      return cache.match(event.request).then(function(response) {
        if (response) {
          console.log(' Found response in cache:', response);

          return response;
        }

        console.log(' No response for %s found in cache. ' +
          'About to fetch from network...', event.request.url);

        return fetch(event.request.clone()).then(function(response) {
          console.log('  Response for %s from network is: %O',
            event.request.url, response);

          let url = new URL(event.request.url);

          if (response.status < 400 && event.request.method !== 'POST' && url.protocol !== 'chrome-extension:') {
            cache.put(event.request, response.clone());
          } else if (response.status >= 500) {
            checkForFirebaseRequest(event.request);
          }

          return response;
        }).catch(function(error) {

          checkForFirebaseRequest(event.request);

          throw error;
        });
      }).catch(function(error) {
        throw error;
      });
    })
  );
});

function checkForFirebaseRequest(request) {
  var url = new URL(request.url);

  if (url.hostname === 'test-project-5c622.firebaseio.com' &&
       url.pathname === '/news.json') {
    console.log('  Storing firebase request in IndexedDB ' +
      'to be replayed later.');

    saveFirebaseRequest(request);
  }
}

function saveFirebaseRequest(request) {

  request.clone().text().then(function(body) {
      getObjectStore(STORE_NAME, 'readwrite').add({
        url: request.url,
        timestamp: Date.now(),
        body: body
      });
    });
}
