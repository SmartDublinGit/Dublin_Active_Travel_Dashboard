import { j as json } from "../../../chunks/index.js";
import "d3";
async function POST({ request }) {
  const { a } = await request.json();
  await console.log(a);
  const options = {
    method: "GET",
    headers: { accept: "application/json", "X-API-KEY": { "NVM_INC": "/Users/rudi/.nvm/versions/node/v20.11.1/include/node", "MANPATH": "/Users/rudi/.nvm/versions/node/v20.11.1/share/man:/opt/homebrew/share/man:/usr/share/man:/usr/local/share/man:/Users/rudi/.nvm/versions/node/v20.11.1/share/man:/opt/homebrew/share/man::", "TERM_PROGRAM": "vscode", "NODE": "/Users/rudi/.nvm/versions/node/v20.11.1/bin/node", "INIT_CWD": "/Users/rudi/Documents/GitHub/active_travel_new", "NVM_CD_FLAGS": "-q", "TERM": "xterm-256color", "SHELL": "/bin/zsh", "HOMEBREW_REPOSITORY": "/opt/homebrew", "TMPDIR": "/var/folders/c6/jsjxnj0j6vqbnpqy37npy5dw0000gn/T/", "npm_config_global_prefix": "/Users/rudi/.nvm/versions/node/v20.11.1", "TERM_PROGRAM_VERSION": "1.93.1", "ZDOTDIR": "/Users/rudi", "ORIGINAL_XDG_CURRENT_DESKTOP": "undefined", "MallocNanoZone": "0", "COLOR": "1", "npm_config_noproxy": "", "npm_config_local_prefix": "/Users/rudi/Documents/GitHub/active_travel_new", "NVM_DIR": "/Users/rudi/.nvm", "USER": "rudi", "COMMAND_MODE": "unix2003", "npm_config_globalconfig": "/Users/rudi/.nvm/versions/node/v20.11.1/etc/npmrc", "SSH_AUTH_SOCK": "/private/tmp/com.apple.launchd.FFteYWhD7t/Listeners", "__CF_USER_TEXT_ENCODING": "0x1F5:0:2", "npm_execpath": "/Users/rudi/.nvm/versions/node/v20.11.1/lib/node_modules/npm/bin/npm-cli.js", "STARDOG_HOME": "/var/stardog", "PATH": "/Users/rudi/Documents/GitHub/active_travel_new/node_modules/.bin:/Users/rudi/Documents/GitHub/node_modules/.bin:/Users/rudi/Documents/node_modules/.bin:/Users/rudi/node_modules/.bin:/Users/node_modules/.bin:/node_modules/.bin:/Users/rudi/.nvm/versions/node/v20.11.1/lib/node_modules/npm/node_modules/@npmcli/run-script/lib/node-gyp-bin:/opt/homebrew/opt/openjdk/bin:/opt/homebrew/opt/openjdk/bin:/Users/rudi/.nvm/versions/node/v20.11.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.9/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin:/opt/homebrew/opt/openjdk/bin:/Users/rudi/.nvm/versions/node/v20.11.1/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/Library/Frameworks/Python.framework/Versions/3.9/bin", "npm_package_json": "/Users/rudi/Documents/GitHub/active_travel_new/package.json", "_": "/Users/rudi/Documents/GitHub/active_travel_new/node_modules/.bin/vite", "npm_config_userconfig": "/Users/rudi/.npmrc", "npm_config_init_module": "/Users/rudi/.npm-init.js", "USER_ZDOTDIR": "/Users/rudi", "__CFBundleIdentifier": "com.microsoft.VSCode", "npm_command": "run-script", "PWD": "/Users/rudi/Documents/GitHub/active_travel_new", "npm_lifecycle_event": "build", "EDITOR": "vi", "npm_package_name": "dataviz-project-starter-kit", "LANG": "en_US.UTF-8", "npm_config_npm_version": "10.2.4", "VSCODE_GIT_ASKPASS_EXTRA_ARGS": "", "XPC_FLAGS": "0x0", "npm_config_node_gyp": "/Users/rudi/.nvm/versions/node/v20.11.1/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js", "npm_package_version": "0.3.0", "XPC_SERVICE_NAME": "0", "VSCODE_INJECTION": "1", "SHLVL": "2", "HOME": "/Users/rudi", "VSCODE_GIT_ASKPASS_MAIN": "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass-main.js", "HOMEBREW_PREFIX": "/opt/homebrew", "npm_config_cache": "/Users/rudi/.npm", "LOGNAME": "rudi", "npm_lifecycle_script": "vite build", "VSCODE_GIT_IPC_HANDLE": "/var/folders/c6/jsjxnj0j6vqbnpqy37npy5dw0000gn/T/vscode-git-92b83a983c.sock", "NVM_BIN": "/Users/rudi/.nvm/versions/node/v20.11.1/bin", "npm_config_user_agent": "npm/10.2.4 node/v20.11.1 darwin arm64 workspaces/false", "VSCODE_GIT_ASKPASS_NODE": "/Applications/Visual Studio Code.app/Contents/Frameworks/Code Helper (Plugin).app/Contents/MacOS/Code Helper (Plugin)", "GIT_ASKPASS": "/Applications/Visual Studio Code.app/Contents/Resources/app/extensions/git/dist/askpass.sh", "INFOPATH": "/opt/homebrew/share/info:/opt/homebrew/share/info:", "HOMEBREW_CELLAR": "/opt/homebrew/Cellar", "npm_node_execpath": "/Users/rudi/.nvm/versions/node/v20.11.1/bin/node", "npm_config_prefix": "/Users/rudi/.nvm/versions/node/v20.11.1", "COLORTERM": "truecolor", "NODE_ENV": "production" }.ECO_COUNTER_API }
  };
  let t = /* @__PURE__ */ new Date();
  const date = ("0" + t.getDate()).slice(-2);
  const month = ("0" + (t.getMonth() + 1)).slice(-2);
  const year = t.getFullYear();
  let dd = `${year}-${month}-${date}`;
  var delta = t.getTime() - 30 * 24 * 60 * 60 * 1e3;
  t.setTime(delta);
  const date2 = ("0" + t.getDate()).slice(-2);
  const month2 = ("0" + (t.getMonth() + 1)).slice(-2);
  const year2 = t.getFullYear();
  let dd2 = `${year2}-${month2}-${date2}`;
  t = /* @__PURE__ */ new Date();
  delta = t.getTime() - 90 * 24 * 60 * 60 * 1e3;
  t.setTime(delta);
  const date3 = ("0" + t.getDate()).slice(-2);
  const month3 = ("0" + (t.getMonth() + 1)).slice(-2);
  const year3 = t.getFullYear();
  let dd3 = `${year3}-${month3}-${date3}`;
  t = /* @__PURE__ */ new Date();
  delta = t.getTime() - 364 * 24 * 60 * 60 * 1e3;
  t.setTime(delta);
  const date4 = ("0" + t.getDate()).slice(-2);
  const month4 = ("0" + (t.getMonth() + 1)).slice(-2);
  const year4 = t.getFullYear();
  let dd4 = `${year4}-${month4}-${date4}`;
  t = /* @__PURE__ */ new Date();
  delta = t.getTime() - 364 * 3 * 24 * 60 * 60 * 1e3;
  t.setTime(delta);
  const date5 = ("0" + t.getDate()).slice(-2);
  const month5 = ("0" + (t.getMonth() + 1)).slice(-2);
  const year5 = t.getFullYear();
  let dd5 = `${year5}-${month5}-${date5}`;
  let url = await "https://api.eco-counter.com/api/v2/history/traffic/raw?siteId=" + a + "&include=&startDate=" + dd2 + "&endDate=" + dd + "&startTime=00%3A00&endTime=00%3A00&granularity=P1D&gapFilling=false&travelModes=bike&travelModes=pedestrian";
  let url2 = await "https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId=" + a + "&include=&startDate=" + dd3 + "&endDate=" + dd + "&startTime=00%3A00&endTime=00%3A00&granularity=P1W&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike";
  let url3 = await "https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId=" + a + "&include=&startDate=" + dd4 + "&endDate=" + dd + "&startTime=00%3A00&endTime=00%3A00&granularity=P1W&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike";
  let url4 = await "https://api.eco-counter.com/api/v2/history/traffic/aggregated?siteId=" + a + "&include=&startDate=" + dd5 + "&endDate=" + dd + "&startTime=00%3A00&endTime=00%3A00&granularity=P1M&groupBy=travelMode&gapFilling=false&travelModes=pedestrian&travelModes=bike";
  const lastMonth = await fetch(url, options).then((response) => response.json());
  const sixMonths = await fetch(url2, options).then((response) => response.json());
  const sixMonths_weekly = await fetch(url3, options).then((response) => response.json());
  const sixMonths_yearly = await fetch(url4, options).then((response) => response.json());
  const resp = { "lastMonth": lastMonth, "sixMonths": sixMonths, "sixMonths_weekly": sixMonths_weekly, "sixMonths_yearly": sixMonths_yearly };
  return json(resp);
}
export {
  POST
};
