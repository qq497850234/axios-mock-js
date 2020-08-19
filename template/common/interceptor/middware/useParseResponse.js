/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/8/18
 * Time: 17:25
 *
 */

/**
 * 解析response
 * 去除多余的返回
 * 将服务器返回的data及headers作为新的res返回
 * @param next
 * @returns {Function}
 */
export default next => res => {
  next({
    ...res.data,
    data: res.data.data || null,
    headers: res.headers,
  });
};
