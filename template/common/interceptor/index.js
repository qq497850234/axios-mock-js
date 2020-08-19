/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/6/19
 * Time: 12:02
 *
 */
import { compose } from './utils';
import useRIInjectToken from './middware/useInjectToken';
import useCatchResponseCode from './middware/useCatchResponseCode';
import useParseResponse from './middware/useParseResponse';
/**
 * 应用中间件,返回promise，提供异步能力
 * 自行书写中间件的时候，需要注意保证代码的健壮性，如尽可能的判断值是否存在；
 * 其他注意事项，自行查看源码
 * 1. 提供中间件
 * 2. 提供req/res
 * @param middleware
 * @returns {function(*=): Promise<any>}
 */
const applyMiddleware = (...middleware) => req => {
  return new Promise(res => {
    compose(middleware)(v => {
      res(v);
    })(req);
  });
};
const createRequestInterceptorMiddleware = applyMiddleware(useRIInjectToken);
const createResponseInterceptorMiddleware = applyMiddleware(useCatchResponseCode, useParseResponse);
export { applyMiddleware, createRequestInterceptorMiddleware, createResponseInterceptorMiddleware };
