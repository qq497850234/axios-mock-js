/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/6/19
 * Time: 12:04
 *
 */
import { getToken } from '@utils/authority';

/**
 * 注入headers token的中间件
 * @param next
 * @returns {Function}
 */
export default next => req => {
  if (!req.headers) {
    req.headers = {};
  }
  Object.assign(req.headers, { token: getToken() }), next(req);
};
