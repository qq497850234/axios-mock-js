/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/9/17
 * Time: 14:15
 * 观察重复请求
 * 重复请求会直接被被取消掉
 */

import axios from 'axios';
import { isComplexType, isObject } from '@bf/util';

const CancelToken = axios.CancelToken;

// 白名单
// 会跳过白名单
const whiteList = [];

// 缓存fetch请求
const fetchMapCache = {};

/**
 * 深入连接每一个属性
 * @param obj
 * @returns {string}
 */
function connectEveryPropertyDeep(obj) {
  if (!obj || (!isObject(obj) && !Array.isArray(obj))) return '';
  return Object.keys(obj).reduce(function(pre, next) {
    let v = obj[next];
    if (v && isComplexType(v)) {
      v = connectEveryPropertyDeep(v);
    }
    pre += '' + next + '=' + v + '&';
    return pre;
  }, '');
}

/**
 * 连接object
 * @param obj
 * @returns {*}
 */
function connectObject(obj) {
  if (!isComplexType(obj)) return obj;
  return connectEveryPropertyDeep(obj);
}

/**
 * 创建取消token的执行函数
 * @param req
 * @returns {null}
 */
function createCancelTokenExecute(req) {
  let cancelExecute = null;
  req.cancelToken = new CancelToken(c => (cancelExecute = c));
  return cancelExecute;
}

/**
 * 为每个请求创建一个唯一标识
 * 根据url+headers+method+params+data
 *
 * @param {Object} req
 */
function createUniqueSymbol(req) {
  const { url, headers, method, params, data } = req;
  return [url, headers, method, params, data].map(connectObject).join('&');
}

function isAlreadyExisted(symbol) {
  return fetchMapCache[symbol];
}

/**
 * 添加白名单
 * @param list
 */
function addWhiteList(list = []) {
  whiteList.push(...list);
}

function inWhiteList(req) {
  return whiteList.includes(req.url);
}

/**
 * 当request请求来时
 * 需要缓存该req
 * 并且判断是否为重复请求
 * @param next
 * @returns {function(...[*]=)}
 */
const useRepeatFetchWatcherRequest = next => req => {
  if (!inWhiteList(req)) {
    const symbolKey = createUniqueSymbol(req);

    // 保存key
    req.useRepeatFetchWatcher = {
      uniqueSymbolKey: symbolKey,
      fetchMapCache,
    };

    // 判断是否已经存在symbolKey
    // 即存在一模一样的fetch请求未完成
    // 这个时候应该去取消掉前面发起的请求
    if (isAlreadyExisted(symbolKey)) {
      fetchMapCache[symbolKey]();
      console.log('请求被取消！！！', symbolKey);
    }

    // 因为可能存在其他中间件，所以需要做一定的兼容处理
    // 兼容useCreateCancelToken中间件
    fetchMapCache[symbolKey] =
      req.useCreateCancelToken?.executeCancelFetch || createCancelTokenExecute(req);
  }
  next(req);
};

/**
 * 删除request创建的symbolKey对相应的fetchMapCache
 * @param next
 * @returns {function(...[*]=)}
 */
const useRepeatFetchWatcherResponse = next => res => {
  if (res.config?.useRepeatFetchWatcher?.uniqueSymbolKey) {
    delete fetchMapCache[res.config?.useRepeatFetchWatcher?.uniqueSymbolKey];
  }
  next(res);
};

export { addWhiteList, useRepeatFetchWatcherRequest, useRepeatFetchWatcherResponse };
