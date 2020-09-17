/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/8/26
 * Time: 15:06
 *
 */

/**
 * 将get请求的空字符参数去掉
 * @param next
 * @returns {Function}
 */
export default next => res => {
  if (res.method === 'get') {
    let p = res.params;
    res.params = Object.keys(p).reduce((m, k) => ((p[k] || p[k] === 0) && (m[k] = p[k]), m), {});
  }
  next(res);
};
