/* eslint-disable */
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { defaultsDeep } from "lodash";

const instance = axios.create({
  // 因为后台CORS规范中access-control-origin返回的是*
  // 并且他们不需要cookie，所以暂且取消自动携带cookie
  withCredentials: false,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

function createAPI(baseURL) {
  return function(conf) {
    conf = conf || {};
    return instance(
      Object.assign(
        {},
        {
          url: conf.url,
          baseURL: baseURL,
          method: conf.method
        },
        conf.opts
      )
    );
  };
}

function convertRESTAPI(url, opts) {
  if (!opts || !opts.path) return url;

  const pathKeys = Object.keys(opts.path);

  pathKeys.forEach(key => {
    const r = new RegExp("(:" + key + "|{" + key + "})", "g");
    url = url.replace(r, opts.path[key]);
  });

  return url;
}

function useRequestInterceptor(
  beforeRequestHandler,
  errorHandler
){
  return instance.interceptors.request.use(beforeRequestHandler, errorHandler);
}

function useResponseInterceptor(
  successHandler,
  errorHandler
) {
  return instance.interceptors.response.use(successHandler, errorHandler);
}

function ejectRequestInterceptor(interceptorId) {
  instance.interceptors.request.eject(interceptorId);
}

function ejectResponseInterceptor(interceptorId) {
  instance.interceptors.response.eject(interceptorId);
}

function mergeDefaults(...defaults) {
  return (instance.defaults = defaultsDeep(instance.defaults, ...defaults));
}

export {
  createAPI,
  convertRESTAPI,
  useRequestInterceptor,
  useResponseInterceptor,
  ejectRequestInterceptor,
  ejectResponseInterceptor,
  mergeDefaults
};
