/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/9/17
 * Time: 11:39
 * 为每个请求创建一个取消的token
 * 用于任何时候的取消请求
 */
import axios from 'axios';
import { uuid } from '@bf/util';

const CancelToken = axios.CancelToken;

// fetch取消执行方式的集合
const fetchMapOfCancelExecute = {};

/**
 * 执行取消所有的fetch
 */
function executeCancelAllFetch() {
  Object.keys(fetchMapOfCancelExecute).forEach(k => fetchMapOfCancelExecute[k]());
}

/**
 * 取消某个请求
 * @param uuid
 */
function executeCancelSomeFetch(uuid) {
  fetchMapOfCancelExecute[uuid]?.();
  return delete fetchMapOfCancelExecute[uuid];
}

/**
 * 执行取消特定的请求
 * @param uuid
 * @returns {function(): *}
 */
function executeCancelFetch(uuid) {
  return () => executeCancelSomeFetch(uuid);
}

const useCreateCancelTokenRequest = next => req => {
  let _execute = null;
  // 为每一个request请求创建一个uid
  const _uuid = uuid();

  // 创建取消token
  req.cancelToken = new CancelToken(execute => (_execute = execute));

  // 保存执行取消方法
  fetchMapOfCancelExecute[_uuid] = _execute;

  // 向req注入对象
  req.useCreateCancelToken = {
    uuid: _uuid,
    executeCancelFetch: executeCancelFetch(_uuid),
    fetchMapOfCancelExecute,
    executeCancelAllFetch,
    executeCancelSomeFetch,
  };
  console.log(req);
  next(req);
};
const useCreateCancelTokenResponse = next => res => {
  res?.config?.useCreateCancelToken?.executeCancelFetch();
  next(res);
};
export { useCreateCancelTokenRequest, useCreateCancelTokenResponse };
