importScripts(chrome.runtime.getURL("/js/constants.js"));function openSettingPage(){chrome.runtime.openOptionsPage()}class _Config{constructor(){this.storage="undefined"==typeof browser?chrome.storage.sync:browser.storage.sync,this.storageName="config",this.buffer={};const a=this;this.storage.get(this.storageName,function(b){b[a.storageName]&&(a.buffer=b[a.storageName])})}save(a,b,c){this.buffer[a]=b;const d={};d[this.storageName]=this.buffer,this.storage.set(d,function(){"function"==typeof c&&c(b)})}load(a,b){if(this.buffer[a]!==void 0)"function"==typeof b&&b(this.buffer[a]);else{const c=this.storageName;this.storage.get(c,function(d){"function"!=typeof b||(d&&d[c]?b(d[c][a]):b(null))})}}remove(a,b){if(this.buffer[a]!==void 0){delete this.buffer[a];const c={};c[this.storageName]=this.buffer,this.storage.set(c,function(){"function"==typeof b&&b(!0)})}else"function"==typeof b&&b(!1)}}function fetchProblemsFromSolvedAc(a,b){const c=encodeURIComponent(a.join(","));fetch(`https://solved.ac/api/v3/problem/lookup?problemIds=${c}`).then(function(a){return a}).then(function(a){return a.json()}).then(b).catch(function(){return b(null)})}function fetchUsersFromSolvedAc(a,b){fetch(`https://solved.ac/api/v3/user/lookup?handles=${a}`).then(function(a){return a}).then(function(a){return a.json()}).then(b).catch(function(){return b(null)})}const Config=new _Config,Problems={data:{},fetchFromRemote:async function(){const a=this,b=await fetch(Constants.BG_PROBLEM_FETCH_URL).then(function(a){if(!a)throw"Can not fetch data from remote";return a.json()}).catch(function(a){return console.error(a),{last_updated:null}});if(null!==b){const{[Constants.BG_DB_PROBLEMS]:c}=await chrome.storage.local.get(Constants.BG_DB_PROBLEMS),d=JSON.parse(c||"{}");d&&d.last_updated&&b.last_updated==d.last_updated?a.data=d:(chrome.storage.local.set({[Constants.BG_DB_PROBLEMS]:JSON.stringify(b)}),a.data=b)}},get:function(a){a(this.data.problems)}};Problems.fetchFromRemote(),chrome.runtime.onMessage.addListener(function(a,b,c){switch(a.action){case"openSettingPage":openSettingPage();break;case"config.save":Config.save(a.data.key,a.data.value,c);break;case"config.load":Config.load(a.data.key,c);break;case"config.load.problems":Problems.get(c);break;case"config.remove":Config.remove(a.data.key,c);break;case"solved.ac.problems":fetchProblemsFromSolvedAc(a.data.value,c);break;case"solved.ac.users":fetchUsersFromSolvedAc(a.data.value,c);break;default:}return!0});