/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/6/19
 * Time: 12:04
 *
 */
/**
 * compose
 * 将多个函数进行组合执行，让其拥有连续数据数据的能力，效果等于while/next形式
 * 参考与react-redux/koa库
 * @param middleware
 * @returns {function(*=): *}
 */
const compose = middleware => next => middleware.reduce((a, b) => (...args) => a(b(...args)))(next);
export { compose };
