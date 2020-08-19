/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/8/18
 * Time: 14:57
 *
 */
import { Notification } from 'element-ui';
import { redirectToLogin } from '@utils';
const showNotificationMsg = msg => {
  Notification.error(msg);
};
const responseCodeMap = {
  '00000': { success: true, msg: 'success' },
  A0200: { success: false, msg: '用户登录异常', handler: redirectToLogin },
  A0230: { success: false, msg: '用户登录已过期', handler: redirectToLogin },
  A0311: { success: false, msg: '授权已过期', handler: redirectToLogin },
  A0440: { success: false, msg: '用户操作异常', handler: redirectToLogin },
};
/**
 * 处理response code
 * @param next
 * @returns {Function}
 */
export default next => res => {
  const { code, msg } = res?.data || {};
  const codeObj = responseCodeMap[code] || { success: false };
  // 注入success标识
  res.data.success = codeObj.success;
  if (!codeObj.success) {
    showNotificationMsg(msg || codeObj.msg);
    codeObj.handler?.();
  }
  next(res);
};
