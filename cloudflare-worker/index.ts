// Author: Sean Pesce
//
// Setup commands:
//   npm create cloudflare@latest -- $WORKER_NAME
//       - Select "Hello World example"
//       - Select "Worker only"  ("Hello World Worker" on older versions)
//       - Select "TypeScript"
//       - Select "Yes" for "Do you want to use git for version control?"
//       - Select "No" for "Do you want to deploy your application?"
//   cd $WORKER_NAME
//   - Put this code in src/index.ts
//
// Deploy:
//   npx wrangler deploy


// Template modified from https://github.com/HTTPSRedirector/httpsredirector.github.io/blob/main/index.html
const HTML_TEMPLATE = `
<!DOCTYPE html>
<html>
    <!-- Author: Sean Pesce -->
    <head>
        <meta id="html-redirect" http-equiv="refresh" content="" />  <!-- Dynamically modified by back-end if needed -->
        <link rel="shortcut icon" href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABBVBMVEU/UbU/UbQ/UbY+ULI/ULM+T7BAUrc+ULM7TKg+T7E8Tq0/ULQ9T687Tao/Urc+ULQ6SqQ4SJ5CVLxCVb5DVr9CVL0dJlQoNHRBVLtEV8I8Taw/UrZEV8M6SqYkL2kfJ1gSFzQAAAAKDRwYHkMmMW01RJc6S6hDVsA8TasmMW4dJVMMDyEIChcuO4QJDBoAAQEBAQMEBgwcJFA6S6c0Q5UZIUkHCRMBAgQcJVEjLWUvPIYGBxAKDR0BAQIDBAk3R54OEicCAgUpNXY5SaM8Ta0cJE8FBg0TGTYVGzszQZExP4wXHkMZIUhAU7k9T7A2RpxDVsFBVLwuO4I4SKFBU7tBU7r///9e5KOYAAAAAWJLR0RWCg3piQAAAAd0SU1FB+cGHgwIFs0EkqsAAAC6SURBVBjTY2BAAEYmZhYkLhMrIxs7BxOSACcXNw8vHwM/OyNMRECQh5GdQUiYjZ2ZEaSSkZGRTUSUQUycU0KSQUqagZ1NRkpWTp5BQVFJWUVVTZpBXUNTS1tHgUFXT1HfwNDI2MTUTFHR3MKSgdnK2sZW0U7W3sFR0VHRyZnBRc3Vzd3DU0Lay9vDzEfGl4HRz8+fPSCQTTYogD3YjwHoBibpECZ2dgY2CWamUGmIi7jBJDsDIzcDWQAAiSYStruNAvgAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjMtMDYtMzBUMTI6MDg6MjIrMDA6MDDAnJm4AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIzLTA2LTMwVDEyOjA4OjIyKzAwOjAwscEhBAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyMy0wNi0zMFQxMjowODoyMiswMDowMObUANsAAAAASUVORK5CYII=">
        <title>HTTPS Redirector | Sean P</title>
        <style>
body {
    font: normal 11px Verdana, Arial, sans-serif;
    padding: 20px;
}
pre {
    background-color: rgb(230, 230, 230);
    padding: 5px;
    overflow-x: auto;
    font-size: 11px;
}
        </style>
    </head>
    <body>
        <h2>HTTPS Redirector</h2>
        <b>Author: Sean Pesce</b>
        <br><br><br><br>
        <span title="Redirecting to this URL"><b>Redirect URL:</b> <!-- <code id="redirect-url" style="background-color: rgb(230, 230, 230);"></code> --></span>
        <br>
        <input type="text" id="redirect-url" value="" name="redirect-url" placeholder="https://example.com" style="margin-top:5px;width:80%;" autocapitalize="off" autocorrect="off" autocomplete="off" spellcheck="false" >  <!-- Dynamically modified by back-end if needed -->
        <br>
        <button type="button" id="redirect-button" style="margin-top:5px; font-size:1.875em;" onclick="doRedirect(true)">Redirect</button>
        <br><br><br><br>
        <b>Other Resources:</b>
        <br><br>
        <a href="https://seanpesce.github.io/" target="_blank">Sean Pesce's Homepage</a>
    </body>
    <script>
        window.REQUEST_METHOD = null;  // Dynamically modified by back-end
        window.REQUEST_HEADERS = {};  // Dynamically modified by back-end
        window.REQUEST_BODY = null;  // Dynamically modified by back-end
        window.CLIENT_IP = null;  // Dynamically modified by back-end
    
        function htmlEscapeStr(str) {
            if (str == null) {
                str = '';
            }
            return str.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\\n/g, '&#10;').replace(/\\r/g, '&#13;');
        }

        function getFragmentParameters() {
            // Parse the URL fragment like the URL query segment
            var fragment = window.location.hash.substring(1);
            var params = {};
            var paramPairs = fragment.split('&');
            paramPairs.forEach(function(pair) {
                var keyValue = document.location.href.includes('~~~~~') ? pair.split('~~~~~') : pair.split('=');
                var key = decodeURIComponent(keyValue[0]);
                var value = decodeURIComponent(keyValue[1] || '');
                params[key] = value;
            });
            return params;
        }

        function getFragmentParam(key, defaultVal=null) {
            var params = getFragmentParameters();
            var paramVal = params[key];
            if ((paramVal == null || paramVal == '') && defaultVal != null) {
                return defaultVal;
            }
            return paramVal;
        }

        function getFragmentParamWithAnyKey(keys, defaultVal=null) {
            var paramVal = null;
            for (var k of keys) {
                paramVal = getFragmentParam(k);
                if (paramVal) {
                    break;
                } else {
                    paramVal = getFragmentParam(k.toLowerCase());
                    if (paramVal) {
                        break;
                    }
                }
            }
            return paramVal ? paramVal : defaultVal;
        }

        function getUrlParam(key, defaultVal=null) {
            var queryString = window.location.search;
            var urlParams = new URLSearchParams(queryString);
            var paramVal = urlParams.get(key);
            if ((paramVal == null || paramVal == '') && defaultVal != null) {
                return defaultVal;
            }
            return paramVal;
        }

        function getUrlParamWithAnyKey(keys, defaultVal=null) {
            var paramVal = null;
            for (var k of keys) {
                paramVal = getUrlParam(k);
                if (paramVal) {
                    break;
                } else {
                    paramVal = getUrlParam(k.toLowerCase());
                    if (paramVal) {
                        break;
                    }
                }
            }
            return paramVal ? paramVal : defaultVal;
        }

        function fixRedirectUrl(url) {
            if (!url) {
                return '';
            }
            // Allow "javascript:" and "data:" URLs
            var allowUnsafe = getUrlParamWithAnyKey(['unsafe', 'dangerous',], false);
            if ((!allowUnsafe) || allowUnsafe == '0' || allowUnsafe.toLowerCase() == 'false' || allowUnsafe.toLowerCase() == 'no') {
                allowUnsafe = false;
            }
            if ((!allowUnsafe) && (url.toLowerCase().startsWith('data:') || url.toLowerCase().startsWith('javascript:'))) {
                console.log('Unsafe redirect URI (use parameter "unsafe=1" for these kinds of URLs): ' + url);
                return null;
            }

            //if (url.toLowerCase().startsWith('http:')) {
            //    url = 'https' + url.substr(4);
            //}
            return url;
        }

        function getJsToEval() {
            var paramKeys = ['eval',];
            var jsCode = getUrlParamWithAnyKey(paramKeys, null);
            if (!jsCode) {
                jsCode = getFragmentParamWithAnyKey(paramKeys, null);
            }
            if (!jsCode) {
                paramKeys = ['b64Eval', 'base64Eval', 'evalB64', 'evalBase64'];
                jsCode = getUrlParamWithAnyKey(paramKeys, null);
                if (!jsCode) {
                    jsCode = getFragmentParamWithAnyKey(paramKeys, null);
                }
                if (!jsCode) {
                    return null;
                }
                try {
                    jsCode = atob(jsCode);
                } catch (err) {
                    console.error(\`[ERROR] Failed to decode Base64 JS payload: \${err}\`);
                    return null;
                }
            }
            return jsCode;
        }

        function getRedirectUrl() {
            var redirectUrl = document.getElementById('redirect-url').value;
            if (!redirectUrl) {
                var paramKeys = ['redirectUrl', 'redirect', 'url', 'uri', 'r', 'u',];
                redirectUrl = getUrlParamWithAnyKey(paramKeys, null);
                if (!redirectUrl) {
                    redirectUrl = getFragmentParamWithAnyKey(paramKeys, null);
                }
            }
            redirectUrl = fixRedirectUrl(redirectUrl);
            return redirectUrl;
        }

        function doHtmlRedirect(url) {
            var metaElement = document.getElementById('html-redirect');
            metaElement.content = \`0; URL=\${url}\`;
            var headElement = document.getElementsByTagName('head')[0];
            headElement.appendChild(metaElement);
        }

        function doRedirect(fromButton) {
            var redirectUrl = getRedirectUrl();
            if (!redirectUrl) {
                var msg = 'Invalid redirect URI';
                console.log(msg);
                if (fromButton) {
                    alert(msg);
                }
                return;
            }
            
            window.location.href = redirectUrl;
        }

        var jsCode = getJsToEval();
        if (jsCode) {
            try {
                eval(jsCode);
            } catch (err) {
                console.error(\`[ERROR] Failed to execute JS payload: \${err}\`);
            }
        }

        var redirectUrl = getRedirectUrl();
        var redirectUrlElement = document.getElementById('redirect-url').value = redirectUrl;
        
        var redirectType = '';  // Dynamically modified by back-end if needed
        if (redirectType === 'js') {
            doRedirect();
        }
    </script>
</html>
`;


// Check for a path segment that contains a Base64-encoded query param string (must start with "params;" or end with ";params").
// This facilitates "URL parameters" without using any of these characters: "?&=#" (to help bypass URL validation)
function getParamFromBase64Path(url: URL, keys: Array<string>, defaultVal: string|null = null): string|null {
  for (const segment of url.pathname.split('/')) {
    if (!segment) {
      continue;
    }
    try {
      // Try to decode the segment from base64
      const decoded = atob(segment); //Buffer.from(segment, 'base64').toString('utf8');

      // Handle "params;" prefix or ";params" suffix
      let paramStr: string = '';
      if (decoded.startsWith('p;')) {
        paramStr = decoded.slice('p;'.length);
      } else if (decoded.startsWith('params;')) {
        paramStr = decoded.slice('params;'.length);
      } else if (decoded.endsWith(';p')) {
        paramStr = decoded.slice(0, -';p'.length);
      } else if (decoded.endsWith(';params')) {
        paramStr = decoded.slice(0, -';params'.length);
      }

      if (!paramStr) {
        continue;
      }

      // Parse decoded string as query parameters
      const params = new URLSearchParams(paramStr);
      for (const key of keys) {
        const value = params.get(key);
        if (value !== null) {
          return value;
        }
      }
    } catch {
      // Ignore invalid Base64 or bad encodings
      continue;
    }
  }
  return defaultVal;
}


function getUrlParamWithAnyKey(url: URL, keys: Array<string>, defaultVal: string|null = null): string|null {
    var paramVal: string|null = null;
    for (var k of keys) {
        paramVal = url.searchParams.get(k);
        if (paramVal) {
            break;
        }
    }
    if (paramVal != null) {
      return paramVal;
    }
    return getParamFromBase64Path(url, keys, defaultVal);
}

function htmlEscapeStr(str: string|null): string {
    if (str == null) {
        str = '';
    }
    return str.replace(/&/g, '&amp;').replace(/'/g, '&apos;').replace(/"/g, '&quot;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/\n/g, '&#10;').replace(/\r/g, '&#13;');
}

function appendUrlQueryParam(url: string|URL, key: string, val: string): string {
  url = new URL(url);
  url.searchParams.append(key, val);
  return url.toString();
}


export default {
	async fetch(request, env, ctx): Promise<Response> {

    var errMsg: string = '';
    
    const reqUrl: URL = new URL(request.url);
    var httpRespCode: number = 200;

    // Get redirect type
    const defaultRedirectType = 302;
    const altNoRedirectKeys: Array<string|number|null|undefined> = ['0', 'no', 'false', 'null',];
    var non300RedirectTypes: Array<string|number|null|undefined> = ['js', 'javascript', 'html', 'none', 'fwd', 'forward',];
    non300RedirectTypes = non300RedirectTypes.concat(altNoRedirectKeys);
    var redirectType: string|number|null|undefined = getUrlParamWithAnyKey(reqUrl, ['redirectType','rt',], `${defaultRedirectType}`);
    redirectType = redirectType?.trim().toLowerCase();
    if (redirectType?.startsWith('3')) {
      const redirectTypeInt: number = parseInt(redirectType);
      if (isNaN(redirectTypeInt) || !(redirectTypeInt >= 300 && redirectTypeInt <= 399)) {
        redirectType = defaultRedirectType;
      } else {
        redirectType = redirectTypeInt;
        httpRespCode = redirectType;
      }
    } else if (!non300RedirectTypes.includes(redirectType)) {
      redirectType = defaultRedirectType;
    } else if (redirectType === 'javascript') {
      redirectType = 'js';
    } else if (redirectType === 'forward') {
      redirectType = 'fwd';
    } else if (altNoRedirectKeys.includes(redirectType)) {
      redirectType = 'none';
    }
    const is30XRedirect: boolean = ((typeof redirectType) === 'number' && (redirectType >= 300 && redirectType <= 399));

    // Determine HTTP response code (depending on redirect type) and redirect URL
    var redirectUrl: string|null = getUrlParamWithAnyKey(reqUrl, ['r','u','url','uri','redir','redirect','redirectUrl',], null);
    if ((!redirectUrl) && (is30XRedirect || redirectType === 'fwd')) {
      httpRespCode = 400;
      errMsg = '[ERROR] Please provide a redirect URL with the "u" query parameter, or specify "redirectType=js", "redirectType=html", or "redirectType=none"';
      return new Response(errMsg, { status: httpRespCode });
    }

    //////// Gather all information to expose to the front-end JS ////////
    // Client's IP address
    const clientIpAddr: string|null = request.headers.get('CF-Connecting-IP');
    // Request headers
    const reqHeaders: { [key: string]: string } = {};
    for (const [hdrName, hdrValue] of request.headers.entries()) {
      reqHeaders[hdrName] = hdrValue;
    }
    var requestBody = await request.text();

    if (redirectType === 'fwd') {
      // Forward the request to a secondary server
      const fwdReqBody: { [key: string]: string|null|{[key:string]:string} } = {};
      fwdReqBody.method = request.method;
      fwdReqBody.url = request.url;
      fwdReqBody.headers = reqHeaders;
      if (requestBody) {
        fwdReqBody.body = requestBody;
      } else {
        fwdReqBody.body = null;
      }
      const fwdedResponse = await fetch(`${redirectUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fwdReqBody),
      });
      // Return the secondary server's response
      const fwdRespBody: { [key: string]: string|number|null|{[key:string]:string} } = {};
      fwdRespBody.url = redirectUrl;
      fwdRespBody.status = fwdedResponse.status;
      const fwdRespBodyHeaders: { [key: string]: string } = {};
      for (const [hdrName, hdrValue] of fwdedResponse.headers.entries()) {
        fwdRespBodyHeaders[hdrName] = hdrValue;
      }
      fwdRespBody.headers = fwdRespBodyHeaders;
      fwdRespBody.body = await fwdedResponse.text();
      // Respond to the original request
      var fwdResponse: Response = new Response(JSON.stringify(fwdRespBody), { status: 200, });
      fwdResponse.headers.set('Content-Type', 'application/json');
      return fwdResponse;
    }

    var response: Response = new Response('', { status: httpRespCode });
    var responseBody = '';

    // Append request headers and body to redirect URL query parameters for 30x and HTML redirects
    if (redirectUrl && (is30XRedirect || redirectType === 'html')) {
      redirectUrl = appendUrlQueryParam(redirectUrl, 'SeanP-FwdReqMethod', request.method);
      redirectUrl = appendUrlQueryParam(redirectUrl, 'SeanP-FwdReqHdrs', JSON.stringify(reqHeaders));
      //redirectUrl = appendUrlQueryParam(redirectUrl, 'SeanP-FwdReqHdrs-B64', btoa(JSON.stringify(reqHeaders)));
      if (requestBody) {
        redirectUrl = appendUrlQueryParam(redirectUrl, 'SeanP-FwdReqBody', requestBody);
        //redirectUrl = appendUrlQueryParam(redirectUrl, 'SeanP-FwdReqBody-B64', btoa(requestBody));
      }
    }

    if (is30XRedirect && redirectUrl) {
      response.headers.set('Location', redirectUrl);
      // Echo all request headers
      for (const [hdrName, hdrValue] of request.headers.entries()) {
        response.headers.set(`X-SeanP-FwdHdr-${hdrName}`, hdrValue);
      }
    } else {
      response.headers.set('Content-Type', 'text/html');
      // Build HTML page from template
      responseBody = HTML_TEMPLATE;
      if (redirectUrl) {
        responseBody = responseBody.replace('id="redirect-url" value="', `id="redirect-url" value="${htmlEscapeStr(redirectUrl)}`);
        if (redirectType === 'html') {
          responseBody = responseBody.replace('http-equiv="refresh" content="', `http-equiv="refresh" content="0; URL=${htmlEscapeStr(redirectUrl)}`);
        }
      }
      responseBody = responseBody.replace('REQUEST_METHOD = null', `REQUEST_METHOD = ${JSON.stringify(request.method)}`);
      responseBody = responseBody.replace('var redirectType = \'', `var redirectType = '${redirectType}`);
      responseBody = responseBody.replace('REQUEST_HEADERS = {}', `REQUEST_HEADERS = ${JSON.stringify(reqHeaders)}`);
      responseBody = responseBody.replace('CLIENT_IP = null', `CLIENT_IP = ${JSON.stringify(clientIpAddr)}`);
      if (requestBody) {
        responseBody = responseBody.replace('REQUEST_BODY = null', `REQUEST_BODY = ${JSON.stringify(requestBody)}`);
      }
      response = new Response(responseBody, { status: httpRespCode, headers: response.headers });
    }
      
    // Allow all CORS
    const requestOrigin: string|null = request.headers.get('origin');
    if (requestOrigin) {
      response.headers.set('Access-Control-Allow-Origin', requestOrigin);
    } else {
      response.headers.set('Access-Control-Allow-Origin', '*');
    }
    response.headers.set('Access-Control-Allow-Methods', '*');
    response.headers.set('Access-Control-Max-Age', '86400');
    //response.headers.set('Vary', 'Origin');  // Indicate the response can vary by origin
    response.headers.set('Vary', '*');  // Indicate the response should not be cached

		return response;
	},
} satisfies ExportedHandler<Env>;
