/**
 * Created with JavaScript.
 * User: rgxmg
 * Email: rgxmg@foxmail.com
 * Date: 2020/8/18
 * Time: 14:57
 *
 */
import { Notification } from 'element-ui';
import { delToken, redirectToLogin } from '@utils';
const showNotificationMsg = msg => {
  Notification.error(msg);
};
const handleUserError = res => {
  delToken();
  redirectToLogin();
  // 执行取消所有fetch
  res?.config.useCreateCancelToken?.executeCancelAllFetch();
};
const responseCodeMap = {
  error: { success: false, msg: '服务器异常，请稍后重试或联系管理员' },
  '00000': { success: true, msg: 'success' },
  A0200: { success: false, msg: '用户登录异常', handler: handleUserError },
  A0230: { success: false, msg: '用户登录已过期', handler: handleUserError },
  A0311: { success: false, msg: '登录状态已失效', handler: handleUserError },
  A0440: { success: false, msg: '用户操作异常', handler: handleUserError },
};
/**
 * 处理response code
 * @param next
 * @returns {Function}
 */
export default next => res => {
  // 确保存在
  res.data = res?.data || { code: 'error' };
  const { code, msg } = res.data;
  const codeObj = responseCodeMap[code] || { success: false };
  // 注入success标识
  res.data.success = codeObj.success;
  if (!codeObj.success) {
    showNotificationMsg(codeObj.msg || msg);
    codeObj.handler?.(res);
  }
  next(res);
};
